import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  filter,
  map,
  mergeMap,
  of,
  tap,
  pipe,
  withLatestFrom,
  take,
} from 'rxjs';
import * as ProductActions from '../actions/product.action';
import { ProductService } from '../../services/product.service';
import { select, Store } from '@ngrx/store';
import { Product } from '../models';
import { selectProductById } from '../selectors/product.selector';
import { Router } from '@angular/router';

@Injectable()
export class ProductEffects {
  private actions$ = inject(Actions);
  private store = inject(
    Store<{ products: { products: Product[]; isEmpty: boolean } }>
  );
  private productService = inject(ProductService);
  private router = inject(Router);

  selectProductById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.selectProductById),
      mergeMap(({ id }) =>
        this.productService.verifyProduct(id).pipe(
          mergeMap((exists) => {
            if (exists) {
              console.log(
                `✅ ID ${id} existe en la base de datos, buscando en el Store...`
              );

              return this.store.select(selectProductById(id)).pipe(
                take(1),
                map((product) => {
                  if (product) {
                    console.log('✅ Producto encontrado en el Store:', product);
                    return ProductActions.selectProductSuccess({ product });
                  } else {
                    console.log('❌ Producto no encontrado en el Store.');
                    return ProductActions.selectProductFailure({
                      error: 'El producto no está disponible en el sistema.',
                    });
                  }
                })
              );
            } else {
              console.log(`❌ El ID ${id} no existe en la base de datos.`);
              return of(
                ProductActions.selectProductFailure({
                  error: 'El ID no existe.',
                })
              );
            }
          }),
          catchError(() =>
            of(
              ProductActions.selectProductFailure({
                error: 'Error verificando el ID.',
              })
            )
          )
        )
      )
    )
  );

  navigateToEdit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductActions.selectProductSuccess),
        tap(({ product }) => {
          console.log('✅ Navegando a la edición de:', product.id);
          this.router.navigate(['/financial-products/update']);
        })
      ),
    { dispatch: false }
  );

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      withLatestFrom(this.store.pipe(select((state) => state.products))),
      filter(([_, state]) => !state.isEmpty),
      mergeMap(([_, state]) => {
        if (state.products.length > 0) {
          return of(
            ProductActions.loadProductsSuccess({ products: state.products })
          );
        } else {
          return this.productService.getProducts().pipe(
            map((response) => {
              if (response.data.length === 0) {
                return ProductActions.loadProductsSuccess({ products: [] });
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

  selectProductToDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.selectProductToDelete),
      mergeMap(({ id }) =>
        this.productService.verifyProduct(id).pipe(
          mergeMap((exists) => {
            if (exists) {
              console.log(
                `✅ ID ${id} existe en la base de datos, buscando en el Store...`
              );

              return this.store.select(selectProductById(id)).pipe(
                take(1),
                map((product) => {
                  console.log('🚀 ~ ProductEffects ~ map ~ product:', product);
                  if (product) {
                    console.log('✅ Producto encontrado en el Store:', product);
                    return ProductActions.selectProductToDeleteSuccess({
                      product,
                    });
                  } else {
                    console.log(id);
                    console.log('❌ Producto no encontrado en el Store.');
                    return ProductActions.selectProductToDeleteFailure({
                      error: 'El producto no está disponible en el sistema.',
                    });
                  }
                })
              );
            } else {
              console.log(`❌ El ID ${id} no existe en la base de datos.`);
              return of(
                ProductActions.selectProductToDeleteFailure({
                  error: 'El ID no existe.',
                })
              );
            }
          }),
          catchError(() =>
            of(
              ProductActions.selectProductToDeleteFailure({
                error: 'Error al verificar el producto',
              })
            )
          )
        )
      )
    )
  );
  // ✅ Efecto para eliminar el producto (solo después de confirmación)
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
