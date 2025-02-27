import { Injectable, Signal, computed, inject, signal } from '@angular/core';
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
  private search = signal('');

  getProductTableRows(): Signal<TableRow[]> {
    return computed(() =>
      mapProductsToTableRows(this._productStore.getProducts()())
    );
  }

  filterProducts(): Signal<TableRow[]> {
    return computed(() => {
      const productRows = mapProductsToTableRows(
        this._productStore.getProducts()()
      );

      // Si el searchTerm está vacío, devolvemos todos los productos
      if (!this.search().trim()) {
        return productRows; // Aquí, aseguramos que se devuelvan todos los productos cuando el término esté vacío.
      }

      // Si hay un término de búsqueda, aplicamos el filtro
      return filterTableRows(productRows, this.search());
    });
  }
  setSearch(term: string) {
    this.search.set(term);
  }

  loadProducts() {
    this._productStore.loadProducts();
  }

  getLoading(): Signal<boolean> {
    return this._productStore.getLoading();
  }

  updatProduct(id: string, product: Product) {
    this._productStore.updateProduct(id, product);
  }

  createProduct(product: Product) {
    this._productStore.createProduct(product);
  }

  getProductSelected(): Signal<Product | null> {
    return this._productStore.getProductSelected();
  }
  setProductSelected(product: Product): void {
    this._productStore.setProductSelected(product);
  }

  deleteProduct(id: string) {
    this._productStore.deleteProduct(id);
  }

  getDeleteSuccessUi(): Signal<string | null> {
    return this._productStore.getDeleteSuccessUi();
  }
  getDeleteErrorUi(): Signal<string | null> {
    return this._productStore.getDeleteErrorUi();
  }

  getUpdateSuccessUi(): Signal<string | null> {
    return this._productStore.getUpdateSuccessUi();
  }
  getUpdateErrorUi(): Signal<string | null> {
    return this._productStore.getUpdateErrorUi();
  }
  getCreateSuccessUi(): Signal<string | null> {
    return this._productStore.getCreateSuccessUi();
  }
  getCreateErrorUi(): Signal<string | null> {
    return this._productStore.getCreateErrorUi();
  }

  getSuccessUi(): Signal<string | null> {
    return this._productStore.getSuccessUi();
  }
  getErrorUi(): Signal<string | null> {
    return this._productStore.getErrorUi();
  }
}
