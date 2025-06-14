import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './database/user/user.entity';
import { Casa, FotoCasa } from './database/casa/casa.entity';
import { CasaController } from './controllers/casa.controller';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { EmailController } from './email/email.controller';
import { EmailService } from './email/email.service';
import { ComentariosModule } from './comentarios/comentarios.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Alterado de 'mysql' para 'postgres'
      host: 'localhost',
      port: 5432,       // Alterado de 3306 (MySQL) para 5432 (PostgreSQL)
      username: 'postgres', // Nome de usuário padrão do PostgreSQL
      password: 'acomoda2025', // Substitua pela sua senha do PostgreSQL
      database: 'bancodados',
      autoLoadEntities: true,
      synchronize: true, // apenas em desenvolvimento
      entities: [
        User,
        Casa,
        FotoCasa,
      ],
    }),
    TypeOrmModule.forFeature([Casa, FotoCasa, User]),
    ComentariosModule
  ],
  controllers: [AppController, UserController, AuthController, CasaController, EmailController],
  providers: [AppService, UserService, AuthService, EmailService],
})
export class AppModule {}
