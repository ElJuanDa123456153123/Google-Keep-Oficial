import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User, CreateUserDto, LoginDto, UpdateUserDto } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private api: ApiService) {}

  getAll(): Observable<User[]> {
    return this.api.get<User[]>('/user/getall');
  }

  getById(id: number): Observable<User> {
    return this.api.get<User>(`/user/getbyid/${id}`);
  }

  getByEmail(email: string): Observable<User> {
    return this.api.get<User>(`/user/by-email/${email}`);
  }

  register(userDto: CreateUserDto): Observable<User> {
    return this.api.post<User>('/user/register', userDto);
  }

  login(loginDto: LoginDto): Observable<User> {
    return this.api.post<User>('/user/login', loginDto);
  }

  update(id: number, userDto: UpdateUserDto): Observable<User> {
    return this.api.put<User>(`/user/update/${id}`, userDto);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/user/delete/${id}`);
  }
}
