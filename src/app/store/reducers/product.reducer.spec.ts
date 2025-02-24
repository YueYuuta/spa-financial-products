import { productReducer, ProductState } from './product.reducer';
import * as ProductActions from '../actions/product.action';
import { Product } from '../../interfaces';

describe('Product Reducer', () => {
  let initialState: ProductState;

  beforeEach(() => {
    initialState = {
      products: [],
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
      selectProductId: null,
    };
  });

  it('debería retornar el estado inicial por defecto', () => {
    const action = { type: 'UNKNOWN_ACTION' } as any;
    const state = productReducer(undefined, action);
    expect(state).toEqual(initialState);
  });

  it('debería activar loading en loadProducts', () => {
    const action = ProductActions.loadProducts();
    const state = productReducer(initialState, action);
    expect(state.loading).toBeTruthy();
    expect(state.error).toBeNull();
  });

  it('debería agregar productos correctamente en loadProductsSuccess', () => {
    const products: Product[] = [
      {
        id: '1',
        name: 'Producto 1',
        description: 'Desc 1',
        logo: 'logo1.png',
        date_release: '2025-02-21',
        date_revision: '2026-02-21',
      },
      {
        id: '2',
        name: 'Producto 2',
        description: 'Desc 2',
        logo: 'logo2.png',
        date_release: '2025-06-15',
        date_revision: '2026-06-15',
      },
    ];
    const action = ProductActions.loadProductsSuccess({ products });
    const state = productReducer(initialState, action);

    expect(state.products.length).toBe(2);
    expect(state.products).toEqual(products);
    expect(state.loading).toBeFalsy();
    expect(state.success).toBe('Productos cargados correctamente');
  });

  it('debería manejar errores en loadProductsFailure', () => {
    const action = ProductActions.loadProductsFailure({
      error: 'Error al cargar',
    });
    const state = productReducer(initialState, action);

    expect(state.loading).toBeFalsy();
    expect(state.error).toBe('Error al cargar');
    expect(state.success).toBeNull();
  });

  it('debería manejar la selección de un producto por ID', () => {
    const action = ProductActions.selectProductById({ id: '1' });
    const state = productReducer(initialState, action);

    expect(state.loadingSelect).toBeTruthy();
    expect(state.error).toBeNull();
  });

  it('debería manejar un error en selectProductFailure', () => {
    const action = ProductActions.selectProductFailure({
      error: 'Error al seleccionar',
    });
    const state = productReducer(initialState, action);

    expect(state.loadingSelect).toBeFalsy();
    expect(state.error).toBe('Error al seleccionar');
    expect(state.selectedProduct).toBeNull();
  });

  it('debería manejar la acción selectProductToDelete', () => {
    const action = ProductActions.selectProductToDelete({ id: '1' });
    const state = productReducer(initialState, action);

    expect(state.loading).toBeTruthy();
    expect(state.error).toBeNull();
  });

  it('debería manejar la acción selectProductToDeleteSuccess', () => {
    const product: Product = {
      id: '5',
      name: 'Producto 5',
      description: 'Desc 5',
      logo: 'logo5.png',
      date_release: '2025-07-01',
      date_revision: '2026-07-01',
    };
    const action = ProductActions.selectProductToDeleteSuccess({ product });
    const state = productReducer(initialState, action);

    expect(state.selectedProductId).toEqual(product);
    expect(state.loading).toBeFalsy();
    expect(state.error).toBeNull();
  });

  it('debería manejar la acción selectProductToDeleteFailure', () => {
    const action = ProductActions.selectProductToDeleteFailure({
      error: 'Error al eliminar',
    });
    const state = productReducer(initialState, action);

    expect(state.loading).toBeFalsy();
    expect(state.error).toBe('Error al eliminar');
    expect(state.selectedProduct).toBeNull();
  });

  it('debería manejar la acción deleteProductSuccess', () => {
    const initialProducts: Product[] = [
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
    ];
    const stateWithProducts = { ...initialState, products: initialProducts };
    const action = ProductActions.deleteProductSuccess({ id: '1' });
    const state = productReducer(stateWithProducts, action);

    expect(state.products.length).toBe(1);
    expect(state.products).not.toContainEqual(initialProducts[0]);
    expect(state.loading).toBeFalsy();
    expect(state.deleteProductSuccess).toBe('Producto eliminado correctamente');
  });

  it('debería manejar la acción deleteProductFailure', () => {
    const action = ProductActions.deleteProductFailure({
      error: 'Error al eliminar',
    });
    const state = productReducer(initialState, action);

    expect(state.loading).toBeFalsy();
    expect(state.deleteProductError).toBe('Error al eliminar');
    expect(state.deleteProductSuccess).toBeNull();
  });
  it('debería manejar selectProductSuccess', () => {
    const product: Product = {
      id: '10',
      name: 'Producto X',
      description: 'Descripción X',
      logo: 'logo_x.png',
      date_release: '2025-10-10',
      date_revision: '2026-10-10',
    };

    const action = ProductActions.selectProductSuccess({ product });
    const state = productReducer(initialState, action);

    expect(state.selectedProduct).toEqual(product);
    expect(state.loadingSelect).toBeFalsy();
    expect(state.error).toBeNull();
  });
  it('debería manejar addProductSuccess', () => {
    const product: Product = {
      id: '20',
      name: 'Producto Nuevo',
      description: 'Descripción del producto nuevo',
      logo: 'logo_nuevo.png',
      date_release: '2025-05-05',
      date_revision: '2026-05-05',
    };

    const action = ProductActions.addProductSuccess({ product });
    const state = productReducer(initialState, action);

    expect(state.products.length).toBe(1);
    expect(state.products).toContainEqual(product);
    expect(state.addProductSuccess).toBe('Producto agregado correctamente');
    expect(state.addProductError).toBeNull();
    expect(state.loading).toBeFalsy();
  });
  it('debería manejar updateProductSuccess', () => {
    const initialProducts: Product[] = [
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
    ];

    const updatedProduct: Product = {
      id: '2',
      name: 'Producto B Editado',
      description: 'Desc B Modificada',
      logo: 'b_logo_editado.png',
      date_release: '2025-05-10',
      date_revision: '2026-05-10',
    };

    const stateWithProducts = { ...initialState, products: initialProducts };
    const action = ProductActions.updateProductSuccess({
      product: updatedProduct,
    });
    const state = productReducer(stateWithProducts, action);

    expect(state.products.length).toBe(2);
    expect(state.products.find((p) => p.id === '2')).toEqual(updatedProduct);
    expect(state.updateProductSuccess).toBe(
      'Producto actualizado correctamente'
    );
    expect(state.updateProductError).toBeNull();
    expect(state.loading).toBeFalsy();
  });
  it('debería manejar addProduct y activar loading', () => {
    const action = ProductActions.addProduct({
      product: {
        id: '1',
        name: 'Producto A',
        description: 'Desc A',
        logo: 'a_logo.png',
        date_release: '2025-02-01',
        date_revision: '2026-02-01',
      },
    });
    const state = productReducer(initialState, action);

    expect(state.loading).toBeTruthy(); // Verifica que loading es true
    expect(state.addProductError).toBeNull(); // Se debe resetear el error
    expect(state.addProductSuccess).toBeNull(); // Se debe resetear el éxito
  });
  it('debería manejar addProductFailure y guardar el error', () => {
    const action = ProductActions.addProductFailure({
      error: 'Error al agregar producto',
    });
    const state = productReducer(initialState, action);

    expect(state.loading).toBeFalsy(); // La carga debe finalizar
    expect(state.addProductError).toBe('Error al agregar producto'); // Se guarda el error
    expect(state.addProductSuccess).toBeNull(); // No debe haber éxito
  });
  it('debería manejar updateProduct y activar loading', () => {
    const action = ProductActions.updateProduct({
      id: '1',
      product: {
        id: '1',
        name: 'Producto A',
        description: 'Desc A',
        logo: 'a_logo.png',
        date_release: '2025-02-01',
        date_revision: '2026-02-01',
      },
    });
    const state = productReducer(initialState, action);

    expect(state.loading).toBeTruthy(); // Verifica que loading es true
    expect(state.updateProductError).toBeNull(); // Se debe resetear el error
    expect(state.updateProductSuccess).toBeNull(); // Se debe resetear el éxito
  });
  it('debería manejar updateProductFailure y guardar el error', () => {
    const action = ProductActions.updateProductFailure({
      error: 'Error al actualizar producto',
    });
    const state = productReducer(initialState, action);

    expect(state.loading).toBeFalsy(); // La carga debe finalizar
    expect(state.updateProductError).toBe('Error al actualizar producto'); // Se guarda el error
    expect(state.updateProductSuccess).toBeNull(); // No debe haber éxito
  });
  it('debería manejar deleteProduct y activar loading', () => {
    const action = ProductActions.deleteProduct({ id: '1' });
    const state = productReducer(initialState, action);

    expect(state.loading).toBeTruthy(); // Verifica que loading es true
    expect(state.deleteProductError).toBeNull(); // Se debe resetear el error
    expect(state.deleteProductSuccess).toBeNull(); // Se debe resetear el éxito
  });
});
