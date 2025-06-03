import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComentarioController } from '../controllers/comentario.controller';
import { RespostaController } from '../controllers/resposta.controller';
import { Comentario } from '../database/comentario/comentario.entity';
import { Resposta } from '../database/resposta/resposta.entity';
import { Casa } from '../database/casa/casa.entity';
import { User } from '../database/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comentario, Resposta, Casa, User]),
  ],
  controllers: [ComentarioController, RespostaController],
  providers: [],
  exports: [],
})
export class ComentariosModule {}
