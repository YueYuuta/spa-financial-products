import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Product } from '../../interfaces';
import { ProductState } from '../interface/store.product.interface';

// **Tipo mapeado que convierte `ProductState` en señales con tipado fuerte**
type ProductStateSignals = {
  [K in keyof ProductState as `${K}$`]: Signal<ProductState[K]>;
};

@Injectable({
  providedIn: 'root',
})
export class ProductSignalStore2 {
  private readonly _productService = inject(ProductService);
  private productsServer = toSignal(this._getProductsServer(), {
    initialValue: [],
  });

  private _storeProductState = signal<ProductState>({
    products: [],
    loading: false,
    error: '',
    success: '',
    selectedProduct: null,
    addProductSuccess: '',
    updateProductSuccess: '',
    deleteProductSuccess: '',
    addProductError: '',
    updateProductError: '',
    deleteProductError: '',
    loadingSelect: false,
    selectedProductId: null,
    selectProductId: '',
  });
  private _state = {
    products: signal<Product[]>([]),
    selectProductId: signal<string | null>(null),
    loading: signal<boolean>(false),
    loadingSelect: signal<boolean>(false),
    error: signal<string | null>(null),
    success: signal<string | null>(null),
    addProductSuccess: signal<string | null>(null),
    updateProductSuccess: signal<string | null>(null),
    deleteProductSuccess: signal<string | null>(null),
    addProductError: signal<string | null>(null),
    updateProductError: signal<string | null>(null),
    deleteProductError: signal<string | null>(null),
  };
  public get state2() {
    return new Proxy(
      {},
      {
        get: (_, prop: string) => {
          if (prop in this._state) {
            return computed(() =>
              this._state[prop as keyof typeof this._state]()
            ); // ✅ Accede correctamente al valor
          }
          throw new Error(`Property "${prop}" does not exist in store`);
        },
      }
    ) as {
      [K in keyof typeof this._state]: Signal<
        ReturnType<(typeof this._state)[K]>
      >;
    };
  }

  addProductSuccess = signal<string | null>(null);

  suc = computed(() => this.addProductSuccess());

  selectedProduct = computed(() => {
    const id = this._storeProductState().selectProductId;
    console.log(
      '🚀 ~ ProductSignalStore2 ~ selectedProduct=computed ~ id:',
      id
    );
    return this._storeProductState().products.find((p) => p.id === id) || null;
  });
  setSelectedProductId(id: string | null) {
    this._storeProductState.update((currentState) => ({
      ...currentState,
      selectProductId: id,
    }));
  }

  constructor() {}

  get state(): ProductStateSignals {
    return Object.fromEntries(
      Object.entries(this._storeProductState()).map(([key, value]) => [
        `${key}$`,
        computed(() => value),
      ])
    ) as ProductStateSignals;
  }

  loadProducts() {
    if (this._storeProductState().products.length > 0) return;

    this._storeProductState.update((currentState) => ({
      ...currentState,
      loading: true,
    }));
    this.productsServer();
  }

  private _getProductsServer(): Observable<Product[]> {
    return this._productService.getProducts().pipe(
      tap((products) => {
        console.log('🚀 ~ ProductSignalStore2 ~ tap ~ products:', products);
        this._storeProductState.update((currentState) => ({
          ...currentState,
          loading: false,
          products: products,
          success: 'Productos cargados correctamente',
        }));
      }),
      catchError((err) => {
        this._storeProductState.update((currentState) => ({
          ...currentState,
          loading: false,
          error: err.message,
        }));
        return throwError(() => err);
      })
    );
  }
  createProduct(product: Product) {
    this._storeProductState.update((currentState) => ({
      ...currentState,
      loading: true,
    }));
    this._productService
      .createProduct(product)
      .pipe(
        tap((_) => {
          console.log('🚀 ~ ProductSignalStore2 ~ tap ~ _:', _);
          this._state.addProductSuccess.set(
            'Productos creado correctamente xd'
          );
          // this._storeProductState.update((currentState) => ({
          //   ...currentState,
          //   loading: false,
          //   addProductError: null,
          //   addProductSuccess: 'Productos cargados correctamente',
          //   products: [{ ...product }, ...currentState.products],
          // }));
        }),
        catchError((err) => {
          this._storeProductState.update((currentState) => ({
            ...currentState,
            loading: false,
            addProductError: err.message,
            addProductSuccess: null,
          }));
          return throwError(() => err);
        })
      )
      .subscribe();
  }
}
