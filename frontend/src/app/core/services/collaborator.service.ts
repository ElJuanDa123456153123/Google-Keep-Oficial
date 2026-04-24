import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Collaborator, AddCollaboratorDto, UpdatePermissionDto } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {
  constructor(private api: ApiService) {}

  getByNoteId(noteId: number): Observable<Collaborator[]> {
    return this.api.get<Collaborator[]>(`/collaborator/by-note/${noteId}`);
  }

  getByUserId(userId: number): Observable<Collaborator[]> {
    return this.api.get<Collaborator[]>(`/collaborator/by-user/${userId}`);
  }

  add(collabDto: AddCollaboratorDto): Observable<Collaborator> {
    return this.api.post<Collaborator>('/collaborator/add', collabDto);
  }

  updatePermission(id: number, permissionDto: UpdatePermissionDto): Observable<Collaborator> {
    return this.api.put<Collaborator>(`/collaborator/update-permission/${id}`, permissionDto);
  }

  remove(noteId: number, userId: number): Observable<void> {
    return this.api.delete<void>(`/collaborator/remove/${noteId}/${userId}`);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/collaborator/delete/${id}`);
  }
}
