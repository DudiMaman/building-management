/**
 * AuditInterceptor — records every authenticated, state-changing request into
 * the append-only, hash-chained audit log (SPEC §24.1).
 *
 * This is an HTTP-layer baseline: it captures actor, action, target entity and
 * a trimmed payload after the handler succeeds. Full before/after entity diffs
 * are a follow-up (they require per-service snapshots). Read requests, public
 * endpoints (webhooks, leads, auth) and unauthenticated calls are skipped.
 */
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import type { AuthenticatedRequest } from '../auth/supabase-jwt.guard';
import { AuditService } from './audit.service';

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly audit: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const tenantId = req.claims?.tenant_id;
    const method = req.method;

    if (!tenantId || !MUTATING.has(method)) return next.handle();

    // Derive a coarse entity_type from the first path segment after /v1.
    const segments = (req.path ?? '').split('/').filter(Boolean);
    const v1Index = segments.indexOf('v1');
    const resourceSegments = v1Index >= 0 ? segments.slice(v1Index + 1) : segments;
    const entityType = resourceSegments[0] ?? 'unknown';
    const entityId = (req.params?.id as string | undefined) ?? undefined;

    return next.handle().pipe(
      tap({
        next: (result) => {
          void this.record(req, tenantId, method, resourceSegments.join('/'), entityType, entityId, result);
        },
      }),
    );
  }

  private async record(
    req: AuthenticatedRequest,
    tenantId: string,
    method: string,
    route: string,
    entityType: string,
    entityId: string | undefined,
    result: unknown,
  ) {
    try {
      // Prefer the created/updated row's id when the handler returns one.
      const resultId =
        result && typeof result === 'object' && 'id' in (result as Record<string, unknown>)
          ? String((result as Record<string, unknown>).id)
          : undefined;
      await this.audit.log({
        tenant_id: tenantId,
        actor_user_id: req.claims?.sub,
        actor_type: req.claims?.role ?? 'system',
        action: `${method} /${route}`,
        entity_type: entityType,
        entity_id: entityId ?? resultId,
        after: this.trim(req.body),
        ip: req.ip,
        user_agent: req.headers['user-agent'],
      });
    } catch (err) {
      // Auditing must never break the request path.
      this.logger.error(`Audit log failed for ${method} /${route}: ${(err as Error).message}`);
    }
  }

  /** Keep the stored payload small and free of obvious secrets. */
  private trim(body: unknown): unknown {
    if (!body || typeof body !== 'object') return body ?? null;
    const redactKeys = new Set(['password', 'token', 'card', 'cvv', 'secret', 'signature']);
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(body as Record<string, unknown>)) {
      out[k] = redactKeys.has(k.toLowerCase()) ? '[REDACTED]' : v;
    }
    return out;
  }
}
