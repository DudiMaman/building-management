import { Injectable, Logger } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { NotificationsService } from '../notifications/notifications.service';
import type { CreateBulletin } from '@bm/shared';

@Injectable()
export class BulletinService {
  private readonly logger = new Logger(BulletinService.name);

  constructor(
    private readonly db: DbService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(tenantId: string, authorUserId: string, input: CreateBulletin) {
    const post = await this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query<{ id: string; building_id: string; title: string; audience: any }>(
        `insert into bulletin_posts
          (tenant_id, building_id, author_user_id, title, body_md, pinned, pinned_until, expires_at,
           audience, reactions_enabled, comments_enabled, status, published_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,'published', now())
         returning *`,
        [
          tenantId,
          input.building_id,
          authorUserId,
          input.title,
          input.body_md,
          input.pinned,
          input.pinned_until ?? null,
          input.expires_at ?? null,
          JSON.stringify(input.audience),
          input.reactions_enabled,
          input.comments_enabled,
        ],
      );
      return rows[0]!;
    });

    // Distribution (SPEC §15.3): push the post to the targeted audience.
    // Best-effort, outside the tx — a notify failure must not fail authoring.
    try {
      await this.distribute(tenantId, post.building_id, post.audience, post.title);
    } catch (err) {
      this.logger.warn(`Bulletin distribution failed for ${post.id}: ${(err as Error).message}`);
    }
    return post;
  }

  /** Fan a published post out to the eligible residents of the building. */
  private async distribute(tenantId: string, buildingId: string, audience: any, title: string) {
    const recipients = await this.resolveAudience(tenantId, buildingId, audience);
    for (const personId of recipients) {
      await this.notifications.notifyPerson(
        tenantId,
        personId,
        'bulletin_new',
        { title },
        { event_key: `bulletin:${buildingId}:${title}` },
      );
    }
  }

  /** Active residents of the building whose role matches the post audience. */
  private async resolveAudience(tenantId: string, buildingId: string, audience: any): Promise<string[]> {
    const { rows } = await this.db.query<{ person_id: string; roles: string[] }>(
      `select aa.person_id, array_agg(distinct aa.role) as roles
       from apartment_assignments aa
       join apartments a on a.id = aa.apartment_id
       where aa.tenant_id = $1 and a.building_id = $2 and aa.status = 'active'
       group by aa.person_id`,
      [tenantId, buildingId],
    );
    const wantedRoles: string[] = Array.isArray(audience?.roles) ? audience.roles : [];
    const all = wantedRoles.length === 0 || wantedRoles.includes('all');
    return rows
      .filter((r) => all || r.roles.some((role) => wantedRoles.includes(role)))
      .map((r) => r.person_id);
  }

  /** Admin view — every published post for the building. */
  async listForBuilding(tenantId: string, buildingId: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query(
        `select * from bulletin_posts
         where building_id = $1 and status = 'published'
           and (expires_at is null or expires_at > now())
         order by (pinned and (pinned_until is null or pinned_until > now())) desc, published_at desc nulls last`,
        [buildingId],
      );
      return rows;
    });
  }

  /**
   * Resident view — only posts whose audience targets the resident's role
   * (SPEC §15.2). Expired pins are treated as unpinned for ordering.
   */
  async listForResident(tenantId: string, personId: string, buildingId: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'resident' }, async (c) => {
      const { rows } = await c.query(
        `with myroles as (
           select coalesce(array_agg(distinct aa.role), '{}') as roles
           from apartment_assignments aa
           join apartments a on a.id = aa.apartment_id
           where aa.tenant_id = $1 and aa.person_id = $2
             and aa.status = 'active' and a.building_id = $3
         )
         select bp.*
         from bulletin_posts bp, myroles
         where bp.building_id = $3 and bp.status = 'published'
           and (bp.expires_at is null or bp.expires_at > now())
           and (
             bp.audience->'roles' is null
             or jsonb_array_length(coalesce(bp.audience->'roles', '[]'::jsonb)) = 0
             or bp.audience->'roles' ? 'all'
             or bp.audience->'roles' ?| myroles.roles
           )
         order by (bp.pinned and (bp.pinned_until is null or bp.pinned_until > now())) desc,
                  bp.published_at desc nulls last`,
        [tenantId, personId, buildingId],
      );
      return rows;
    });
  }

  async react(tenantId: string, postId: string, personId: string, emoji: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'resident' }, async (c) => {
      await c.query(
        `insert into bulletin_reactions (tenant_id, post_id, person_id, emoji)
         values ($1, $2, $3, $4) on conflict do nothing`,
        [tenantId, postId, personId, emoji],
      );
      return { ok: true };
    });
  }
}
