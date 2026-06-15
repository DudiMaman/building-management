/**
 * Global exception filter (SPEC §27 observability): logs every unhandled
 * error with request context via Pino, forwards it to Sentry when enabled,
 * and returns a consistent JSON error envelope. HttpExceptions keep their
 * status/body; everything else becomes a 500.
 */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import { captureException } from './sentry';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exceptions');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const payload =
      exception instanceof HttpException
        ? exception.getResponse()
        : { statusCode: status, message: 'Internal server error' };

    if (status >= 500) {
      this.logger.error(
        `${req.method} ${req.url} → ${status}: ${(exception as Error)?.message}`,
        (exception as Error)?.stack,
      );
      captureException(exception, { method: req.method, url: req.url });
    }

    res.status(status).json(typeof payload === 'string' ? { statusCode: status, message: payload } : payload);
  }
}
