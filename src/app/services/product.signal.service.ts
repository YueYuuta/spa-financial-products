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
import { Observable, tap } from 'rxjs';
import { ProductSignalStore } from '../store/signal/product-store.signal.service';
import { ProductStore } from './product.store.interface';
import { Product } from '../interfaces';
import { ProductSignalStore2 } from '../store/signal/product-store.service';

@Injectable({ providedIn: 'root' })
export class ProductSignalService implements ProductStore {
  // private productStore = inject(ProductSignalStore);
  private productService = inject(ProductService);

  private productStore2 = inject(ProductSignalStore2);

  private injector = inject(EnvironmentInjector);

  constructor(injector: EnvironmentInjector) {
    this.injector = injector; // ✅ Set the injected instance
  }
  loadProducts(): void {
    this.productStore2.loadProducts();
  }
  updateProduct(id: string, product: Product): void {
    throw new Error('Method not implemented.');
  }
  createProduct(product: Product): void {
    this.productStore2.createProduct(product);
  }
  deleteProduct(id: string): void {
    throw new Error('Method not implemented.');
  }
  selectProductId(id: string): void {
    throw new Error('Method not implemented.');
  }
  getProducts(): Signal<Product[]> {
    return this.productStore2.state.products$;
  }
  getLoading(): Signal<boolean> {
    return this.productStore2.state.loading$;
  }
  verifyProduct(id: string): Signal<boolean> {
    throw new Error('Method not implemented.');
  }
  getProductIdSelect(): Signal<Product> {
    throw new Error('Method not implemented.');
  }
  getDeleteSuccessUi(): Signal<string | null> {
    throw new Error('Method not implemented.');
  }
  getDeleteErrorUi(): Signal<string | null> {
    throw new Error('Method not implemented.');
  }
  getUpdateSuccessUi(): Signal<string | null> {
    throw new Error('Method not implemented.');
  }
  getUpdateErrorUi(): Signal<string | null> {
    throw new Error('Method not implemented.');
  }
  getCreateSuccessUi(): Signal<string | null> {
    return this.productStore2.state2.addProductSuccess;
  }
  getCreateErrorUi(): Signal<string | null> {
    return this.productStore2.state2.addProductError;
  }
}
