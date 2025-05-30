import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Configurar pasta de arquivos estáticos
  // Corrigido o caminho para apontar para a pasta public na raiz do projeto
  app.useStaticAssets(join(process.cwd(), 'public'));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
