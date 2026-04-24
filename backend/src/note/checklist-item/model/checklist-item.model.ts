import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('checklist_items')
export class ChecklistItem {
    @PrimaryGeneratedColumn({name: 'item_id'})
    id: number;

    @Column()
    note_id: number;

    @Column()
    content: string;

    @Column({ default: false })
    is_checked: boolean;

    @Column({ default: 0 })
    position: number;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}
