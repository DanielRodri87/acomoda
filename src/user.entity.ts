import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn()
  user: string;

  @Column()
  tipo: string;

  @Column()
  primeiro_nome: string;

  @Column()
  segundo_nome: string;

  @Column()
  email: string;

  @Column()
  numero: string;

  @Column()
  senha: string;

  @Column({ nullable: true })
  imagem: string;
}
