import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product } from '../store/models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = '/api/bp/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<{ data: Product[] }>(this.apiUrl)
      .pipe(map((data) => data.data));
  }

  createProduct(product: Product): Observable<{ data: Product }> {
    return this.http.post<{ data: Product }>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Product): Observable<{ data: Product }> {
    return this.http.put<{ data: Product }>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  verifyProduct(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`);
  }
}
