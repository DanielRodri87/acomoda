import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';

const ensureDatabaseExists = async () => {
  const { Client } = require('pg');
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'acomoda2025',
    database: 'postgres',
  });
  await client.connect();
  const dbName = 'usuarios';
  const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
  if (res.rowCount === 0) {
    await client.query(`CREATE DATABASE "${dbName}"`);
  }
  await client.end();
};

// Chama a função para garantir o banco antes do bootstrap
ensureDatabaseExists().then(() => {
  // O Nest irá importar normalmente o AppModule
});

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'acomoda2025',
      database: 'usuarios',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
