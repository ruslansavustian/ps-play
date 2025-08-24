import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { webcrypto } from 'crypto';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

if (typeof globalThis.crypto === 'undefined') {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    configurable: true,
    enumerable: true,
    writable: true,
  });
}

async function bootstrap() {
  const { AppModule } = require('./app.module');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('Portfolio application API documentation')
    .setVersion('1.0')
    .addBearerAuth() // For JWT authentication
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      process.env.FRONTEND_URL,
      /\.vercel\.app$/,
    ].filter(Boolean),
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Global validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) =>
  console.error('Error starting the application:', err),
);
