import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Casa } from '../casa/casa.entity';
import { Resposta } from '../resposta/resposta.entity';

@Entity('comentarios')
export class Comentario {
  @PrimaryGeneratedColumn()
  idComentario: number;

  @Column()
  idCasa: number;

  @ManyToOne(() => Casa)
  @JoinColumn({ name: 'idCasa' })
  casa: Casa;

  @Column()
  user: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user', referencedColumnName: 'user' })
  usuario: User;

  @Column('text')
  textoComentario: string;

  @OneToOne(() => Resposta, resposta => resposta.comentario)
  resposta: Resposta;
}
