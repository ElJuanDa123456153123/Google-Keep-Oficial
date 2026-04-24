import { User } from './user.model';

export interface Collaborator {
  id: number;
  note_id: number;
  user_id: number;
  permission: 'edit' | 'view';
  user?: User;
}

export interface AddCollaboratorDto {
  note_id: number;
  user_id: number;
  permission?: 'edit' | 'view';
}

export interface UpdatePermissionDto {
  permission: 'edit' | 'view';
}
