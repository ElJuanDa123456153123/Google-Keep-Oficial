import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateLabelDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsNumber()
    user_id?: number;
}

export class AddLabelToNoteDto {
    @IsNumber()
    note_id: number;

    @IsNumber()
    label_id: number;
}
