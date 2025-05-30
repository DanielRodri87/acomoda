import { Controller, Post, Body, UnauthorizedException, Logger, BadRequestException } from '@nestjs/common';
import { CasaService } from './casa.service';
import { Casa } from './database/casa/casa.entity';

@Controller('casas')
export class CasaController {
  private readonly logger = new Logger(CasaController.name);

  constructor(private readonly casaService: CasaService) {}

  @Post()
  async create(@Body() data: { 
    casa: Partial<Casa>,
    fotos: string[] 
  }) {
    this.logger.debug(`Recebendo requisição para criar casa: ${JSON.stringify({
      ...data.casa,
      fotoPrincipal: '<<base64-omitted>>'
    })}`);

    if (!data.casa.userProprietario) {
      throw new UnauthorizedException('userProprietario é obrigatório');
    }

    if (!data.casa.nome || !data.casa.valor) {
      throw new BadRequestException('Nome e valor são obrigatórios');
    }
    
    try {
      const result = await this.casaService.create(data.casa, data.fotos);
      this.logger.debug(`Casa criada com sucesso: ${result.idCasa}`);
      return result;
    } catch (error) {
      this.logger.error('Erro ao criar casa:', error);
      throw error;
    }
  }
}
