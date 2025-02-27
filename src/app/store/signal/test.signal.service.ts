import { Injectable } from '@angular/core';

import { Product } from '../models/product.model';
import { Signal } from '@angular/core';
import { StateService } from './lib.state.signal.service';

interface ProductState {
  products: Product[];
  selectProductId: string | null;
  loading: boolean;
  loadingSelect: boolean;
  error: string | null;
  success: string | null;
  addProductSuccess: string | null;
  updateProductSuccess: string | null;
  deleteProductSuccess: string | null;
  addProductError: string | null;
  updateProductError: string | null;
  deleteProductError: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProductStateService {
  private state: StateService<ProductState>;

  constructor() {
    this.state = StateService.create<ProductState>({
      products: [],
      selectProductId: null,
      loading: false,
      loadingSelect: false,
      error: null,
      success: null,
      addProductSuccess: null,
      updateProductSuccess: null,
      deleteProductSuccess: null,
      addProductError: null,
      updateProductError: null,
      deleteProductError: null,
    });
  }

  get<K extends keyof ProductState>(key: K): Signal<ProductState[K]> {
    return this.state.get(key);
  }

  set<K extends keyof ProductState>(key: K, value: ProductState[K]): void {
    this.state.set(key, value);
  }

  addProduct(product: Product) {
    this.state.addToArray('products', product);
  }

  removeProduct(productId: string) {
    this.state.removeFromArray('products', (p) => p.id === productId);
  }

  updateProduct(productId: string, updatedProduct: Partial<Product>) {
    this.state.updateArrayItem(
      'products',
      (p) => p.id === productId,
      (p) => ({
        ...p,
        ...updatedProduct,
      })
    );
  }
}
