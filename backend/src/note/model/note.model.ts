import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('notes')
export class Note {
    @PrimaryGeneratedColumn({name: 'note_id'})
    id: number;

    @Column({ nullable: true })
    title: string;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ default: 'default' })
    color: string;

    @Column({ default: false })
    is_pinned: boolean;

    @Column({ nullable: true })
    image_url: string;

    @Column({ type: 'timestamp', nullable: true })
    reminder_date: Date;

    @Column({ default: false })
    is_archived: boolean;

    @Column({ default: false })
    is_deleted: boolean;

    @Column({ nullable: true })
    user_id: number;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}
