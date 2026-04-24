export interface Label {
  id: number;
  name: string;
  user_id: number;
}

export interface CreateLabelDto {
  name: string;
  user_id: number;
}

export interface UpdateLabelDto {
  name?: string;
}

export interface AddLabelToNoteDto {
  note_id: number;
  label_id: number;
}
