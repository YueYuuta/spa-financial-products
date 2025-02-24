import { Injectable, inject } from '@angular/core';
import { Observable, combineLatestWith, of, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Product, TableRow } from '../interfaces';
import {
  mapProductsToTableRows,
  filterTableRows,
} from '../utils/products/product.utils';
import { PRODUCT_STORE, ProductStore } from './product.store.interface';

@Injectable({ providedIn: 'root' })
export class ProductApplicationService {
  private readonly _productStore = inject<ProductStore>(PRODUCT_STORE);

  getProductTableRows(): Observable<TableRow[]> {
    return this._productStore.getProducts().pipe(map(mapProductsToTableRows));
  }

  filterProducts(search$: Observable<string>): Observable<TableRow[]> {
    return this.getProductTableRows().pipe(
      tap((data) => console.log('holaa', data)),
      combineLatestWith(search$),
      map(([rows, searchTerm]) => filterTableRows(rows, searchTerm))
    );
  }
  getLoading(): Observable<boolean> {
    return this._productStore.getLoading();
  }
  verifyProduct(id: string): Observable<boolean> {
    return this._productStore.verifyProduct(id);
  }

  updatProduct(id: string, product: Product) {
    this._productStore.updateProduct(id, product);
  }

  createProduct(product: Product) {
    this._productStore.createProduct(product);
  }

  deleteProduct(id: string) {
    this._productStore.deleteProduct(id);
  }
  selectProductId(id: string) {
    this._productStore.selectProductId(id);
  }

  getProductIdSelect() {
    return this._productStore.getProductIdSelect();
  }

  getDeleteSuccessUi(): Observable<string | null> {
    return this._productStore.getDeleteSuccessUi();
  }
  getDeleteErrorUi(): Observable<string | null> {
    return this._productStore.getDeleteErrorUi();
  }

  getUpdateSuccessUi(): Observable<string | null> {
    return this._productStore.getUpdateSuccessUi();
  }
  getUpdateErrorUi(): Observable<string | null> {
    return this._productStore.getUpdateErrorUi();
  }
  getCreateSuccessUi(): Observable<string | null> {
    return this._productStore.getCreateSuccessUi();
  }
  getCreateErrorUi(): Observable<string | null> {
    return this._productStore.getCreateErrorUi();
  }
}
