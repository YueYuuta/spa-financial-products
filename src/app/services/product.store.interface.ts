import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces';

// 🔹 Crear un Token de Inyección
export const PRODUCT_STORE = new InjectionToken<ProductStore>('ProductStore');

export interface ProductStore {
  getProducts(): Observable<Product[]>;
  getLoading(): Observable<boolean>;
  updateProduct(id: string, product: Product): void;
  createProduct(product: Product): void;
  verifyProduct(id: string): Observable<boolean>;
  deleteProduct(id: string): void;
  selectProductId(id: string): void;
  getProductIdSelect(): Observable<Product>;
  getDeleteSuccessUi(): Observable<string | null>;
  getDeleteErrorUi(): Observable<string | null>;

  getUpdateSuccessUi(): Observable<string | null>;
  getUpdateErrorUi(): Observable<string | null>;

  getCreateSuccessUi(): Observable<string | null>;
  getCreateErrorUi(): Observable<string | null>;
}
