import { IsEnum, IsNumber } from "class-validator";

export class AddCollaboratorDto {
    @IsNumber()
    note_id: number;

    @IsNumber()
    user_id: number;

    @IsEnum(['edit', 'view'])
    permission: 'edit' | 'view';
}
