import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { user: string; senha: string }) {
    const user = await this.authService.validateUser(body.user, body.senha);
    if (!user) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }
    return { message: 'Login realizado com sucesso', user };
  }
}
