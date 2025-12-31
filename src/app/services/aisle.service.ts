import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aisle } from '../models/aisle.interface';

@Injectable({
  providedIn: 'root'
})
export class AisleService {
  private apiUrl = 'http://localhost:2007/api/aisles';

  constructor(private http: HttpClient) { }

  getAllAisles(): Observable<Aisle[]> {
    return this.http.get<Aisle[]>(this.apiUrl);
  }

  getAislesByStore(storeId: number): Observable<Aisle[]> {
    return this.http.get<Aisle[]>(`${this.apiUrl}/store/${storeId}`);
  }

  getAisleById(id: number): Observable<Aisle> {
    return this.http.get<Aisle>(`${this.apiUrl}/${id}`);
  }

  createAisle(aisle: Aisle): Observable<Aisle> {
    // Transform to match backend format
    const payload = {
      ...aisle,
      store: { id: aisle.storeId }
    };
    return this.http.post<Aisle>(this.apiUrl, payload);
  }

  updateAisle(id: number, aisle: Aisle): Observable<Aisle> {
    const payload = {
      ...aisle,
      store: { id: aisle.storeId }
    };
    return this.http.put<Aisle>(`${this.apiUrl}/${id}`, payload);
  }

  deleteAisle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
