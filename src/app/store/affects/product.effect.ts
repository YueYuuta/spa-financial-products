import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, mergeMap, of, withLatestFrom } from 'rxjs';
import * as ProductActions from '../actions/product.action';
import { ProductService } from '../../services/product.service';
import { select, Store } from '@ngrx/store';
import { Product } from '../models';

@Injectable()
export class ProductEffects {
  private actions$ = inject(Actions); // ✅ Inyección moderna en Angular 18
  private store = inject(
    Store<{ products: { products: Product[]; isEmpty: boolean } }>
  );
  private productService = inject(ProductService); // ✅ También inyectamos el servicio

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      withLatestFrom(this.store.pipe(select((state) => state.products))), // ✅ Obtenemos todo el estado de `products`
      filter(([_, state]) => !state.isEmpty), // ✅ Si `isEmpty` es `true`, NO volvemos a llamar la API
      mergeMap(([_, state]) => {
        if (state.products.length > 0) {
          return of(
            ProductActions.loadProductsSuccess({ products: state.products })
          );
        } else {
          return this.productService.getProducts().pipe(
            map((response) => {
              if (response.data.length === 0) {
                console.warn(
                  '⚠️ La API devolvió un array vacío. Evitando bucle.'
                );
                return ProductActions.loadProductsSuccess({ products: [] }); // ✅ Evita el bucle infinito
              }
              return ProductActions.loadProductsSuccess({
                products: response.data,
              });
            }),
            catchError((error) =>
              of(ProductActions.loadProductsFailure({ error: error.message }))
            )
          );
        }
      })
    )
  );
  addProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.addProduct),
      mergeMap(({ product }) =>
        this.productService.createProduct(product).pipe(
          map((response) =>
            ProductActions.addProductSuccess({ product: response.data })
          ),
          catchError((error) =>
            of(ProductActions.addProductFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.updateProduct),
      mergeMap(({ id, product }) =>
        this.productService.updateProduct(id, product).pipe(
          map((response) =>
            ProductActions.updateProductSuccess({ product: response.data })
          ),
          catchError((error) =>
            of(ProductActions.updateProductFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      mergeMap(({ id }) =>
        this.productService.deleteProduct(id).pipe(
          map(() => ProductActions.deleteProductSuccess({ id })),
          catchError((error) =>
            of(ProductActions.deleteProductFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
