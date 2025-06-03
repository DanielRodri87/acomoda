import { Controller, Post, Get, Body, Param, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resposta } from '../database/resposta/resposta.entity';
import { Comentario } from '../database/comentario/comentario.entity';
import { User } from '../database/user/user.entity';

@Controller('api/respostas')
export class RespostaController {
  constructor(
    @InjectRepository(Resposta)
    private respostaRepository: Repository<Resposta>,
    @InjectRepository(Comentario)
    private comentarioRepository: Repository<Comentario>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  @Post()
  async criarResposta(@Body() respostaData: { idComentario: number; user: string; resposta: string }) {
    try {
      // Verificar se o comentário existe
      const comentario = await this.comentarioRepository.findOne({where: {idComentario: respostaData.idComentario}});
      if (!comentario) {
        throw new BadRequestException(`Comentário com ID ${respostaData.idComentario} não encontrado`);
      }

      // Verificar se já existe uma resposta para este comentário
      const respostaExistente = await this.respostaRepository.findOne({where: {idComentario: respostaData.idComentario}});
      if (respostaExistente) {
        throw new BadRequestException(`Já existe uma resposta para o comentário com ID ${respostaData.idComentario}`);
      }

      // Verificar se o usuário existe
      const usuario = await this.userRepository.findOne({where: {user: respostaData.user}});
      if (!usuario) {
        throw new BadRequestException(`Usuário ${respostaData.user} não encontrado`);
      }

      // Criar a nova resposta
      const novaResposta = new Resposta();
      novaResposta.idComentario = respostaData.idComentario;
      novaResposta.user = respostaData.user;
      novaResposta.resposta = respostaData.resposta;

      // Salvar a resposta no banco de dados
      const respostaSalva = await this.respostaRepository.save(novaResposta);

      return {
        success: true,
        mensagem: 'Resposta adicionada com sucesso',
        resposta: respostaSalva,
      };
    } catch (error) {
      console.error('Erro ao adicionar resposta:', error);
      throw new BadRequestException(`Erro ao adicionar resposta: ${error.message}`);
    }
  }

  @Get('comentario/:idComentario')
  async buscarRespostaPorComentario(@Param('idComentario') idComentario: number) {
    try {
      // Buscar a resposta pelo ID do comentário, incluindo usuário
      const resposta = await this.respostaRepository.createQueryBuilder('resposta')
        .leftJoinAndSelect('resposta.usuario', 'usuario')
        .where('resposta.idComentario = :idComentario', { idComentario })
        .getOne();

      if (!resposta) {
        throw new BadRequestException(`Resposta para o comentário com ID ${idComentario} não encontrada`);
      }

      return {
        success: true,
        resposta: resposta,
      };
    } catch (error) {
      console.error(`Erro ao buscar resposta para comentário com ID ${idComentario}:`, error);
      throw new BadRequestException('Erro ao buscar resposta: ' + error.message);
    }
  }
}
