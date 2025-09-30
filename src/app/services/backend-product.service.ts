import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackendProduct } from '../models/backend-product.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BackendProductService {
  private apiUrl = 'http://localhost:2007/api/products';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAllProducts(): Observable<BackendProduct[]> {
    return this.http.get<BackendProduct[]>(this.apiUrl, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getActiveProducts(): Observable<BackendProduct[]> {
    return this.http.get<BackendProduct[]>(`${this.apiUrl}/active`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getProductById(id: number): Observable<BackendProduct> {
    return this.http.get<BackendProduct>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  createProduct(product: BackendProduct, storeId?: number): Observable<BackendProduct> {
    const url = storeId ? `${this.apiUrl}?storeId=${storeId}` : this.apiUrl;
    return this.http.post<BackendProduct>(url, product, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateProduct(id: number, product: BackendProduct): Observable<BackendProduct> {
    return this.http.put<BackendProduct>(`${this.apiUrl}/${id}`, product, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  searchProducts(query: string): Observable<BackendProduct[]> {
    return this.http.get<BackendProduct[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
