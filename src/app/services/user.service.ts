import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserRole } from '../models/user.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:2007/api/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAllUsers(): Observable<User[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<User[]>(this.apiUrl, { headers });
  }

  getUserById(id: number): Observable<User> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers });
  }

  createUser(user: User): Observable<User> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<User>(this.apiUrl, user, { headers });
  }

  updateUser(id: number, user: User): Observable<User> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, { headers });
  }

  deleteUser(userId: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${userId}`, { headers });
  }

  getActiveUsers(): Observable<User[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/active`, { headers });
  }

  getUsersByRole(role: UserRole): Observable<User[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/role/${role}`, { headers });
  }
}
