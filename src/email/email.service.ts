import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'osmbomosm@gmail.com',
        pass: 'ewpx qqvu hauh osks' // Cole aqui a senha de 16 caracteres gerada
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendResetCode(email: string, code: string): Promise<boolean> {
    try {
      await this.transporter.verify(); // Verifica conexão com o servidor SMTP
      
      const mailOptions = {
        from: 'osmbomosm@gmail.com',
        to: email,
        subject: 'Código de Recuperação de Senha',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Recuperação de Senha</h2>
            <p>Você solicitou a recuperação de sua senha.</p>
            <p>Use o código abaixo para continuar com o processo:</p>
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
            </div>
            <p><strong>Este código é válido por 15 minutos.</strong></p>
            <p>Se você não solicitou esta recuperação, ignore este email.</p>
            <hr style="margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              Este é um email automático, não responda a esta mensagem.
            </p>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email enviado com sucesso: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Erro ao enviar email: ${error.message}`, error.stack);
      return false;
    }
  }

  async sendEmail(to: string, subject: string, content: string) {
    try {
      const mailOptions = {
        from: 'osmbomosm@gmail.com',
        to,
        subject,
        html: content
      };

      await this.transporter.sendMail(mailOptions);
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return { success: false, message: 'Failed to send email' };
    }
  }
}

