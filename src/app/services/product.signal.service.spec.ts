import { TestBed } from '@angular/core/testing';

import { ProductSignalStore } from '../store-signals/product-store.signal.service';
import { ProductService } from './product.service';
import { EnvironmentInjector } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Product } from '../interfaces';
import { ProductSignalService } from './product.signal.service';

describe('ProductSignalService', () => {
  let service: ProductSignalService;
  let productStore: jest.Mocked<ProductSignalStore>;
  let productService: jest.Mocked<ProductService>;

  beforeEach(() => {
    const storeMock = {
      addProductSuccess: jest.fn().mockReturnValue(null),
      addProductError: jest.fn().mockReturnValue(null),
      updateProductSuccess: jest.fn().mockReturnValue(null),
      updateProductError: jest.fn().mockReturnValue(null),
      deleteProductSuccess: jest.fn().mockReturnValue(null),
      deleteProductError: jest.fn().mockReturnValue(null),
      selectedProduct: jest.fn().mockReturnValue(null),
      setSelectedProductId: jest.fn(),
      deleteProduct: jest.fn(),
      addProduct: jest.fn(),
      updateProduct: jest.fn(),
      products: jest.fn().mockReturnValue([]),
      loadProducts: jest.fn(),
      resetMessages: jest.fn(),
      loading: jest.fn().mockReturnValue(false),
    };

    const serviceMock = {
      verifyProduct: jest.fn().mockReturnValue(of(true)),
    };

    TestBed.configureTestingModule({
      providers: [
        ProductSignalService,
        { provide: ProductSignalStore, useValue: storeMock },
        { provide: ProductService, useValue: serviceMock },
        { provide: EnvironmentInjector, useValue: {} },
      ],
    });

    service = TestBed.inject(ProductSignalService);
    productStore = TestBed.inject(
      ProductSignalStore
    ) as jest.Mocked<ProductSignalStore>;
    productService = TestBed.inject(
      ProductService
    ) as jest.Mocked<ProductService>;
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  describe('Mensajes de éxito y error', () => {
    it('debe retornar el mensaje de éxito al crear producto', (done) => {
      productStore.addProductSuccess.mockReturnValue(
        'Producto agregado con éxito'
      );
      service.getCreateSuccessUi().subscribe((message) => {
        expect(message).toBe('Producto agregado con éxito');
        done();
      });
    });

    it('debe retornar el mensaje de error al crear producto', (done) => {
      productStore.addProductError.mockReturnValue('Error al agregar producto');
      service.getCreateErrorUi().subscribe((message) => {
        expect(message).toBe('Error al agregar producto');
        done();
      });
    });

    it('debe retornar el mensaje de éxito al actualizar producto', (done) => {
      productStore.updateProductSuccess.mockReturnValue(
        'Producto actualizado con éxito'
      );
      service.getUpdateSuccessUi().subscribe((message) => {
        expect(message).toBe('Producto actualizado con éxito');
        done();
      });
    });

    it('debe retornar el mensaje de error al actualizar producto', (done) => {
      productStore.updateProductError.mockReturnValue(
        'Error al actualizar producto'
      );
      service.getUpdateErrorUi().subscribe((message) => {
        expect(message).toBe('Error al actualizar producto');
        done();
      });
    });

    it('debe retornar el mensaje de éxito al eliminar producto', (done) => {
      productStore.deleteProductSuccess.mockReturnValue(
        'Producto eliminado con éxito'
      );
      service.getDeleteSuccessUi().subscribe((message: string | null) => {
        expect(message).toBe('Producto eliminado con éxito');
        done();
      });
    });

    it('debe retornar el mensaje de error al eliminar producto', (done) => {
      productStore.deleteProductError.mockReturnValue(
        'Error al eliminar producto'
      );
      service.getDeleteErrorUi().subscribe((message: string | null) => {
        expect(message).toBe('Error al eliminar producto');
        done();
      });
    });
  });

  describe('Gestión de selección de productos', () => {
    it('debe seleccionar un producto por ID', () => {
      service.selectProductId('123');
      expect(productStore.setSelectedProductId).toHaveBeenCalledWith('123');
    });

    it('debe obtener el producto seleccionado', (done) => {
      const mockProduct: Product = {
        id: '1',
        name: 'Producto 1',
        description: 'Descripción 1',
        logo: 'logo1.png',
        date_release: '2025-02-23',
        date_revision: '2026-02-23',
      };

      productStore.selectedProduct.mockReturnValue(mockProduct);
      service.getProductIdSelect().subscribe((product: Product) => {
        expect(product).toEqual(mockProduct);
        done();
      });
    });
  });

  describe('Gestión de productos', () => {
    it('debe eliminar un producto por ID', () => {
      service.deleteProduct('456');
      expect(productStore.deleteProduct).toHaveBeenCalledWith('456');
    });

    it('debe crear un producto correctamente', () => {
      const newProduct: Product = {
        id: '789',
        name: 'Producto Test',
        description: 'Descripción Test',
        logo: 'test.png',
        date_release: '2025-05-10',
        date_revision: '2026-05-10',
      };

      service.createProduct(newProduct);
      expect(productStore.addProduct).toHaveBeenCalledWith(newProduct);
    });

    it('debe actualizar un producto correctamente', () => {
      const updatedProduct: Product = {
        id: '101',
        name: 'Producto Actualizado',
        description: 'Descripción Actualizada',
        logo: 'updated.png',
        date_release: '2025-06-01',
        date_revision: '2026-06-01',
      };

      service.updateProduct('101', updatedProduct);
      expect(productStore.updateProduct).toHaveBeenCalledWith(updatedProduct);
    });
  });

  describe('Obtención de productos y estado de carga', () => {
    it('debe obtener los productos y cargarlos si están vacíos', (done) => {
      productStore.products.mockReturnValue([]);
      service.getProducts().subscribe((products: Product[]) => {
        expect(products).toEqual([]);
        expect(productStore.loadProducts).toHaveBeenCalled();
        done();
      });
    });

    it('debe obtener los productos y resetear mensajes si no están vacíos', (done) => {
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

      productStore.products.mockReturnValue(mockProducts);
      service.getProducts().subscribe((products: Product[]) => {
        expect(products).toEqual(mockProducts);
        expect(productStore.resetMessages).toHaveBeenCalled();
        done();
      });
    });

    it('debe obtener el estado de carga', (done) => {
      productStore.loading.mockReturnValue(true);
      service.getLoading().subscribe((loading: boolean) => {
        expect(loading).toBe(true);
        done();
      });
    });
    it('debe llamar a productService.verifyProduct con el ID correcto', (done) => {
      const productId = '123';
      productService.verifyProduct.mockReturnValue(of(true));

      service.verifyProduct(productId).subscribe((result) => {
        expect(result).toBe(true);
        expect(productService.verifyProduct).toHaveBeenCalledWith(productId);
        done();
      });
    });

    it('debe manejar errores cuando verifyProduct falla', (done) => {
      const productId = '456';
      productService.verifyProduct.mockReturnValue(
        throwError(() => new Error('Error API'))
      );

      service.verifyProduct(productId).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toBe('Error API');
          expect(productService.verifyProduct).toHaveBeenCalledWith(productId);
          done();
        },
      });
    });
  });
});
