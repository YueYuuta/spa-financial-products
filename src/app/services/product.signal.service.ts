import {
  Injectable,
  inject,
  signal,
  computed,
  effect,
  runInInjectionContext,
  EnvironmentInjector,
} from '@angular/core';

import { ProductService } from './product.service';
import { Observable, tap } from 'rxjs';
import { ProductSignalStore } from '../store-signals/product-store.signal.service';
import { ProductStore } from './product.store.interface';
import { Product } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class ProductSignalService implements ProductStore {
  private productStore = inject(ProductSignalStore);
  private productService = inject(ProductService);

  private injector = inject(EnvironmentInjector);

  constructor(injector: EnvironmentInjector) {
    this.injector = injector; // ✅ Set the injected instance
  }
  private toObservable<T>(signalValue: () => T): Observable<T> {
    return new Observable((subscriber) => {
      subscriber.next(signalValue()); // Emit initial value

      runInInjectionContext(this.injector, () => {
        const ref = effect(() => {
          subscriber.next(signalValue()); // Emit reactive changes
        });

        // Cleanup when Observable completes
        return () => ref.destroy();
      });
    });
  }

  getCreateSuccessUi(): Observable<string | null> {
    return this.toObservable(() => this.productStore.addProductSuccess());
  }

  getCreateErrorUi(): Observable<string | null> {
    return this.toObservable(() => this.productStore.addProductError());
  }

  getUpdateSuccessUi(): Observable<string | null> {
    return this.toObservable(() => this.productStore.updateProductSuccess());
  }

  getUpdateErrorUi(): Observable<string | null> {
    return this.toObservable(() => this.productStore.updateProductError());
  }

  getDeleteSuccessUi(): Observable<string | null> {
    return this.toObservable(() => this.productStore.deleteProductSuccess());
  }

  getDeleteErrorUi(): Observable<string | null> {
    return this.toObservable(() => this.productStore.deleteProductError());
  }

  getProductIdSelect(): Observable<Product> {
    return this.toObservable(() => this.productStore.selectedProduct()) as any;
  }

  selectProductId(id: string): void {
    this.productStore.setSelectedProductId(id);
  }

  deleteProduct(id: string): void {
    this.productStore.deleteProduct(id);
  }

  verifyProduct(id: string): Observable<boolean> {
    return this.productService.verifyProduct(id);
  }

  createProduct(product: Product): void {
    this.productStore.addProduct(product);
  }

  updateProduct(id: string, product: Product): void {
    this.productStore.updateProduct(product);
  }

  getProducts(): Observable<Product[]> {
    return this.toObservable(() => this.productStore.products()).pipe(
      tap((products) => {
        if (products.length === 0) {
          queueMicrotask(() => this.productStore.loadProducts());
        } else {
          queueMicrotask(() => this.productStore.resetMessages());
        }
      })
    );
  }

  getLoading(): Observable<boolean> {
    return this.toObservable(() => this.productStore.loading());
  }
}
