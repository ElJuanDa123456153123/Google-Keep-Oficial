import {
  IsBoolean, IsDate, IsNumber,
  IsOptional, IsString, IsArray, ValidateNested
} from "class-validator";
import { Type } from "class-transformer";

export class ChecklistItemEmbeddedDto {
  @IsOptional()
  @IsNumber()
  id?: number;

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemEmbeddedDto)
  checklist_items?: ChecklistItemEmbeddedDto[];
}

export class UpdateNoteDto extends CreateNoteDto {
  @IsOptional()
  @IsNumber()
  id?: number;
}