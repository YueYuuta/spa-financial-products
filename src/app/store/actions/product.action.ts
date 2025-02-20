import { createAction, props } from '@ngrx/store';
import { Product } from '../models';

// Cargar productos
export const loadProducts = createAction('[Product] Load Products');
export const loadProductsSuccess = createAction(
  '[Product] Load Products Success',
  props<{ products: Product[] }>()
);
export const loadProductsFailure = createAction(
  '[Product] Load Products Failure',
  props<{ error: string }>()
);

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
