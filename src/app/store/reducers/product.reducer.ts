import { createReducer, on } from '@ngrx/store';
import * as ProductActions from '../actions/product.action';
import { Product } from '../../interfaces';

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  success: string | null;
  selectedProduct: Product | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  success: null,
  selectedProduct: null,
};

export const productReducer = createReducer(
  initialState,
  // ✅ Comienza la verificación del ID
  on(ProductActions.selectProductById, (state) => ({
    ...state,
    loading: true, // 🔄 Activamos el estado de carga
    error: null,
  })),
  on(ProductActions.selectProductSuccess, (state, { product }) => ({
    ...state,
    selectedProduct: product,
    loading: false,
    error: null,
  })),

  // ❌ Si el ID no existe o el producto no está en el Store, limpiamos el estado
  on(ProductActions.selectProductFailure, (state, { error }) => ({
    ...state,
    selectedProduct: null,
    loading: false,
    error,
  })),

  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
    success: null, // Resetear mensajes previos
  })),
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false,
    success: 'Productos cargados correctamente', // ✅ Mensaje de éxito
    error: null,
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    success: null,
  })),

  // ✅ Creando productos
  on(ProductActions.addProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
    success: null,
  })),
  on(ProductActions.addProductSuccess, (state, { product }) => ({
    ...state,
    products: [...state.products, product],
    loading: false,
    success: 'Producto agregado correctamente',
    error: null,
  })),
  on(ProductActions.addProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    success: null,
  })),

  // ✅ Actualizando productos
  on(ProductActions.updateProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
    success: null,
  })),
  on(ProductActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map((p) => (p.id === product.id ? product : p)),
    loading: false,
    success: 'Producto actualizado correctamente',
    error: null,
  })),
  on(ProductActions.updateProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    success: null,
  })),

  // ✅ Eliminando productos
  on(ProductActions.deleteProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
    success: null,
  })),
  on(ProductActions.deleteProductSuccess, (state, { id }) => ({
    ...state,
    products: state.products.filter((p) => p.id !== id),
    loading: false,
    success: 'Producto eliminado correctamente',
    error: null,
  })),
  on(ProductActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    success: null,
  }))
);
