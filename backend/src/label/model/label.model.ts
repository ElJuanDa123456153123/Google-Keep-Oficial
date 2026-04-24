import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('labels')
export class Label {
    @PrimaryGeneratedColumn({name: 'label_id'})
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    user_id: number;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}
