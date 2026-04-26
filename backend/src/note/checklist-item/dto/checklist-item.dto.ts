import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateChecklistItemDto {
  @IsNumber()
  note_id!: number;

  @IsString()
  content!: string;

  @IsOptional()
  @IsBoolean()
  is_checked?: boolean;

  @IsOptional()
  @IsNumber()
  position?: number;
}

export class UpdateChecklistItemDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  is_checked?: boolean;

  @IsOptional()
  @IsNumber()
  position?: number;
}