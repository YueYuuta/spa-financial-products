import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Signal } from '@angular/core';
import { ProductState } from '../interface/store.product.interface';
import { OsoStateJC } from 'oso-state-jc';
import { ProductService } from '../../services/product.service';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';

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

  // Función de acceso al estado
  get<K extends keyof ProductState>(key: K): Signal<ProductState[K]> {
    return this._state.modify(key).get();
  }

  // Función para actualizar el estado
  set<K extends keyof ProductState>(key: K, value: ProductState[K]): void {
    this._state.modify(key).set(value);
  }

  // Función para manejar múltiples cambios de estado
  private updateState(data: Partial<ProductState>) {
    Object.entries(data).forEach(([key, value]) => {
      this.set(key as keyof ProductState, value);
    });
  }

  // Lógica para agregar un producto
  addProduct(product: Product) {
    this._productService
      .createProduct(product)
      .pipe(
        tap((_) => this.handleProductCreationSuccess(product)),
        catchError((err) => this.handleError(err, 'addProduct'))
      )
      .subscribe();
  }

  private handleProductCreationSuccess(product: Product) {
    this.updateState({
      loading: false,
      addProductError: null,
      addProductSuccess: 'Producto creado correctamente',
    });
    this._state.modify('products').add(product);
  }

  // Lógica para eliminar un producto
  deleteProduct(id: string) {
    this.set('loading', true);
    this.verifyAndExecuteProductAction(
      id,
      () =>
        this._productService
          .deleteProduct(id)
          .pipe(tap(() => this.handleDeleteProductSuccess(id))),
      'Producto eliminado correctamente',
      'El producto no existe'
    ).subscribe();
  }

  // Lógica para eliminar el producto después de la verificación
  private handleDeleteProductSuccess(id: string) {
    this.updateState({
      deleteProductSuccess: 'Producto eliminado correctamente',
    });
    this.removeProductStore(id);
  }

  private removeProductStore(productId: string) {
    this._state.modify('products').remove((p) => p.id === productId);
  }

  // Lógica para verificar y ejecutar acciones sobre productos
  private verifyAndExecuteProductAction<T>(
    id: string,
    action: () => Observable<T>,
    successMessage: string,
    errorMessage: string
  ): Observable<T> {
    return this._productService.verifyProduct(id).pipe(
      switchMap((exist) => {
        if (exist) {
          return action();
        } else {
          this.set('loading', false);
          this.set('deleteProductError', errorMessage);
          return throwError(() => new Error(errorMessage));
        }
      }),
      tap(() => this.set('loading', false)),
      catchError((err) => this.handleError(err, 'deleteProduct'))
    );
  }

  // Función para manejar los errores
  private handleError(error: any, action: string) {
    this.updateState({
      loading: false,
      [`${action}Error`]: error.message,
      [`${action}Success`]: null,
    });
    return throwError(() => error);
  }

  // Lógica para actualizar un producto
  updateProduct(id: string, product: Product) {
    this.set('loading', true);
    this.verifyAndExecuteProductAction(
      id,
      () =>
        this._productService
          .updateProduct(id, product)
          .pipe(tap(() => this.handleUpdateProductSuccess(id, product))),
      'Producto editado correctamente',
      'El producto no existe'
    ).subscribe({
      complete: () => {
        this.set('loading', false);
        console.log(this._state.state);
      },
    });
  }

  private handleUpdateProductSuccess(id: string, product: Product) {
    this.updateState({
      updateProductSuccess: 'Producto editado correctamente',
    });
    this.updateProductStore(id, product);
  }

  private updateProductStore(
    productId: string,
    updatedProduct: Partial<Product>
  ) {
    this._state.modify('products').update(
      (p: Product) => p.id === productId,
      (p: Product) => ({
        ...p,
        ...updatedProduct,
      })
    );
  }

  // Cargar productos
  loadProducts() {
    // this.resetMessage();
    const products = this.get('products');
    if (products().length > 0) return;
    this.set('loading', true);
    this._productService
      .getProducts()
      .pipe(
        tap((productsDb) => {
          this.updateState({ success: 'Productos cargados correctamente' });
          this._state.modify('products').set(productsDb);
        }),
        catchError((err) => this.handleError(err, 'loadProducts'))
      )
      .subscribe({ complete: () => this.set('loading', false) });
  }

  // Restablecer mensajes de éxito/error
  resetMessage() {
    this.updateState({
      success: null,
      error: null,
      addProductError: null,
      addProductSuccess: null,
      deleteProductError: null,
      deleteProductSuccess: null,
      updateProductError: null,
      updateProductSuccess: null,
    });
  }
}
