import { TestBed } from '@angular/core/testing';

import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Product } from '../interfaces';
import { ProductService } from './product.service';
import * as ProductActions from '../store/actions/product.action';

import { ProductNgrxService } from './product.ngrx.service';

describe('ProductNgrxService', () => {
  let service: ProductNgrxService;
  let storeMock: jest.Mocked<Store>;
  let productServiceMock: jest.Mocked<ProductService>;

  const mockProduct: Product = {
    id: '1',
    name: 'Producto de prueba',
    description: 'Descripción de prueba',
    logo: 'https://example.com/logo.png',
    date_release: '2023-01-01',
    date_revision: '2025-01-01',
  };

  beforeEach(() => {
    storeMock = {
      dispatch: jest.fn(),
      pipe: jest.fn().mockReturnValue(of([])), // Valor por defecto para cualquier `select`
    } as unknown as jest.Mocked<Store>;

    productServiceMock = {
      verifyProduct: jest.fn().mockReturnValue(of(true)),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        ProductNgrxService,
        { provide: Store, useValue: storeMock },
        { provide: ProductService, useValue: productServiceMock },
      ],
    });

    service = TestBed.inject(ProductNgrxService);
  });

  it('Debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('Debe obtener los productos del store', (done) => {
    storeMock.pipe.mockReturnValueOnce(of([mockProduct]));

    service.getProducts().subscribe((products) => {
      expect(products).toEqual([mockProduct]);
      done();
    });
  });

  it('Debe obtener los productos del store vacio', (done) => {
    storeMock.pipe.mockReturnValueOnce(of([]));

    service.getProducts().subscribe((products) => {
      expect(products).toEqual([]);
      done();
    });
  });

  it('Debe obtener el estado de carga', (done) => {
    storeMock.pipe.mockReturnValue(of(true));
    service.getLoading().subscribe((loading: boolean) => {
      expect(loading).toBe(true);
      done();
    });
  });

  it('Debe seleccionar un producto por ID', () => {
    service.selectProductId('1');
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      ProductActions.selectProductId({ id: '1' })
    );
  });

  it('Debe obtener el producto seleccionado', (done) => {
    storeMock.pipe.mockReturnValue(of(mockProduct));

    service.getProductIdSelect().subscribe((product: Product) => {
      expect(product).toEqual(mockProduct);
      done();
    });
  });

  it('Debe verificar si un producto existe llamando a `ProductService`', (done) => {
    service.verifyProduct('1').subscribe((exists: boolean) => {
      expect(productServiceMock.verifyProduct).toHaveBeenCalledWith('1');
      expect(exists).toBe(true);
      done();
    });
  });

  it('Debe crear un producto correctamente', () => {
    service.createProduct(mockProduct);
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      ProductActions.addProduct({ product: mockProduct })
    );
  });

  it('Debe actualizar un producto correctamente', () => {
    service.updateProduct(mockProduct.id, mockProduct);
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      ProductActions.updateProduct({ id: mockProduct.id, product: mockProduct })
    );
  });

  it('Debe eliminar un producto correctamente', () => {
    service.deleteProduct(mockProduct.id);
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      ProductActions.deleteProduct({ id: mockProduct.id })
    );
  });

  it('Debe obtener los estados de éxito y error de la UI (Create, Update, Delete)', (done) => {
    service.getCreateSuccessUi().subscribe(() => {
      expect(storeMock.pipe).toHaveReturnedTimes(1);
    });

    service.getCreateErrorUi().subscribe(() => {
      expect(storeMock.pipe).toHaveReturnedTimes(2);
    });

    service.getUpdateSuccessUi().subscribe(() => {
      expect(storeMock.pipe).toHaveReturnedTimes(3);
    });

    service.getUpdateErrorUi().subscribe(() => {
      expect(storeMock.pipe).toHaveReturnedTimes(4);
    });

    service.getDeleteSuccessUi().subscribe(() => {
      expect(storeMock.pipe).toHaveReturnedTimes(5);
    });

    service.getDeleteErrorUi().subscribe(() => {
      expect(storeMock.pipe).toHaveReturnedTimes(6);
      done();
    });
  });
});
