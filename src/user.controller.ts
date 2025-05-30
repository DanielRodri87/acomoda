import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './database/user/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userData: Partial<User>) {
    return this.userService.create(userData);
  }
}
