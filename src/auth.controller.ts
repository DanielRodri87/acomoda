import { Controller, Post, Body, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
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

  @Post('send-reset-code')
  async sendResetCode(@Body() body: { email: string }) {
    const { email } = body;
    
    if (!email) {
      throw new BadRequestException('Email é obrigatório');
    }

    const result = await this.authService.sendPasswordResetCode(email);
    
    if (!result.success) {
      if (result.message === 'Email não encontrado') {
        throw new NotFoundException('Email não encontrado');
      }
      throw new BadRequestException(result.message);
    }

    return {
      success: true,
      message: 'Código enviado com sucesso'
    };
  }

  @Post('verify-reset-code')
  async verifyResetCode(@Body() body: { email: string; code: string }) {
    const { email, code } = body;
    
    if (!email || !code) {
      throw new BadRequestException('Email e código são obrigatórios');
    }

    const result = await this.authService.verifyPasswordResetCode(email, code);
    
    if (!result.success) {
      throw new BadRequestException(result.message);
    }

    return {
      success: true,
      message: 'Código verificado com sucesso'
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; code: string; newPassword: string }) {
    const { email, code, newPassword } = body;
    
    if (!email || !code || !newPassword) {
      throw new BadRequestException('Email, código e nova senha são obrigatórios');
    }

    if (newPassword.length < 6) {
      throw new BadRequestException('A senha deve ter pelo menos 6 caracteres');
    }

    const result = await this.authService.resetPassword(email, code, newPassword);
    
    if (!result.success) {
      throw new BadRequestException(result.message);
    }

    return {
      success: true,
      message: 'Senha alterada com sucesso'
    };
  }
}