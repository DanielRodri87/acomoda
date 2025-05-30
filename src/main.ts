import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Aumentar limite do payload para 10MB
  app.use(json({ limit: '10mb' }));

  // Atualizar o caminho para usar __dirname corretamente
  const publicPath = join(__dirname, '../..', 'public');
  app.useStaticAssets(publicPath);

  // Habilitar CORS para permitir requisições do frontend
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
