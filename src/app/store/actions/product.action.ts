import { createAction, props } from '@ngrx/store';
import { Product } from '../models';

// Cargar productos
export const loadProducts = createAction('[Product] Load Products');
export const loadProductsSuccess = createAction(
  '[Product] Load Products Success',
  props<{ products: Product[] }>()
);

export const loadProductsIsEmpty = createAction(
  '[Product] Load Products Success',
  props<{ isEmpty: boolean }>()
);

export const resetMessage = createAction('[Product] resetMessage');

export const loadProductsFailure = createAction(
  '[Product] Load Products Failure',
  props<{ error: string }>()
);

export const selectProductId = createAction(
  '[Product] Select Product Id',
  props<{ id: string }>()
);

export const emptyProduct = createAction('[Product] Load Products Is Empty');

// Crear producto
export const addProduct = createAction(
  '[Product] Add Product',
  props<{ product: Product }>()
);
export const addProductSuccess = createAction(
  '[Product] Add Product Success',
  props<{ product: Product }>()
);
export const addProductFailure = createAction(
  '[Product] Add Product Failure',
  props<{ error: string }>()
);

// Actualizar producto
export const updateProduct = createAction(
  '[Product] Update Product',
  props<{ id: string; product: Product }>()
);
export const updateProductSuccess = createAction(
  '[Product] Update Product Success',
  props<{ product: Product }>()
);
export const updateProductFailure = createAction(
  '[Product] Update Product Failure',
  props<{ error: string }>()
);

// Eliminar producto
export const deleteProduct = createAction(
  '[Product] Delete Product',
  props<{ id: string }>()
);
export const deleteProductSuccess = createAction(
  '[Product] Delete Product Success',
  props<{ id: string }>()
);
export const deleteProductFailure = createAction(
  '[Product] Delete Product Failure',
  props<{ error: string }>()
);

// Verificar existencia
export const verifyProduct = createAction(
  '[Product] Verify Product',
  props<{ id: string }>()
);
export const verifyProductSuccess = createAction(
  '[Product] Verify Product Success',
  props<{ exists: boolean }>()
);
export const verifyProductFailure = createAction(
  '[Product] Verify Product Failure',
  props<{ error: string }>()
);

export const selectProductById = createAction(
  '[Product] Select Product By ID',
  props<{ id: string }>()
);

// ✅ Acción cuando el producto se encuentra en el Store
export const selectProductSuccess = createAction(
  '[Product] Select Product Success',
  props<{ product: Product }>()
);

// ❌ Acción cuando el ID no existe o el producto no está en el Store
export const selectProductFailure = createAction(
  '[Product] Select Product Failure',
  props<{ error: string }>()
);

// ✅ Acción para verificar si el producto existe antes de eliminar
export const selectProductToDelete = createAction(
  '[Product] Select Product To Delete',
  props<{ id: string }>()
);

// ✅ Si la verificación es exitosa, actualizamos el store con el producto seleccionado
export const selectProductToDeleteSuccess = createAction(
  '[Product] Select Product To Delete Success',
  props<{ product: Product }>()
);

// ❌ Si el ID no existe, mostramos error
export const selectProductToDeleteFailure = createAction(
  '[Product] Select Product To Delete Failure',
  props<{ error: string }>()
);
