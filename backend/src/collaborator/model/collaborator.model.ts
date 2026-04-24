import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('note_collaborators')
export class Collaborator {
    @PrimaryGeneratedColumn({name: 'collaborator_id'})
    id: number;

    @Column()
    note_id: number;

    @Column()
    user_id: number;

    @Column({ default: 'edit' })
    permission: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;
}
