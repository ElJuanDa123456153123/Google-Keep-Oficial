import { Label } from './label.model';
import { Collaborator } from './collaborator.model';

export interface Note {
  id: number;
  title?: string;
  content?: string;
  color: string;
  is_pinned: boolean;
  image_url?: string;
  reminder_date?: Date;
  is_archived: boolean;
  is_deleted: boolean;
  user_id?: number;
  created_at: Date;
  updated_at: Date;
  checklist_items?: ChecklistItem[];
  labels?: Label[];
  collaborators?: Collaborator[];
}

export interface ChecklistItem {
  id: number;
  note_id: number;
  content: string;
  is_checked: boolean;
  position: number;
}

export interface CreateChecklistItemDto {
  note_id?: number;
  content: string;
  position?: number;
}

export interface UpdateChecklistItemDto {
  content?: string;
  is_checked?: boolean;
  position?: number;
}

export interface CreateNoteDto {
  title?: string;
  content?: string;
  color?: string;
  is_pinned?: boolean;
  image_url?: string;
  reminder_date?: Date;
  user_id?: number;
  checklist_items?: CreateChecklistItemDto[];
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  color?: string;
  is_pinned?: boolean;
  image_url?: string;
  reminder_date?: Date;
  is_archived?: boolean;
}
