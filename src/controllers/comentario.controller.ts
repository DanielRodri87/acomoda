import { Controller, Post, Get, Body, Param, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comentario } from '../database/comentario/comentario.entity';
import { Casa } from '../database/casa/casa.entity';
import { User } from '../database/user/user.entity';

@Controller('api/comentarios')
export class ComentarioController {
  constructor(
    @InjectRepository(Comentario)
    private comentarioRepository: Repository<Comentario>,
    @InjectRepository(Casa)
    private casaRepository: Repository<Casa>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  @Post()
  async criarComentario(@Body() comentarioData: { idCasa: number; user: string; textoComentario: string }) {
    try {
      // Verificar se a casa existe
      const casa = await this.casaRepository.findOne({where: {idCasa: comentarioData.idCasa}});
      if (!casa) {
        throw new BadRequestException(`Casa com ID ${comentarioData.idCasa} não encontrada`);
      }

      // Verificar se o usuário existe
      const usuario = await this.userRepository.findOne({where: {user: comentarioData.user}});
      if (!usuario) {
        throw new BadRequestException(`Usuário ${comentarioData.user} não encontrado`);
      }

      // Criar o novo comentário
      const novoComentario = new Comentario();
      novoComentario.idCasa = comentarioData.idCasa;
      novoComentario.user = comentarioData.user;
      novoComentario.textoComentario = comentarioData.textoComentario;

      // Salvar o comentário no banco de dados
      const comentarioSalvo = await this.comentarioRepository.save(novoComentario);

      return {
        success: true,
        mensagem: 'Comentário adicionado com sucesso',
        comentario: comentarioSalvo,
      };
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      throw new BadRequestException(`Erro ao adicionar comentário: ${error.message}`);
    }
  }

  @Get('casa/:idCasa')
  async buscarComentariosPorCasa(@Param('idCasa') idCasa: number) {
    try {
      // Buscar todos os comentários da casa, incluindo usuário e resposta
      const comentarios = await this.comentarioRepository.createQueryBuilder('comentario')
        .leftJoinAndSelect('comentario.usuario', 'usuario')
        .leftJoinAndSelect('comentario.resposta', 'resposta')
        .leftJoinAndSelect('resposta.usuario', 'respostaUsuario')
        .where('comentario.idCasa = :idCasa', { idCasa })
        .orderBy('comentario.idComentario', 'DESC')
        .getMany();

      return {
        success: true,
        comentarios: comentarios,
      };
    } catch (error) {
      console.error(`Erro ao buscar comentários da casa com ID ${idCasa}:`, error);
      throw new BadRequestException('Erro ao buscar comentários: ' + error.message);
    }
  }

  @Get(':id')
  async buscarComentarioPorId(@Param('id') idComentario: number) {
    try {
      // Buscar o comentário pelo ID, incluindo usuário e resposta
      const comentario = await this.comentarioRepository.createQueryBuilder('comentario')
        .leftJoinAndSelect('comentario.usuario', 'usuario')
        .leftJoinAndSelect('comentario.resposta', 'resposta')
        .leftJoinAndSelect('resposta.usuario', 'respostaUsuario')
        .where('comentario.idComentario = :idComentario', { idComentario })
        .getOne();

      if (!comentario) {
        throw new BadRequestException(`Comentário com ID ${idComentario} não encontrado`);
      }

      return {
        success: true,
        comentario: comentario,
      };
    } catch (error) {
      console.error(`Erro ao buscar comentário com ID ${idComentario}:`, error);
      throw new BadRequestException('Erro ao buscar comentário: ' + error.message);
    }
  }
}
