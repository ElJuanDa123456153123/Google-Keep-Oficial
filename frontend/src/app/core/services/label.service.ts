import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Label, CreateLabelDto, UpdateLabelDto, AddLabelToNoteDto } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Label[]> {
    return this.api.get<Label[]>('/label/getall');
  }

  getById(id: number): Observable<Label> {
    return this.api.get<Label>(`/label/getbyid/${id}`);
  }

  getByUserId(userId: number): Observable<Label[]> {
    return this.api.get<Label[]>(`/label/getbyuser/${userId}`);
  }

  getByNoteId(noteId: number): Observable<Label[]> {
    return this.api.get<Label[]>(`/label/by-note/${noteId}`);
  }

  create(labelDto: CreateLabelDto): Observable<Label> {
    return this.api.post<Label>('/label/save', labelDto);
  }

  update(id: number, labelDto: UpdateLabelDto): Observable<Label> {
    return this.api.post<Label>(`/label/update/${id}`, labelDto);
  }

  addToNote(dto: AddLabelToNoteDto): Observable<any> {
    return this.api.post('/label/add-to-note', dto);
  }

  removeFromNote(noteId: number, labelId: number): Observable<void> {
    return this.api.delete<void>(`/label/remove-from-note/${noteId}/${labelId}`);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/label/delete/${id}`);
  }
}
