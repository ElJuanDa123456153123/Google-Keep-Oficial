import {
  Column, Entity, ManyToOne,
  PrimaryGeneratedColumn, JoinColumn
} from "typeorm";
import { Note } from "../../model/note.model";

@Entity('checklist_items')
export class ChecklistItem {
  @PrimaryGeneratedColumn({ name: 'item_id' })
  id!: number;

  @Column()
  note_id!: number;

  @Column({ type: 'text', nullable: true })  // ← temporal
  content!: string;

  @Column({ default: false })
  is_checked!: boolean;

  @Column({ default: 0 })
  position!: number;

  @ManyToOne(() => Note, note => note.checklist_items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'note_id' })
  note!: Note;
}