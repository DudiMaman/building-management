/**
 * InvitationsService — management & worker onboarding (SPEC §5.5).
 *
 * create(): an admin invites someone by email/phone with a role; we mint a
 * single-use token with a TTL and return the accept URL (delivery via the
 * notifications channels is a thin follow-up).
 * accept(): the invitee (after signing up in Supabase Auth) redeems the token,
 * which provisions the matching domain row (management_users / maintenance_
 * workers) and links their supabase_user_id. Single-use + expiry enforced.
 */
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { DbService } from '../../db/db.service';

type Role = 'mgmt_admin' | 'mgmt_member' | 'maintenance' | 'resident';

interface CreateInvitationInput {
  role: Role;
  email?: string;
  phone_e164?: string;
  permissions?: string[];
  ttl_days?: number;
}

interface AcceptInvitationInput {
  token: string;
  supabase_user_id: string;
  full_name: string;
  phone_e164?: string;
}

@Injectable()
export class InvitationsService {
  private readonly logger = new Logger(InvitationsService.name);

  constructor(private readonly db: DbService) {}

  async create(tenantId: string, input: CreateInvitationInput) {
    if (!input.email && !input.phone_e164) {
      throw new BadRequestException('email or phone_e164 is required');
    }
    const token = randomBytes(24).toString('base64url');
    const ttlDays = input.ttl_days ?? 7;
    const expiresAt = new Date(Date.now() + ttlDays * 86_400_000).toISOString();

    const { rows } = await this.db.query<{ id: string }>(
      `insert into invitations (tenant_id, token, role, email, phone_e164, permissions, expires_at)
       values ($1, $2, $3, $4, $5, $6::jsonb, $7) returning id`,
      [
        tenantId,
        token,
        input.role,
        input.email ?? null,
        input.phone_e164 ?? null,
        input.permissions ? JSON.stringify(input.permissions) : null,
        expiresAt,
      ],
    );

    const base = process.env.ADMIN_PUBLIC_URL ?? 'http://localhost:3001';
    const acceptUrl = `${base}/invite/accept?token=${token}`;
    this.logger.log(`Invitation ${rows[0]!.id} created for ${input.email ?? input.phone_e164} (${input.role})`);
    return { id: rows[0]!.id, token, accept_url: acceptUrl, expires_at: expiresAt };
  }

  async accept(input: AcceptInvitationInput) {
    const invRes = await this.db.query<{
      id: string;
      tenant_id: string;
      role: Role;
      email: string | null;
      phone_e164: string | null;
      permissions: string[] | null;
      consumed_at: string | null;
      expires_at: string;
    }>(
      `select id, tenant_id, role, email, phone_e164, permissions, consumed_at, expires_at
       from invitations where token = $1`,
      [input.token],
    );
    const inv = invRes.rows[0];
    if (!inv) throw new NotFoundException('Invitation not found');
    if (inv.consumed_at) throw new BadRequestException('Invitation already used');
    if (new Date(inv.expires_at).getTime() < Date.now()) throw new BadRequestException('Invitation expired');

    let provisioned: { kind: string; id: string };
    if (inv.role === 'mgmt_admin' || inv.role === 'mgmt_member') {
      const { rows } = await this.db.query<{ id: string }>(
        `insert into management_users (tenant_id, full_name, email, role, supabase_user_id)
         values ($1, $2, $3, $4, $5) returning id`,
        [inv.tenant_id, input.full_name, inv.email ?? '', inv.role, input.supabase_user_id],
      );
      provisioned = { kind: 'management_user', id: rows[0]!.id };
    } else if (inv.role === 'maintenance') {
      const { rows } = await this.db.query<{ id: string }>(
        `insert into maintenance_workers (tenant_id, full_name, phone_e164, email, supabase_user_id)
         values ($1, $2, $3, $4, $5) returning id`,
        [inv.tenant_id, input.full_name, input.phone_e164 ?? inv.phone_e164 ?? '', inv.email, input.supabase_user_id],
      );
      provisioned = { kind: 'maintenance_worker', id: rows[0]!.id };
    } else {
      throw new BadRequestException('Residents onboard via QR claim, not invitations');
    }

    await this.db.query(
      `update invitations set consumed_at = now(), consumed_by_user_id = $2 where id = $1`,
      [inv.id, input.supabase_user_id],
    );

    return { ok: true, tenant_id: inv.tenant_id, role: inv.role, ...provisioned };
  }

  async list(tenantId: string) {
    const { rows } = await this.db.query(
      `select id, role, email, phone_e164, consumed_at, expires_at, created_at
       from invitations where tenant_id = $1 order by created_at desc`,
      [tenantId],
    );
    return rows;
  }

  async revoke(tenantId: string, id: string) {
    const { rowCount } = await this.db.query(
      `update invitations set expires_at = now() where id = $1 and tenant_id = $2 and consumed_at is null`,
      [id, tenantId],
    );
    return { ok: (rowCount ?? 0) > 0 };
  }
}
