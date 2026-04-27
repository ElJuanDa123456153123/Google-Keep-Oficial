import {
  Column, CreateDateColumn, Entity, OneToMany,
  PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { ChecklistItem } from "../checklist-item/model/checklist-item.model";
import { Label } from "../../label/model/label.model";

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn({ name: 'note_id' })
  id!: number;

  @Column({ nullable: true })
  title!: string;

  @Column({ type: 'text', nullable: true })
  content!: string;

  @Column({ default: 'default' })
  color!: string;

  @Column({ default: false })
  is_pinned!: boolean;

  @Column({ nullable: true })
  image_url!: string;

  @Column({ type: 'timestamp', nullable: true })
  reminder_date!: Date;

  @Column({ default: false })
  is_archived!: boolean;

  @Column({ default: false })
  is_deleted!: boolean;

  @Column({ nullable: true })
  user_id!: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at!: Date;

  @OneToMany(() => ChecklistItem, item => item.note, { cascade: true, eager: true })
  checklist_items!: ChecklistItem[];

  // Propiedad virtual para incluir etiquetas cuando se obtienen notas
  // No es una columna de la base de datos, se popula manualmente
  labels?: Label[];
}