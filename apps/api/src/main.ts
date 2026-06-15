import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger as PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    rawBody: true, // expose req.rawBody for webhook HMAC verification (WhatsApp, Tranzila)
    bufferLogs: true,
  });
  app.useLogger(app.get(PinoLogger));

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('v1', { exclude: ['healthz', 'webhooks/(.*)', 'docs', 'docs/(.*)'] });

  // OpenAPI / Swagger docs — disabled in production unless API_DOCS_ENABLED=true.
  if (process.env.NODE_ENV !== 'production' || process.env.API_DOCS_ENABLED === 'true') {
    const docConfig = new DocumentBuilder()
      .setTitle('Building Management API')
      .setDescription('Israeli SaaS CRM for building management companies — v1')
      .setVersion('1.0.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'supabase')
      .addServer(process.env.API_PUBLIC_URL ?? 'http://localhost:4000', 'API')
      .build();
    const document = SwaggerModule.createDocument(app, docConfig);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  const port = Number(process.env.API_PORT ?? 4000);
  await app.listen(port, '0.0.0.0');
  Logger.log(`API listening on :${port}`, 'Bootstrap');
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed', err);
  process.exit(1);
});
