import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Signal } from '@angular/core';

import { ProductState } from '../interface/store.product.interface';
import { OsoStateJC } from '../../lib/store/oso-state-jc.service';
import { ProductService } from '../../services/product.service';
import { catchError, of, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductStateService {
  private readonly _state: OsoStateJC<ProductState>;
  private readonly _productService = inject(ProductService);

  constructor() {
    this._state = OsoStateJC.create<ProductState>({
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
      selectedProduct: null,
      selectedProductId: null,
    });
  }

  get<K extends keyof ProductState>(key: K): Signal<ProductState[K]> {
    return this._state.modify(key).get();
  }
  getProduct() {
    return this._state.modify('products').get();
  }

  set<K extends keyof ProductState>(key: K, value: ProductState[K]): void {
    this._state.modify(key).set(value);
  }

  addProduct(product: Product) {
    this._productService
      .createProduct(product)
      .pipe(
        tap((_) => {
          console.log('🚀 ~ ProductStateService ~ tap ~ _:', _);
          this.set('loading', false);
          this.set('addProductError', null);
          this.set('addProductSuccess', 'Producto creado correctamente');
          this._state.modify('products').add(product);
        }),
        catchError((err) => {
          this.set('loading', false);
          this.set('addProductError', err.message);
          this.set('addProductSuccess', null);
          return throwError(() => err);
        })
      )
      .subscribe();
  }

  removeProductStore(productId: string) {
    this._state.modify('products').remove((p) => p.id === productId);
  }

  updateProductStore(productId: string, updatedProduct: Partial<Product>) {
    this._state.modify('products').update(
      (p: Product) => p.id === productId,
      (p: Product) => ({
        ...p,
        ...updatedProduct,
      })
    );
  }

  deleteProduct(id: string) {
    this.set('loading', true);
    this._productService
      .verifyProduct(id)
      .pipe(
        switchMap((exist) => {
          if (exist) {
            return this._productService
              .deleteProduct(id)
              .pipe(tap(() => this.handleDeleteProductSuccess(id)));
          } else {
            return this.handleDeleteProductError('El producto no existe');
          }
        }),
        catchError((error) => this.handleDeleteProductError(error.message))
      )
      .subscribe({
        complete: () => this.set('loading', false),
      });
  }

  private handleDeleteProductSuccess(id: string) {
    this.set('deleteProductSuccess', null);
    this.set('deleteProductSuccess', 'Producto eliminado correctamente');
    this.removeProductStore(id);
  }

  private handleDeleteProductError(errorMessage: string) {
    this.set('deleteProductSuccess', null);
    this.set('deleteProductError', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  updateProduct(id: string, product: Product) {
    this.set('loading', true);
    this._productService
      .verifyProduct(id)
      .pipe(
        switchMap((exist) => {
          if (exist) {
            return this._productService
              .updateProduct(id, product)
              .pipe(tap(() => this.handleUpdateProductSuccess(id, product)));
          } else {
            return this.handleUpdateProductError('El producto no existe');
          }
        }),
        catchError((error) => this.handleUpdateProductError(error.message))
      )
      .subscribe({
        complete: () => {
          this.set('loading', false);
          console.log(this._state.state);
        },
      });
  }

  private handleUpdateProductSuccess(id: string, product: Product) {
    this.set('updateProductError', null);
    this.set('updateProductSuccess', 'Producto editado correctamente');
    this.updateProductStore(id, product);
  }

  private handleUpdateProductError(errorMessage: string) {
    this.set('updateProductSuccess', null);
    this.set('updateProductError', errorMessage);
    return throwError(() => new Error(errorMessage)); // Lanza el error
  }

  loadProducts() {
    this.resetMessage();
    const products = this.get('products');
    if (products().length > 0) return;
    this.set('loading', true);
    this._productService
      .getProducts()
      .pipe(
        tap((productsDb) => {
          this.set('error', null);
          this.set('success', 'Productos cargados correctamente');
          this._state.modify('products').set(productsDb);
        }),
        catchError((err) => {
          this.set('error', err.message);
          this.set('success', null);
          return throwError(() => err);
        })
      )
      .subscribe({ complete: () => this.set('loading', false) });
  }

  resetMessage() {
    this.set('success', null);
    this.set('error', null);
    this.set('addProductError', null);
    this.set('addProductSuccess', null);
    this.set('deleteProductError', null);
    this.set('deleteProductSuccess', null);
    this.set('updateProductError', null);
    this.set('updateProductSuccess', null);
  }
}
