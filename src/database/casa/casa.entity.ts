import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('casas')
export class Casa {
  @PrimaryGeneratedColumn()
  idCasa: number;

  @Column()
  nome: string;

  @Column()
  fotoPrincipal: string;

  @Column()
  userProprietario: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userProprietario', referencedColumnName: 'user' })
  proprietario: User;

  @Column('decimal', { precision: 10, scale: 2 })
  valor: number;

  @Column({ nullable: true })
  observacao: string;

  @Column('text')
  descricao: string;

  @OneToMany(() => FotoCasa, fotoCasa => fotoCasa.casa)
  fotos: FotoCasa[];

  @Column({ 
    type: 'enum',
    enum: ['Ocupada', 'Desocupada'],
    default: 'Desocupada'
  })
  status: string;

  @Column({ 
    type: 'enum',
    enum: ['República Universitária', 'Solitário'],
    default: 'Solitário'
  })
  tipo: string;
}

@Entity('fotos_casa')
export class FotoCasa {
  @PrimaryGeneratedColumn()
  idFoto: number;

  @Column()
  idCasa: number;

  @ManyToOne(() => Casa, casa => casa.fotos)
  @JoinColumn({ name: 'idCasa' })
  casa: Casa;

  @Column()
  url: string;
}