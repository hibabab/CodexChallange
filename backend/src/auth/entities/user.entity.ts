import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users') // nom explicite de la table
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nom: string;

  @Column({ length: 100 })
  prenom: string;
@Column({ unique: true })
  email: string;
  @Column({ length: 20 })
  telephone: string;

  



  @Column({ name: 'mot_de_passe' })
  password: string;

  
}
