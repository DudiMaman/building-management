import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { createHmac } from 'node:crypto';
import {
  verifyVoteSignature,
  canonicalVoteJson,
  type VoteSignaturePayload,
} from './signature';
import type { CreatePoll } from '@bm/shared';

@Injectable()
export class PollsService {
  constructor(private readonly db: DbService) {}

  async create(tenantId: string, authorUserId: string, input: CreatePoll) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query(
        `insert into polls
          (tenant_id, building_id, author_user_id, title, description, type, options,
           eligibility, anonymous, opens_at, closes_at, requires_signature, status)
         values ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10,$11,$12,'open')
         returning *`,
        [
          tenantId,
          input.building_id,
          authorUserId,
          input.title,
          input.description ?? null,
          input.type,
          JSON.stringify(input.options),
          input.eligibility,
          input.anonymous,
          input.opens_at,
          input.closes_at,
          input.requires_signature,
        ],
      );
      return rows[0];
    });
  }

  async vote(
    tenantId: string,
    pollId: string,
    personId: string,
    apartmentId: string,
    choice: unknown,
    signature?: VoteSignaturePayload,
  ) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'resident' }, async (c) => {
      // Eligibility check
      const pollRes = await c.query<{ eligibility: string; anonymous: boolean; requires_signature: boolean }>(
        `select eligibility, anonymous, requires_signature
           from polls where id = $1 and status = 'open'`,
        [pollId],
      );
      if (pollRes.rows.length === 0) throw new NotFoundException('Poll not open');
      const poll = pollRes.rows[0]!;

      const assignRes = await c.query<{ role: string; is_bill_payer: boolean }>(
        `select role, is_bill_payer from apartment_assignments
         where apartment_id = $1 and person_id = $2 and status = 'active'
         limit 1`,
        [apartmentId, personId],
      );
      const assign = assignRes.rows[0];
      if (!assign) throw new ForbiddenException('No active assignment');
      if (poll.eligibility === 'owner_only' && assign.role !== 'owner') {
        throw new ForbiddenException('Owner-only poll');
      }
      if (poll.eligibility === 'bill_payer_only' && !assign.is_bill_payer) {
        throw new ForbiddenException('Bill-payer-only poll');
      }

      // Signature verification — required for binding polls per SPEC §16.4.
      let signatureBlob: string | null = null;
      if (poll.requires_signature) {
        if (!signature) {
          throw new BadRequestException('Signature required for this poll');
        }
        const result = await verifyVoteSignature(
          {
            poll_id: pollId,
            person_id: personId,
            apartment_id: apartmentId,
            choice,
            signed_at: signature.signed_at,
          },
          signature,
        );
        if (!result.ok) {
          throw new BadRequestException(`Signature rejected: ${result.reason}`);
        }
        signatureBlob = Buffer.from(
          JSON.stringify({ ...signature, fingerprint: result.fingerprint ?? null }),
        ).toString('base64');
      }

      const personHash = poll.anonymous
        ? createHmac('sha256', `poll:${pollId}`).update(personId).digest('hex')
        : null;

      const { rows } = await c.query(
        `insert into votes (tenant_id, poll_id, person_id, person_id_hash, apartment_id, choice, signature_blob, voted_at)
         values ($1, $2, $3, $4, $5, $6::jsonb, $7, now())
         on conflict do nothing returning *`,
        [
          tenantId,
          pollId,
          poll.anonymous ? null : personId,
          personHash,
          apartmentId,
          JSON.stringify(choice),
          signatureBlob,
        ],
      );
      return rows[0];
    });
  }

  async results(tenantId: string, pollId: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query(
        `select choice, count(*)::int as votes from votes where poll_id = $1 group by choice`,
        [pollId],
      );
      return rows;
    });
  }

  /**
   * Re-verify every signed vote on a poll. Returns one row per signed
   * vote with { vote_id, ok, reason? } — used by the admin audit screen
   * and the daily integrity job.
   */
  async auditSignatures(tenantId: string, pollId: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query<{
        id: string;
        person_id: string | null;
        apartment_id: string;
        choice: unknown;
        signature_blob: string | null;
      }>(
        `select id, person_id, apartment_id, choice, signature_blob
           from votes where poll_id = $1 and signature_blob is not null`,
        [pollId],
      );
      const results: Array<{ vote_id: string; ok: boolean; reason?: string }> = [];
      for (const r of rows) {
        if (!r.person_id || !r.signature_blob) {
          results.push({ vote_id: r.id, ok: false, reason: 'anonymous vote — re-verify via hash trail' });
          continue;
        }
        try {
          const env = JSON.parse(Buffer.from(r.signature_blob, 'base64').toString('utf-8')) as VoteSignaturePayload;
          // For audit we don't enforce the freshness window — only the
          // cryptographic match matters. Spoof `now` to the signed time.
          const result = await verifyVoteSignature(
            {
              poll_id: pollId,
              person_id: r.person_id,
              apartment_id: r.apartment_id,
              choice: r.choice,
              signed_at: env.signed_at,
            },
            env,
            new Date(env.signed_at),
          );
          results.push({ vote_id: r.id, ok: result.ok, reason: result.reason });
        } catch (err) {
          results.push({ vote_id: r.id, ok: false, reason: `parse: ${(err as Error).message}` });
        }
      }
      return results;
    });
  }

  /** Expose the canonical helper so frontends compute the same bytes. */
  static canonicalize = canonicalVoteJson;
}
