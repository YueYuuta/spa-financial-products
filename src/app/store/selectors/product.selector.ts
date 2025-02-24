import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ProductState } from '../reducers/product.reducer';
import { Product } from '../models';

// ✅ Seleccionar la Feature State de productos
export const selectProductState =
  createFeatureSelector<ProductState>('products');

// 🔄 Selector de carga general
export const selectLoading = createSelector(
  selectProductState,
  (state) => state.loading
);

// 🔄 Selector de carga para la selección de producto
export const selectLoadingSelect = createSelector(
  selectProductState,
  (state) => state.loadingSelect
);

// ❌ Selector de error general
export const selectError = createSelector(
  selectProductState,
  (state) => state.error
);

export const SelectDeleteProductSuccess = createSelector(
  selectProductState,
  (state) => state.deleteProductSuccess
);

export const selectProductId = createSelector(selectProductState, (state) =>
  state.products.find((product) => product.id === state.selectProductId)
);

export const SelectDeleteProductError = createSelector(
  selectProductState,
  (state) => state.deleteProductError
);

// ✅ Selector de productos
export const selectAllProducts = createSelector(
  selectProductState,
  (state) => state.products
);

// ✅ Selector para el producto seleccionado
export const selectSelectedProduct = createSelector(
  selectProductState,
  (state) => state.selectedProduct
);

// ✅ Selectores de éxito por acción
export const selectAddProductSuccess = createSelector(
  selectProductState,
  (state) => state.addProductSuccess
);
export const selectUpdateProductSuccess = createSelector(
  selectProductState,
  (state) => state.updateProductSuccess
);
export const selectDeleteProductSuccess = createSelector(
  selectProductState,
  (state) => state.deleteProductSuccess
);

export const selectDeleteProductId = createSelector(
  selectProductState,
  (state) => state.selectedProductId
);

// ❌ Selectores de error por acción
export const selectAddProductError = createSelector(
  selectProductState,
  (state) => state.addProductError
);
export const selectUpdateProductError = createSelector(
  selectProductState,
  (state) => state.updateProductError
);
export const selectDeleteProductError = createSelector(
  selectProductState,
  (state) => state.deleteProductError
);

export const selectProductById = (productId: string) =>
  createSelector(
    selectAllProducts,
    (products: Product[]) =>
      products.find((product) => product.id === productId) || null
  );
