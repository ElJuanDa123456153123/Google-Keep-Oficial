import { IsEnum, IsNumber, IsOptional } from "class-validator";

export class AddCollaboratorDto {
    @IsNumber()
    note_id!: number;

    @IsNumber()
    user_id!: number;

    @IsOptional()
    @IsEnum(['edit', 'view'])
    permission: 'edit' | 'view' = 'edit';
}