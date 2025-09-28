import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductData } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<ProductData>('products.json').pipe(
      map(data => data.products)
    );
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<ProductData>('products.json').pipe(
      map(data => data.products.find(p => p.id === id))
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<ProductData>('products.json').pipe(
      map(data => data.products.filter(p => p.category === category))
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<ProductData>('products.json').pipe(
      map(data => [...new Set(data.products.map(p => p.category))])
    );
  }

  getProductsGroupedByCategory(): Observable<{ [category: string]: Product[] }> {
    return this.http.get<ProductData>('products.json').pipe(
      map(data => {
        const grouped: { [category: string]: Product[] } = {};
        data.products.forEach(product => {
          if (!grouped[product.category]) {
            grouped[product.category] = [];
          }
          grouped[product.category].push(product);
        });
        return grouped;
      })
    );
  }
}
