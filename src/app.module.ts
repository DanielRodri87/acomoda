import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './database/user/user.entity';
import { Casa, FotoCasa } from './database/casa/casa.entity';
import { CasaController } from './controllers/casa.controller';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

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
    }),
    TypeOrmModule.forFeature([Casa, FotoCasa, User]),
  ],
  controllers: [AppController, UserController, AuthController, CasaController],
  providers: [AppService, UserService, AuthService],
})
export class AppModule {}
