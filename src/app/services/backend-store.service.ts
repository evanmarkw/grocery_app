import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackendStore } from '../models/backend-product.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BackendStoreService {
  private apiUrl = 'http://localhost:2007/api/stores';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAllStores(): Observable<BackendStore[]> {
    return this.http.get<BackendStore[]>(this.apiUrl, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getActiveStores(): Observable<BackendStore[]> {
    return this.http.get<BackendStore[]>(`${this.apiUrl}/active`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getStoreById(id: number): Observable<BackendStore> {
    return this.http.get<BackendStore>(`${this.apiUrl}/id/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  createStore(store: BackendStore): Observable<BackendStore> {
    return this.http.post<BackendStore>(this.apiUrl, store, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateStore(id: number, store: BackendStore): Observable<BackendStore> {
    return this.http.put<BackendStore>(`${this.apiUrl}/${id}`, store, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteStore(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  searchStores(query: string): Observable<BackendStore[]> {
    return this.http.get<BackendStore[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
