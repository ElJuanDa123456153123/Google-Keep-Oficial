import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Note, CreateNoteDto, UpdateNoteDto, ChecklistItem, CreateChecklistItemDto, UpdateChecklistItemDto } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  constructor(private api: ApiService) {}

  // Note endpoints
  getAll(): Observable<Note[]> {
    return this.api.post<Note[]>('/note/getall');
  }

  getById(id: number): Observable<Note> {
    return this.api.post<Note>(`/note/getbyid/${id}`);
  }

  getByUserId(userId: number): Observable<Note[]> {
    return this.api.post<Note[]>(`/note/getbyuser/${userId}`);
  }

  create(noteDto: CreateNoteDto): Observable<Note> {
    return this.api.post<Note>('/note/save', noteDto);
  }

  update(id: number, noteDto: UpdateNoteDto): Observable<Note> {
    return this.api.post<Note>(`/note/update/${id}`, noteDto);
  }

  delete(id: number): Observable<void> {
    return this.api.post<void>(`/note/delete/${id}`);
  }

  togglePin(id: number): Observable<Note> {
    return this.api.post<Note>(`/note/toggle-pin/${id}`, {});
  }

  archive(id: number): Observable<Note> {
    return this.api.post<Note>(`/note/archive/${id}`, {});
  }

  // Checklist item endpoints
  getChecklistByNoteId(noteId: number): Observable<ChecklistItem[]> {
    return this.api.post<ChecklistItem[]>(`/checklist-item/by-note/${noteId}`);
  }

  createChecklistItem(itemDto: CreateChecklistItemDto): Observable<ChecklistItem> {
    return this.api.post<ChecklistItem>('/checklist-item/save', itemDto);
  }

  updateChecklistItem(id: number, itemDto: UpdateChecklistItemDto): Observable<ChecklistItem> {
    return this.api.post<ChecklistItem>(`/checklist-item/update/${id}`, itemDto);
  }

  toggleChecklistItem(id: number): Observable<ChecklistItem> {
    return this.api.post<ChecklistItem>(`/checklist-item/toggle-check/${id}`, {});
  }

  deleteChecklistItem(id: number): Observable<void> {
    return this.api.delete<void>(`/checklist-item/delete/${id}`);
  }

  deleteChecklistByNoteId(noteId: number): Observable<void> {
    return this.api.delete<void>(`/checklist-item/delete-by-note/${noteId}`);
  }
  
  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.postFormData<{ url: string }>('/uploads/image', formData);
  }
}