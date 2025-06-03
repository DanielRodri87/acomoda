import { Entity, Column, PrimaryColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Comentario } from '../comentario/comentario.entity';

@Entity('respostas')
export class Resposta {
  @PrimaryColumn()
  idComentario: number;

  @OneToOne(() => Comentario)
  @JoinColumn({ name: 'idComentario' })
  comentario: Comentario;

  @Column()
  user: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user', referencedColumnName: 'user' })
  usuario: User;

  @Column('text')
  resposta: string;
}
