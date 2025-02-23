import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces';

// 🔹 Crear un Token de Inyección
export const PRODUCT_STORE = new InjectionToken<ProductStore>('ProductStore');

export interface ProductStore {
  getProducts(): Observable<Product[]>;
  getLoading(): Observable<boolean>;
  updateProduct(id: string, product: Product): Observable<Product>;
  createProduct(id: string, product: Product): Observable<Product>;
  verifyProduct(id: string): Observable<boolean>;
  deleteProduct(id: string): void;
  getDeleteSuccessUi(): Observable<string | null>;
  getDeleteErrorUi(): Observable<string | null>;
}
