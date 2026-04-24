import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateNoteDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsBoolean()
    is_pinned?: boolean;

    @IsOptional()
    @IsString()
    image_url?: string;

    @IsOptional()
    @IsDate()
    reminder_date?: Date;

    @IsOptional()
    @IsBoolean()
    is_archived?: boolean;

    @IsOptional()
    @IsNumber()
    user_id?: number;
}

export class UpdateNoteDto extends CreateNoteDto {
    @IsNumber()
    id: number;
}
