import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('note_labels')
export class NoteLabel {
    @PrimaryGeneratedColumn({name: 'note_label_id'})
    id: number;

    @Column()
    note_id: number;

    @Column()
    label_id: number;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;
}
