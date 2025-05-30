import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Casa, FotoCasa } from './database/casa/casa.entity';
import { User } from './database/user/user.entity';

@Injectable()
export class CasaService {
  private readonly logger = new Logger(CasaService.name);

  constructor(
    @InjectRepository(Casa)
    private casaRepository: Repository<Casa>,
    @InjectRepository(FotoCasa)
    private fotoCasaRepository: Repository<FotoCasa>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(casaData: Partial<Casa>, fotos: string[]): Promise<Casa> {
    try {
      // Verificar se o usuário existe
      const user = await this.userRepository.findOneBy({ 
        user: casaData.userProprietario 
      });
      
      if (!user) {
        throw new NotFoundException(
          `Usuário ${casaData.userProprietario} não encontrado`
        );
      }

      if (!casaData.valor || casaData.valor <= 0) {
        throw new BadRequestException('Valor da casa deve ser maior que zero');
      }

      // Criar a casa
      const casa = this.casaRepository.create(casaData);
      const savedCasa = await this.casaRepository.save(casa);
      this.logger.debug(`Casa criada com ID: ${savedCasa.idCasa}`);

      // Criar entradas para cada foto usando o repository
      if (fotos && fotos.length > 0) {
        const fotosEntidades = fotos.map(url => 
          this.fotoCasaRepository.create({
            idCasa: savedCasa.idCasa,
            url: url,
            casa: savedCasa
          })
        );
        
        const savedFotos = await this.fotoCasaRepository.save(fotosEntidades);
        savedCasa.fotos = savedFotos;
      }

      return savedCasa;
    } catch (error) {
      this.logger.error('Erro ao criar casa:', error);
      throw error;
    }
  }
}
