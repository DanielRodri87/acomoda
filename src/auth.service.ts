import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './database/user/user.entity';
import { UserService } from './user.service';
import { EmailService } from './email/email.service';
import * as bcrypt from 'bcrypt';

interface ResetCode {
  email: string;
  code: string;
  expiresAt: Date;
}

@Injectable()
export class AuthService {
  private resetCodes: Map<string, ResetCode> = new Map();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  // Método para login (mantendo o original que funciona)
  async validateUser(user: string, senha: string): Promise<User | null> {
    // Primeiro tenta validar com senha em texto puro (seu método atual)
    const userPlainPassword = await this.userRepository.findOneBy({ user, senha });
    if (userPlainPassword) {
      return userPlainPassword;
    }

    // Se não encontrar, tenta validar com bcrypt (para senhas que foram resetadas)
    const userFromDb = await this.userRepository.findOneBy({ user });
    if (userFromDb && await bcrypt.compare(senha, userFromDb.senha)) {
      return userFromDb;
    }

    return null;
  }

  async sendPasswordResetCode(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Verificar se o email existe no banco
      const user = await this.userService.findByEmail(email);
      if (!user) {
        return { success: false, message: 'Email não encontrado' };
      }

      // Gerar código de 6 dígitos
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Definir expiração para 15 minutos
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);

      // Armazenar código temporariamente
      this.resetCodes.set(email, {
        email,
        code,
        expiresAt
      });

      // Enviar email
      const emailSent = await this.emailService.sendResetCode(email, code);
      
      if (!emailSent) {
        return { success: false, message: 'Erro ao enviar email' };
      }

      return { success: true, message: 'Código enviado com sucesso' };
    } catch (error) {
      console.error('Erro ao enviar código de reset:', error);
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  async verifyPasswordResetCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
    try {
      const resetCode = this.resetCodes.get(email);
      
      if (!resetCode) {
        return { success: false, message: 'Código não encontrado ou expirado' };
      }

      if (new Date() > resetCode.expiresAt) {
        this.resetCodes.delete(email);
        return { success: false, message: 'Código expirado' };
      }

      if (resetCode.code !== code) {
        return { success: false, message: 'Código inválido' };
      }

      return { success: true, message: 'Código válido' };
    } catch (error) {
      console.error('Erro ao verificar código:', error);
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      // Verificar código novamente
      const codeVerification = await this.verifyPasswordResetCode(email, code);
      if (!codeVerification.success) {
        return codeVerification;
      }

      // Atualizar senha no banco (com hash)
      await this.userService.updatePassword(email, newPassword);

      // Remover código usado
      this.resetCodes.delete(email);

      return { success: true, message: 'Senha alterada com sucesso' };
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      return { success: false, message: 'Erro ao alterar senha' };
    }
  }

  // Método para limpar códigos expirados (pode ser chamado periodicamente)
  cleanExpiredCodes(): void {
    const now = new Date();
    for (const [email, resetCode] of this.resetCodes.entries()) {
      if (now > resetCode.expiresAt) {
        this.resetCodes.delete(email);
      }
    }
  }
}