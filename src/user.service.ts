import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './database/user/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    // Se receber uma imagem em base64, salva diretamente no banco
    // O TypeORM vai cuidar da conversão para o formato adequado do PostgreSQL
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ user: id });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { user: username },
      });
      return user;
    } catch (error) {
      console.error('Erro ao buscar usuário pelo username:', error);
      return null;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
