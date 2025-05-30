import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  serveIndex(@Res() res: Response) {
    // Corrigido o caminho para usar process.cwd() que aponta para a raiz do projeto
    return res.sendFile(join(process.cwd(), 'public', 'index.html'));
  }
  
  // Mantemos a rota Hello World em outro endpoint caso seja necessário
  @Get('api/hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
