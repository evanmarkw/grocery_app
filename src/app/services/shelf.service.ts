import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shelf } from '../models/shelf.interface';

@Injectable({
  providedIn: 'root'
})
export class ShelfService {
  private apiUrl = 'http://localhost:2007/api/shelves';

  constructor(private http: HttpClient) { }

  getAllShelves(): Observable<Shelf[]> {
    return this.http.get<Shelf[]>(this.apiUrl);
  }

  getShelvesByAisle(aisleId: number): Observable<Shelf[]> {
    return this.http.get<Shelf[]>(`${this.apiUrl}/aisle/${aisleId}`);
  }

  getShelvesByStore(storeId: number): Observable<Shelf[]> {
    return this.http.get<Shelf[]>(`${this.apiUrl}/store/${storeId}`);
  }

  getShelfById(id: number): Observable<Shelf> {
    return this.http.get<Shelf>(`${this.apiUrl}/${id}`);
  }

  createShelf(shelf: Shelf): Observable<Shelf> {
    // Transform to match backend format
    const payload = {
      ...shelf,
      aisle: { id: shelf.aisleId },
      store: { id: shelf.storeId }
    };
    return this.http.post<Shelf>(this.apiUrl, payload);
  }

  updateShelf(id: number, shelf: Shelf): Observable<Shelf> {
    const payload = {
      ...shelf,
      aisle: { id: shelf.aisleId },
      store: { id: shelf.storeId }
    };
    return this.http.put<Shelf>(`${this.apiUrl}/${id}`, payload);
  }

  deleteShelf(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
