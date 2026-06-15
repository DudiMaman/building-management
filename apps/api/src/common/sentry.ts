/**
 * Optional Sentry integration (SPEC §27).
 *
 * We don't hard-depend on the SDK: the module is loaded dynamically by a
 * runtime-computed specifier so typecheck stays green whether or not
 * `@sentry/node` is installed. When SENTRY_DSN is set AND the package is
 * present, errors are captured; otherwise these are silent no-ops.
 *
 * To enable: `pnpm --filter @bm/api add @sentry/node` and set SENTRY_DSN.
 */
import { Logger } from '@nestjs/common';

const logger = new Logger('Sentry');
const SPECIFIER = '@sentry/node';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sentry: any = null;

export async function initSentry(): Promise<void> {
  if (!process.env.SENTRY_DSN) return;
  try {
    sentry = await import(/* @vite-ignore */ SPECIFIER);
    sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV ?? 'development',
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    });
    logger.log('Sentry initialized');
  } catch {
    logger.warn('SENTRY_DSN set but @sentry/node is not installed — error capture disabled');
    sentry = null;
  }
}

export function captureException(err: unknown, context?: Record<string, unknown>): void {
  if (!sentry) return;
  try {
    sentry.captureException(err, context ? { extra: context } : undefined);
  } catch {
    /* never let telemetry break the request */
  }
}
