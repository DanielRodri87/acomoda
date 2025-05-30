import { Controller, Post, Get, Body, UseInterceptors, UploadedFiles, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
      callback(null, `casa-${uniqueSuffix}${ext}`);
    },
  });

  // Endpoint para criar uma nova casa
  @Post()
  @UseInterceptors(
    FileInterceptor('fotoPrincipal', {
      storage: diskStorage({
        destination: './public/uploads/casas',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `principal-${uniqueSuffix}${ext}`);
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
  async criarCasa(
    @Body() casaData: any,
    @UploadedFile() fotoPrincipal: MulterFile, // Usando nosso tipo personalizado
  ) {
    try {
      // Garantir que o diretório existe
      const uploadDir = './public/uploads/casas';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
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
      
      return {
        success: true,
        mensagem: 'Casa cadastrada com sucesso',
        casa: casaSalva,
      };
    } catch (error) {
      console.error('Erro ao cadastrar casa:', error);
      throw new BadRequestException('Erro ao cadastrar casa: ' + error.message);
    }
  }

  // Endpoint para adicionar fotos adicionais
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
    @Body('idCasa') idCasa: number,
    @UploadedFiles() fotos: Array<MulterFile>, // Usando nosso tipo personalizado
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
}
