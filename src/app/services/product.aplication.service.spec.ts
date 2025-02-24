import { TestBed } from '@angular/core/testing';
import { ProductApplicationService } from './product.aplication.service';
import { PRODUCT_STORE, ProductStore } from './product.store.interface';
import { of } from 'rxjs';
import { Product, TableRow } from '../interfaces';
import {
  mapProductsToTableRows,
  filterTableRows,
} from '../utils/products/product.utils';

jest.mock('../utils/products/product.utils', () => ({
  mapProductsToTableRows: jest.fn(),
  filterTableRows: jest.fn(),
}));

describe('ProductApplicationService', () => {
  let service: ProductApplicationService;
  let productStoreMock: jest.Mocked<ProductStore>;

  const mockProduct: Product = {
    id: '1',
    name: 'Producto de prueba',
    description: 'Descripción de prueba',
    logo: 'https://example.com/logo.png',
    date_release: '2023-01-01',
    date_revision: '2025-01-01',
  };

  const mockTableRow: TableRow = {
    id: '1',
    status: 'success',
    label: 'Producto de prueba',
    columns: [
      {
        headerId: 'name',
        primaryText: 'Producto de prueba',
        secundaryText: 'Descripción de prueba',
        avatar: {
          type: 'image',
          src: 'https://example.com/logo.png',
          size: 'md',
        },
      },
    ],
  };

  beforeEach(() => {
    productStoreMock = {
      getProducts: jest.fn().mockReturnValue(of([mockProduct])),
      getLoading: jest.fn().mockReturnValue(of(false)),
      verifyProduct: jest.fn().mockReturnValue(of(true)),
      updateProduct: jest.fn(),
      createProduct: jest.fn(),
      deleteProduct: jest.fn(),
      selectProductId: jest.fn(),
      getProductIdSelect: jest.fn().mockReturnValue(of(mockProduct)),
      getDeleteSuccessUi: jest.fn().mockReturnValue(of(null)),
      getDeleteErrorUi: jest.fn().mockReturnValue(of(null)),
      getUpdateSuccessUi: jest.fn().mockReturnValue(of(null)),
      getUpdateErrorUi: jest.fn().mockReturnValue(of(null)),
      getCreateSuccessUi: jest.fn().mockReturnValue(of(null)),
      getCreateErrorUi: jest.fn().mockReturnValue(of(null)),
    } as jest.Mocked<ProductStore>;

    TestBed.configureTestingModule({
      providers: [
        ProductApplicationService,
        { provide: PRODUCT_STORE, useValue: productStoreMock },
      ],
    });

    service = TestBed.inject(ProductApplicationService);
  });

  it('Debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('Debe obtener productos y mapearlos a TableRow', (done) => {
    (mapProductsToTableRows as jest.Mock).mockReturnValue([mockTableRow]);

    service.getProductTableRows().subscribe((tableRows) => {
      expect(tableRows).toEqual([mockTableRow]);
      done();
    });
  });

  it('Debe filtrar productos correctamente', (done) => {
    (mapProductsToTableRows as jest.Mock).mockReturnValue([mockTableRow]);
    (filterTableRows as jest.Mock).mockReturnValue([mockTableRow]);

    service.filterProducts(of('Producto')).subscribe((filteredRows) => {
      expect(filterTableRows).toHaveBeenCalledWith([mockTableRow], 'Producto');
      expect(filteredRows).toEqual([mockTableRow]);
      done();
    });
  });

  it('Debe obtener el estado de carga', (done) => {
    service.getLoading().subscribe((loading) => {
      expect(productStoreMock.getLoading).toHaveBeenCalled();
      expect(loading).toBe(false);
      done();
    });
  });

  it('Debe verificar si un producto existe', (done) => {
    service.verifyProduct('1').subscribe((exists) => {
      expect(productStoreMock.verifyProduct).toHaveBeenCalledWith('1');
      expect(exists).toBe(true);
      done();
    });
  });

  it('Debe llamar a updateProduct con los datos correctos', () => {
    service.updatProduct('1', mockProduct);
    expect(productStoreMock.updateProduct).toHaveBeenCalledWith(
      '1',
      mockProduct
    );
  });

  it('Debe llamar a createProduct con los datos correctos', () => {
    service.createProduct(mockProduct);
    expect(productStoreMock.createProduct).toHaveBeenCalledWith(mockProduct);
  });

  it('Debe llamar a deleteProduct con el ID correcto', () => {
    service.deleteProduct('1');
    expect(productStoreMock.deleteProduct).toHaveBeenCalledWith('1');
  });

  it('Debe seleccionar un producto por ID', () => {
    service.selectProductId('1');
    expect(productStoreMock.selectProductId).toHaveBeenCalledWith('1');
  });

  it('Debe obtener el producto seleccionado', (done) => {
    service.getProductIdSelect().subscribe((product) => {
      expect(productStoreMock.getProductIdSelect).toHaveBeenCalled();
      expect(product).toEqual(mockProduct);
      done();
    });
  });

  it('Debe obtener los estados de UI (Delete, Update, Create)', (done) => {
    service.getDeleteSuccessUi().subscribe((msg) => {
      expect(msg).toBeNull();
    });

    service.getDeleteErrorUi().subscribe((msg) => {
      expect(msg).toBeNull();
    });

    service.getUpdateSuccessUi().subscribe((msg) => {
      expect(msg).toBeNull();
    });

    service.getUpdateErrorUi().subscribe((msg) => {
      expect(msg).toBeNull();
    });

    service.getCreateSuccessUi().subscribe((msg) => {
      expect(productStoreMock.getCreateSuccessUi).toHaveBeenCalled();
      expect(msg).toBeNull();
    });

    service.getCreateErrorUi().subscribe((msg) => {
      expect(msg).toBeNull();
      done();
    });
  });
});
