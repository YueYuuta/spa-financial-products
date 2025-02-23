// import { inject, Injectable } from '@angular/core';

// import { combineLatestWith, map, Observable } from 'rxjs';
// import { select, Store } from '@ngrx/store';
// import { AppState } from '../store/reducers';
// import { Product, TableRow } from '../interfaces';
// import {
//   selectAllProducts,
//   selectLoading,
// } from '../store/selectors/product.selector';
// import {
//   filterTableRows,
//   mapProductsToTableRows,
// } from '../utils/products/product.utils';

// @Injectable({ providedIn: 'root' })
// export class ProductNgrxService {
//   private store: Store<AppState> = inject(Store<AppState>);

//   getProducts(): Observable<Product[]> {
//     return this.store.pipe(select(selectAllProducts));
//   }
//   getLoading(): Observable<boolean> {
//     return this.store.pipe(select(selectLoading));
//   }

//   getProductTableRows(): Observable<TableRow[]> {
//     return this.getProducts().pipe(map(mapProductsToTableRows));
//   }

//   filterProducts(
//     rows$: Observable<TableRow[]>,
//     search$: Observable<string>
//   ): Observable<TableRow[]> {
//     return rows$.pipe(
//       combineLatestWith(search$),
//       map(([rows, searchTerm]) => filterTableRows(rows, searchTerm))
//     );
//   }
// }

import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store/reducers';
import { map, Observable, tap } from 'rxjs';
import { Product } from '../interfaces';
import {
  selectAllProducts,
  SelectDeleteProductError,
  SelectDeleteProductSuccess,
  selectDeleteProductSuccess,
  selectLoading,
  selectSelectedProduct,
} from '../store/selectors/product.selector';
import { ProductStore } from './product.store.interface';
import * as ProductActions from '../store/actions/product.action';
import { ProductService } from './product.service';

@Injectable({ providedIn: 'root' })
export class ProductNgrxService implements ProductStore {
  private _store: Store<AppState> = inject(Store<AppState>);
  private _productService = inject(ProductService);
  deleteProduct(id: string) {
    this._store.dispatch(ProductActions.deleteProduct({ id }));
  }

  verifyProduct(id: string): Observable<boolean> {
    return this._productService.verifyProduct(id);
  }

  createProduct(id: string, product: Product): Observable<Product> {
    throw new Error('Method not implemented.');
  }
  updateProduct(): Observable<Product> {
    throw new Error('Method not implemented.');
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
