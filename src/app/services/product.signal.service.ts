import {
  Injectable,
  inject,
  signal,
  computed,
  effect,
  runInInjectionContext,
  EnvironmentInjector,
  Signal,
} from '@angular/core';

import { ProductService } from './product.service';

import { ProductStore } from './product.store.interface';
import { Product } from '../interfaces';

import { ProductStateService } from '../store/signal/products-state.service';

@Injectable({ providedIn: 'root' })
export class ProductSignalService implements ProductStore {
  // private productStore = inject(ProductSignalStore);
  private productService = inject(ProductService);

  private _productStateService = inject(ProductStateService);

  private injector = inject(EnvironmentInjector);

  constructor(injector: EnvironmentInjector) {
    this.injector = injector; // ✅ Set the injected instance
  }

  loadProducts(): void {
    this._productStateService.loadProducts();
  }
  updateProduct(id: string, product: Product): void {
    this._productStateService.updateProduct(id, product);
  }
  createProduct(product: Product): void {
    this._productStateService.addProduct(product);
  }
  deleteProduct(id: string): void {
    this._productStateService.deleteProduct(id);
  }
  selectProductId(id: string): void {
    throw new Error('Method not implemented.');
  }
  getProducts(): Signal<Product[]> {
    return this._productStateService.get('products');
  }
  getLoading(): Signal<boolean> {
    return this._productStateService.get('loading');
  }
  verifyProduct(id: string): Signal<boolean> {
    throw new Error('Method not implemented.');
  }
  getProductSelected(): Signal<Product | null> {
    return this._productStateService.get('selectedProduct');
  }
  setProductSelected(product: Product): void {
    this._productStateService.set('selectedProduct', product);
  }
  getDeleteSuccessUi(): Signal<string | null> {
    return this._productStateService.get('deleteProductSuccess');
  }
  getDeleteErrorUi(): Signal<string | null> {
    return this._productStateService.get('deleteProductError');
  }
  getUpdateSuccessUi(): Signal<string | null> {
    return this._productStateService.get('updateProductSuccess');
  }
  getUpdateErrorUi(): Signal<string | null> {
    return this._productStateService.get('updateProductError');
  }
  getCreateSuccessUi(): Signal<string | null> {
    return this._productStateService.get('addProductSuccess');
  }
  getCreateErrorUi(): Signal<string | null> {
    return this._productStateService.get('addProductError');
  }

  getSuccessUi(): Signal<string | null> {
    return this._productStateService.get('success');
  }
  getErrorUi(): Signal<string | null> {
    return this._productStateService.get('error');
  }
}
