import { createReducer, on } from '@ngrx/store';
import * as ProductActions from '../actions/product.action';
import { Product } from '../models';

export interface ProductState {
  products: Product[];
  error: string | null;
  isEmpty: boolean;
  productExists: boolean | null;
}

const initialState: ProductState = {
  products: [],
  error: null,
  productExists: null,
  isEmpty: false,
};

export const productReducer = createReducer(
  initialState,
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    error: null,
    isEmpty: products.length === 0,
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(ProductActions.addProductSuccess, (state, { product }) => ({
    ...state,
    products: [...state.products, product],
    error: null,
  })),
  on(ProductActions.addProductFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(ProductActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map((p) => (p.id === product.id ? product : p)),
    error: null,
  })),
  on(ProductActions.updateProductFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(ProductActions.deleteProductSuccess, (state, { id }) => ({
    ...state,
    products: state.products.filter((p) => p.id !== id),
    error: null,
  })),
  on(ProductActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(ProductActions.verifyProductSuccess, (state, { exists }) => ({
    ...state,
    productExists: exists,
    error: null,
  })),
  on(ProductActions.verifyProductFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
