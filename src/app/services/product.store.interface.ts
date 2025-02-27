import { InjectionToken, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces';

// 🔹 Crear un Token de Inyección
export const PRODUCT_STORE = new InjectionToken<ProductStore>('ProductStore');

export interface ProductStore {
  getProducts(): Signal<Product[]>;
  getLoading(): Signal<boolean>;
  updateProduct(id: string, product: Product): void;
  createProduct(product: Product): void;
  verifyProduct(id: string): Signal<boolean>;
  deleteProduct(id: string): void;
  selectProductId(id: string): void;
  getProductIdSelect(): Signal<Product>;
  getDeleteSuccessUi(): Signal<string | null>;
  getDeleteErrorUi(): Signal<string | null>;
  loadProducts(): void;
  getUpdateSuccessUi(): Signal<string | null>;
  getUpdateErrorUi(): Signal<string | null>;

  getCreateSuccessUi(): Signal<string | null>;
  getCreateErrorUi(): Signal<string | null>;
}
