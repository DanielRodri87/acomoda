import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './database/user/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userData: Partial<User>) {
    return this.userService.create(userData);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  // Endpoint para verificar se um usuário existe
  @Get('check/:username')
  async checkUserExists(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new NotFoundException(`Usuário ${username} não encontrado`);
    }
    return { exists: true };
  }

  // Endpoint para listar todos os usuários
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return users;
  }
}
