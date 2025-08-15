import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 500, nullable: false })
  description!: string;

  @Column({ default: false })
  completed!: boolean;
}
