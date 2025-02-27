import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces';
import { catchError, of, throwError } from 'rxjs';
import { ProductSignalStore } from './product-store.signal.service';

jest.mock('../services/product.service'); // Mock del servicio

describe('ProductSignalStore', () => {
  let store: ProductSignalStore;
  let productService: jest.Mocked<ProductService>;

  beforeEach(() => {
    productService = {
      getProducts: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      verifyProduct: jest.fn(),
    } as unknown as jest.Mocked<ProductService>;

    store = new ProductSignalStore(productService);
  });

  it('debe inicializarse con valores por defecto', () => {
    expect(store.products()).toEqual([]);
    expect(store.selectProductId()).toBeNull();
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('debe cargar productos correctamente', async () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Producto 1',
        description: 'Descripción 1',
        logo: 'logo1.png',
        date_release: '2025-02-23',
        date_revision: '2026-02-23',
      },
    ];
    productService.getProducts.mockReturnValue(of({ data: mockProducts }));

    await store.loadProducts();

    expect(store.products()).toEqual(mockProducts);
    expect(store.success()).toBe('Productos cargados correctamente');
  });

  it('debe manejar error al cargar productos', async () => {
    productService.getProducts.mockReturnValue(throwError(() => new Error()));

    await store.loadProducts();

    expect(store.error()).toBe('Error al cargar productos');
    expect(store.products()).toEqual([]);
  });

  it('debe agregar un producto correctamente', async () => {
    const newProduct: Product = {
      id: '2',
      name: 'Producto 2',
      description: 'Descripción 2',
      logo: 'logo2.png',
      date_release: '2025-05-15',
      date_revision: '2026-05-15',
    };
    productService.createProduct.mockReturnValue(of({ data: newProduct }));

    await store.addProduct(newProduct);

    expect(store.products()).toContainEqual(newProduct);
    expect(store.addProductSuccess()).toBe('Producto agregado con éxito');
  });

  it('debe manejar error al agregar un producto', async () => {
    productService.createProduct.mockReturnValue(throwError(() => new Error()));

    await store.addProduct({
      id: '3',
      name: 'Producto 3',
      description: 'Descripción 3',
      logo: 'logo3.png',
      date_release: '2025-06-01',
      date_revision: '2026-06-01',
    });

    expect(store.addProductError()).toBe('Error al agregar el producto');
  });

  it('debe actualizar un producto correctamente', async () => {
    const existingProduct: Product = {
      id: '4',
      name: 'Producto Viejo',
      description: 'Descripción Vieja',
      logo: 'logo-viejo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01',
    };
    store.products.set([existingProduct]);

    const updatedProduct: Product = {
      ...existingProduct,
      name: 'Producto Nuevo',
      description: 'Descripción Nueva',
    };
    productService.updateProduct.mockReturnValue(of({ data: updatedProduct }));

    await store.updateProduct(updatedProduct);

    expect(store.products()).toContainEqual(updatedProduct);
    expect(store.updateProductSuccess()).toBe('Producto actualizado con éxito');
  });

  it('debe manejar error al actualizar un producto', async () => {
    productService.updateProduct.mockReturnValue(throwError(() => new Error()));

    await store.updateProduct({
      id: '5',
      name: 'Producto',
      description: 'Descripción',
      logo: 'logo.png',
      date_release: '2025-03-10',
      date_revision: '2026-03-10',
    });

    expect(store.updateProductError()).toBe('Error al actualizar el producto');
  });

  it('debe eliminar un producto correctamente', async () => {
    const existingProduct: Product = {
      id: '6',
      name: 'Producto a eliminar',
      description: 'Descripción a eliminar',
      logo: 'logo-eliminar.png',
      date_release: '2025-04-12',
      date_revision: '2026-04-12',
    };
    store.products.set([existingProduct]);

    productService.deleteProduct.mockReturnValue(of({ message: '' }));

    await store.deleteProduct('6');

    expect(store.products()).toEqual([]);
    expect(store.deleteProductSuccess()).toBe('Producto eliminado con éxito');
  });

  it('debe manejar error al eliminar un producto', async () => {
    productService.deleteProduct.mockReturnValue(throwError(() => new Error()));

    await store.deleteProduct('7');

    expect(store.deleteProductError()).toBe('Error al eliminar el producto');
  });
  it('debe actualizar selectProductId correctamente', () => {
    store.setSelectedProductId('123');
    expect(store.selectProductId()).toBe('123');
  });

  it('debe devolver el producto correcto en selectedProduct', () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Producto 1',
        description: 'Descripción 1',
        logo: 'logo1.png',
        date_release: '2025-02-23',
        date_revision: '2026-02-23',
      },
      {
        id: '2',
        name: 'Producto 2',
        description: 'Descripción 2',
        logo: 'logo2.png',
        date_release: '2025-05-15',
        date_revision: '2026-05-15',
      },
    ];

    store.products.set(mockProducts);
    store.setSelectedProductId('2');

    expect(store.selectedProduct()).toEqual(mockProducts[1]); // Producto con id '2'
  });

  it('debe devolver null si no hay producto seleccionado', () => {
    store.setSelectedProductId(null);
    expect(store.selectedProduct()).toBeNull();
  });

  it('debe devolver null si el producto seleccionado no existe', () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Producto 1',
        description: 'Descripción 1',
        logo: 'logo1.png',
        date_release: '2025-02-23',
        date_revision: '2026-02-23',
      },
    ];

    store.products.set(mockProducts);
    store.setSelectedProductId('99'); // ID inexistente

    expect(store.selectedProduct()).toBeNull();
  });
  it('debe seleccionar un producto si existe y está en la lista', async () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Producto 1',
        description: 'Descripción 1',
        logo: 'logo1.png',
        date_release: '2025-02-23',
        date_revision: '2026-02-23',
      },
    ];

    store.products.set(mockProducts);
    productService.verifyProduct.mockReturnValue(of(true));

    await store.selectProductById('1');

    expect(store.selectProductId()).toBe('1');
    expect(store.error()).toBeNull();
  });

  it('debe mostrar error si el producto no está en la lista', async () => {
    store.products.set([]);
    productService.verifyProduct.mockReturnValue(of(true));

    await store.selectProductById('1');

    expect(store.selectProductId()).toBeNull();
    expect(store.error()).toBe('El producto no está disponible en el sistema.');
  });

  it('debe mostrar error si el ID no existe en la API', async () => {
    productService.verifyProduct.mockReturnValue(of(false));

    await store.selectProductById('1');

    expect(store.selectProductId()).toBeNull();
    expect(store.error()).toBe('El ID no existe.');
  });

  it('debe manejar error si la API falla', async () => {
    productService.verifyProduct.mockReturnValue(
      throwError(() => new Error('Error API'))
    );

    await store.selectProductById('1');

    expect(store.selectProductId()).toBeNull();
    expect(store.error()).toBe('Error verificando el ID.');
  });
});
