import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users') // nom explicite de la table
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  
@Column({ unique: true })
  email: string;
  
  



  @Column({ name: 'mot_de_passe' })
  password: string;

  
}
