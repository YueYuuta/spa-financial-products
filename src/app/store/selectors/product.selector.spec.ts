import * as fromSelectors from './product.selector';
import { ProductState } from '../reducers/product.reducer';
import { Product } from '../models';

describe('Product Selectors', () => {
  let initialState: ProductState;

  beforeEach(() => {
    initialState = {
      selectProductId: null,
      products: [
        {
          id: '1',
          name: 'Producto A',
          description: 'Desc A',
          logo: 'a_logo.png',
          date_release: '2025-02-01',
          date_revision: '2026-02-01',
        },
        {
          id: '2',
          name: 'Producto B',
          description: 'Desc B',
          logo: 'b_logo.png',
          date_release: '2025-05-10',
          date_revision: '2026-05-10',
        },
      ],
      loading: false,
      loadingSelect: false,
      error: null,
      success: null,
      selectedProduct: null,
      addProductSuccess: null,
      updateProductSuccess: null,
      deleteProductSuccess: null,
      addProductError: null,
      updateProductError: null,
      deleteProductError: null,
      selectedProductId: null,
    };
  });

  it('debería seleccionar el estado de productos', () => {
    const result = fromSelectors.selectProductState.projector(initialState);
    expect(result).toEqual(initialState);
  });

  it('debería seleccionar el estado de carga general', () => {
    const result = fromSelectors.selectLoading.projector(initialState);
    expect(result).toBe(false);
  });

  it('debería seleccionar el estado de carga para selección de producto', () => {
    const result = fromSelectors.selectLoadingSelect.projector(initialState);
    expect(result).toBe(false);
  });

  it('debería seleccionar el error general', () => {
    const result = fromSelectors.selectError.projector(initialState);
    expect(result).toBeNull();
  });

  it('debería seleccionar todos los productos', () => {
    const result = fromSelectors.selectAllProducts.projector(initialState);
    expect(result.length).toBe(2);
    expect(result).toEqual(initialState.products);
  });

  it('debería seleccionar el producto seleccionado', () => {
    const modifiedState = {
      ...initialState,
      selectedProduct: initialState.products[0],
    };
    const result = fromSelectors.selectSelectedProduct.projector(modifiedState);
    expect(result).toEqual(initialState.products[0]);
  });

  it('debería seleccionar el éxito al agregar producto', () => {
    const modifiedState = {
      ...initialState,
      addProductSuccess: 'Producto agregado correctamente',
    };
    const result =
      fromSelectors.selectAddProductSuccess.projector(modifiedState);
    expect(result).toBe('Producto agregado correctamente');
  });

  it('debería seleccionar el éxito al actualizar producto', () => {
    const modifiedState = {
      ...initialState,
      updateProductSuccess: 'Producto actualizado correctamente',
    };
    const result =
      fromSelectors.selectUpdateProductSuccess.projector(modifiedState);
    expect(result).toBe('Producto actualizado correctamente');
  });

  it('debería seleccionar el éxito al eliminar producto', () => {
    const modifiedState = {
      ...initialState,
      deleteProductSuccess: 'Producto eliminado correctamente',
    };
    const result =
      fromSelectors.selectDeleteProductSuccess.projector(modifiedState);
    expect(result).toBe('Producto eliminado correctamente');
  });

  it('debería seleccionar el ID del producto a eliminar', () => {
    const modifiedState = {
      ...initialState,
      selectedProductId: initialState.products[1],
    };
    const result = fromSelectors.selectDeleteProductId.projector(modifiedState);
    expect(result).toEqual(initialState.products[1]);
  });

  it('debería seleccionar el error al agregar producto', () => {
    const modifiedState = {
      ...initialState,
      addProductError: 'Error al agregar',
    };
    const result = fromSelectors.selectAddProductError.projector(modifiedState);
    expect(result).toBe('Error al agregar');
  });

  it('debería seleccionar el error al actualizar producto', () => {
    const modifiedState = {
      ...initialState,
      updateProductError: 'Error al actualizar',
    };
    const result =
      fromSelectors.selectUpdateProductError.projector(modifiedState);
    expect(result).toBe('Error al actualizar');
  });

  it('debería seleccionar el error al eliminar producto', () => {
    const modifiedState = {
      ...initialState,
      deleteProductError: 'Error al eliminar',
    };
    const result =
      fromSelectors.selectDeleteProductError.projector(modifiedState);
    expect(result).toBe('Error al eliminar');
  });

  it('debería seleccionar un producto por ID', () => {
    const result = fromSelectors
      .selectProductById('2')
      .projector(initialState.products);
    expect(result).toEqual(initialState.products[1]);
  });

  it('debería devolver null si el producto por ID no existe', () => {
    const result = fromSelectors
      .selectProductById('999')
      .projector(initialState.products);
    expect(result).toBeNull();
  });
});
