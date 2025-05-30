import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { json } from 'express';

async function bootstrap() {
  // Criar aplicação NestJS com o adaptador Express explícito
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Increase payload size limit to 50mb
  app.use(json({ limit: '50mb' }));
  
  // Configurar pasta de arquivos estáticos
  // Corrigido o caminho para apontar para a pasta public na raiz do projeto
  app.useStaticAssets(join(process.cwd(), 'public'));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
