import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store/reducers';
import { Observable, tap } from 'rxjs';
import { Product } from '../interfaces';
import {
  selectAddProductError,
  selectAddProductSuccess,
  selectAllProducts,
  SelectDeleteProductError,
  SelectDeleteProductSuccess,
  selectLoading,
  selectProductId,
  selectUpdateProductError,
  selectUpdateProductSuccess,
} from '../store/selectors/product.selector';
import { ProductStore } from './product.store.interface';
import * as ProductActions from '../store/actions/product.action';
import { ProductService } from './product.service';

@Injectable({ providedIn: 'root' })
export class ProductNgrxService implements ProductStore {
  private _store: Store<AppState> = inject(Store<AppState>);
  private _productService = inject(ProductService);
  getCreateSuccessUi(): Observable<string | null> {
    return this._store.pipe(select(selectAddProductSuccess));
  }
  getCreateErrorUi(): Observable<string | null> {
    return this._store.pipe(select(selectAddProductError));
  }
  getUpdateSuccessUi(): Observable<string | null> {
    return this._store.pipe(select(selectUpdateProductSuccess));
  }
  getUpdateErrorUi(): Observable<string | null> {
    return this._store.pipe(select(selectUpdateProductError));
  }
  getProductIdSelect(): Observable<Product> {
    return this._store.pipe(select(selectProductId)) as Observable<Product>;
  }
  selectProductId(id: string): void {
    this._store.dispatch(ProductActions.selectProductId({ id }));
  }

  deleteProduct(id: string) {
    this._store.dispatch(ProductActions.deleteProduct({ id }));
  }

  verifyProduct(id: string): Observable<boolean> {
    return this._productService.verifyProduct(id);
  }

  createProduct(product: Product) {
    this._store.dispatch(ProductActions.addProduct({ product }));
  }
  updateProduct(id: string, product: Product) {
    this._store.dispatch(
      ProductActions.updateProduct({ id: product.id, product })
    );
  }

  getProducts(): Observable<Product[]> {
    return this._store.pipe(select(selectAllProducts)).pipe(
      tap((products) => {
        if (products.length === 0) {
          this._store.dispatch(ProductActions.loadProducts());
        }
      })
    );
  }

  getLoading(): Observable<boolean> {
    return this._store.pipe(select(selectLoading));
  }
  getDeleteSuccessUi(): Observable<string | null> {
    return this._store.pipe(select(SelectDeleteProductSuccess));
  }
  getDeleteErrorUi(): Observable<string | null> {
    return this._store.pipe(select(SelectDeleteProductError));
  }
}
