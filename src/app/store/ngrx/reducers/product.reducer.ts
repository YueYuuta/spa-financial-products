import { createReducer, on } from '@ngrx/store';
import * as ProductActions from '../actions/product.action';

import { ProductState } from '../../interface/store.product.interface';

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  success: null,
  selectedProduct: null,
  addProductSuccess: null,
  updateProductSuccess: null,
  deleteProductSuccess: null,
  addProductError: null,
  updateProductError: null,
  deleteProductError: null,
  loadingSelect: false,
  selectedProductId: null,
  selectProductId: null,
};

export const productReducer = createReducer(
  initialState,
  // ✅ Comienza la verificación del ID
  on(ProductActions.selectProductById, (state) => ({
    ...state,
    loadingSelect: true, // 🔄 Activamos el estado de carga
    error: null,
  })),

  on(ProductActions.verifyProduct, (state) => ({
    ...state,
    loadingSelect: true, // 🔄 Activamos el estado de carga
    error: null,
  })),
  on(ProductActions.selectProductSuccess, (state, { product }) => ({
    ...state,
    selectedProduct: product,
    loadingSelect: false,
    error: null,
  })),

  on(ProductActions.selectProductFailure, (state, { error }) => ({
    ...state,
    selectedProduct: null,
    loadingSelect: false,
    error,
  })),

  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
    success: null, // Resetear mensajes previos
    addProductError: null,
    addProductSuccess: null,
    deleteProductError: null,
    deleteProductSuccess: null,
    updateProductError: null,
    updateProductSuccess: null,
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

  on(ProductActions.resetMessage, (state) => ({
    ...state,

    error: null,
    success: null, // Resetear mensajes previos
    addProductError: null,
    addProductSuccess: null,
    deleteProductError: null,
    deleteProductSuccess: null,
    updateProductError: null,
    updateProductSuccess: null,
  })),

  on(ProductActions.emptyProduct, (state) => ({
    ...state,
    loading: false,
    addProductError: null,
    addProductSuccess: null,
    deleteProductError: null,
    deleteProductSuccess: null,
    updateProductError: null,
    updateProductSuccess: null,
  })),

  on(ProductActions.selectProductId, (state, { id }) => ({
    ...state,
    selectProductId: id,
  })),

  // ✅ Creando productos
  on(ProductActions.addProduct, (state) => ({
    ...state,
    loading: true,
    addProductError: null,
    addProductSuccess: null,
  })),
  on(ProductActions.addProductSuccess, (state, { product }) => ({
    ...state,
    products: [...state.products, product],
    loading: false,
    addProductSuccess: 'Producto agregado correctamente',
    addProductError: null,
  })),
  on(ProductActions.addProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    addProductError: error,
    addProductSuccess: null,
  })),

  // ✅ Actualizando productos
  on(ProductActions.updateProduct, (state) => ({
    ...state,
    loading: true,
    updateProductError: null,
    updateProductSuccess: null,
  })),
  on(ProductActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map((p) => (p.id === product.id ? product : p)),
    loading: false,
    updateProductSuccess: 'Producto actualizado correctamente',
    updateProductError: null,
  })),
  on(ProductActions.updateProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    updateProductError: error,
    updateProductSuccess: null,
  })),

  // ✅ Eliminando productos
  on(ProductActions.deleteProduct, (state) => ({
    ...state,
    loading: true,
    deleteProductError: null,
    deleteProductSuccess: null,
  })),
  on(ProductActions.deleteProductSuccess, (state, { id }) => ({
    ...state,
    products: state.products.filter((p) => p.id !== id),
    loading: false,
    deleteProductSuccess: 'Producto eliminado correctamente',
    deleteProductError: null,
    selectedProductId: null,
  })),
  on(ProductActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    deleteProductError: error,
    deleteProductSuccess: null,
  })),
  // ✅ Comienza la verificación del ID antes de eliminar
  on(ProductActions.selectProductToDelete, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProductActions.selectProductToDeleteSuccess, (state, { product }) => ({
    ...state,
    selectedProductId: product,
    loading: false,
    error: null,
  })),
  on(ProductActions.selectProductToDeleteFailure, (state, { error }) => ({
    ...state,
    selectedProduct: null,
    loading: false,
    error,
  }))
);
