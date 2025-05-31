import { Controller, Post, Get, Body, UseInterceptors, UploadedFiles, UploadedFile, BadRequestException, Param } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { Casa, FotoCasa } from '../database/casa/casa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

// Adicionar este tipo para resolver o problema com Express.Multer.File
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@Controller('api/casas')
export class CasaController {
  constructor(
    @InjectRepository(Casa)
    private casaRepository: Repository<Casa>,
    @InjectRepository(FotoCasa)
    private fotoCasaRepository: Repository<FotoCasa>,
  ) {}

  // Configuração do storage para imagens
  private readonly imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new BadRequestException('Apenas arquivos de imagem são permitidos!'), false);
    }
    callback(null, true);
  };

  private readonly storage = diskStorage({
    destination: './public/uploads/casas',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const prefix = file.fieldname === 'fotoPrincipal' ? 'principal' : 'adicional';
      callback(null, `${prefix}-${uniqueSuffix}${ext}`);
    },
  });

  // Endpoint para criar uma nova casa com fotos adicionais
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'fotoPrincipal', maxCount: 1 },
        { name: 'fotosAdicionais', maxCount: 5 }
      ],
      {
        storage: diskStorage({
          destination: './public/uploads/casas',
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const prefix = file.fieldname === 'fotoPrincipal' ? 'principal' : 'adicional';
            callback(null, `${prefix}-${uniqueSuffix}${ext}`);
          },
        }),
        fileFilter: (req, file, callback) => {
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return callback(new BadRequestException('Apenas arquivos de imagem são permitidos!'), false);
          }
          callback(null, true);
        },
      }
    )
  )
  async criarCasa(
    @Body() casaData: any,
    @UploadedFiles() files: { fotoPrincipal?: MulterFile[], fotosAdicionais?: MulterFile[] }
  ) {
    try {
      // Garantir que o diretório existe
      const uploadDir = './public/uploads/casas';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // Verificar se a foto principal foi enviada
      if (!files.fotoPrincipal || !files.fotoPrincipal[0]) {
        throw new BadRequestException('A foto principal é obrigatória');
      }
      
      const fotoPrincipal = files.fotoPrincipal[0];
      
      // Criar a entidade Casa
      const novaCasa = new Casa();
      novaCasa.nome = casaData.nome;
      novaCasa.valor = parseFloat(casaData.valor);
      novaCasa.userProprietario = casaData.userProprietario;
      novaCasa.descricao = casaData.descricao;
      novaCasa.observacao = casaData.observacao;
      
      // Caminho da foto principal relativo à pasta pública
      novaCasa.fotoPrincipal = `/uploads/casas/${fotoPrincipal.filename}`;
      
      // Salvar a casa no banco de dados
      const casaSalva = await this.casaRepository.save(novaCasa);
      
      // Salvar fotos adicionais, se existirem
      const fotosSalvas: FotoCasa[] = [];
      if (files.fotosAdicionais && files.fotosAdicionais.length > 0) {
        for (const foto of files.fotosAdicionais) {
          const novaFoto = new FotoCasa();
          novaFoto.idCasa = casaSalva.idCasa;
          novaFoto.url = `/uploads/casas/${foto.filename}`;
          
          const fotoSalva = await this.fotoCasaRepository.save(novaFoto);
          fotosSalvas.push(fotoSalva);
        }
      }
      
      return {
        success: true,
        mensagem: 'Casa cadastrada com sucesso',
        casa: casaSalva,
        fotosAdicionais: fotosSalvas.length > 0 ? fotosSalvas : null,
      };
    } catch (error) {
      console.error('Erro ao cadastrar casa:', error);
      throw new BadRequestException('Erro ao cadastrar casa: ' + error.message);
    }
  }

  // Endpoint para adicionar fotos adicionais a uma casa existente
  @Post(':id/fotos')
  @UseInterceptors(
    FilesInterceptor('fotos', 5, {
      storage: diskStorage({
        destination: './public/uploads/casas',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `adicional-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new BadRequestException('Apenas arquivos de imagem são permitidos!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async adicionarFotos(
    @Param('id') idCasa: number,
    @UploadedFiles() fotos: Array<MulterFile>
  ) {
    try {
      const casa = await this.casaRepository.findOne({where: {idCasa: idCasa}});
      
      if (!casa) {
        throw new BadRequestException('Casa não encontrada');
      }
      
      // Explicitamente tipando o array para corrigir o erro "not assignable to parameter of type 'never'"
      const fotosSalvas: FotoCasa[] = [];
      
      for (const foto of fotos) {
        const novaFoto = new FotoCasa();
        novaFoto.idCasa = idCasa;
        novaFoto.url = `/uploads/casas/${foto.filename}`;
        
        const fotoSalva = await this.fotoCasaRepository.save(novaFoto);
        fotosSalvas.push(fotoSalva);
      }
      
      return {
        success: true,
        mensagem: `${fotosSalvas.length} fotos adicionadas com sucesso`,
        fotos: fotosSalvas,
      };
    } catch (error) {
      console.error('Erro ao adicionar fotos:', error);
      throw new BadRequestException('Erro ao adicionar fotos: ' + error.message);
    }
  }

  // Adicionar endpoint GET para listar todas as casas
  @Get()
  async listarCasas() {
    try {
      const casas = await this.casaRepository.find();
      return {
        success: true,
        data: casas,
      };
    } catch (error) {
      console.error('Erro ao listar casas:', error);
      throw new BadRequestException('Erro ao listar casas: ' + error.message);
    }
  }

  // Endpoint para buscar uma casa específica pelo ID
  @Get(':id')
  async buscarCasaPorId(@Param('id') idCasa: number) {
    try {
      // Buscar a casa pelo ID
      const casa = await this.casaRepository.findOne({where: {idCasa}});
      
      if (!casa) {
        throw new BadRequestException(`Casa com ID ${idCasa} não encontrada`);
      }
      
      return {
        success: true,
        data: casa,
      };
    } catch (error) {
      console.error(`Erro ao buscar casa com ID ${idCasa}:`, error);
      throw new BadRequestException('Erro ao buscar casa: ' + error.message);
    }
  }

  // Endpoint para buscar fotos adicionais de uma casa
  @Get(':id/fotos')
  async buscarFotosCasa(@Param('id') idCasa: number) {
    try {
      // Buscar fotos da casa pelo ID
      const fotos = await this.fotoCasaRepository.find({where: {idCasa}});
      
      return {
        success: true,
        fotos: fotos,
      };
    } catch (error) {
      console.error(`Erro ao buscar fotos da casa com ID ${idCasa}:`, error);
      throw new BadRequestException('Erro ao buscar fotos: ' + error.message);
    }
  }
}
