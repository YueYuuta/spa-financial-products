import { Injectable, inject } from '@angular/core';
import { Observable, combineLatestWith, of, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Product, TableRow } from '../interfaces';
import {
  mapProductsToTableRows,
  filterTableRows,
} from '../utils/products/product.utils';
import { PRODUCT_STORE, ProductStore } from './product.store.interface';
import { ModalService } from '../lib/modal/services';
import { ModalData } from '../interfaces/modal-data.interface';
import { DeleteProductComponent } from '../components/organisms/delete-product/delete-product.component';
import { ModalInstance } from '../lib/modal/interfaces';

@Injectable({ providedIn: 'root' })
export class ProductApplicationService {
  private readonly _productStore = inject<ProductStore>(PRODUCT_STORE);
  private readonly _modalService = inject(ModalService);

  /** 🔹 Obtiene productos y los transforma en `TableRow[]` */
  getProductTableRows(): Observable<TableRow[]> {
    return this._productStore.getProducts().pipe(map(mapProductsToTableRows));
  }

  /** 🔹 Filtra productos según búsqueda */
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

  deleteProduct(id: string) {
    this._productStore.deleteProduct(id);
  }

  getDeleteSuccessUi(): Observable<string | null> {
    return this._productStore.getDeleteSuccessUi();
  }
  getDeleteErrorUi(): Observable<string | null> {
    return this._productStore.getDeleteErrorUi();
  }
}
