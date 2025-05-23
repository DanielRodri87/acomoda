import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Configurar pasta de arquivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
