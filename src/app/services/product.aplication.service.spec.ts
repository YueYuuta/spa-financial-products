import { TestBed } from '@angular/core/testing';

import { PRODUCT_STORE, ProductStore } from './product.store.interface';
import { Product } from '../interfaces';
import { Signal, signal } from '@angular/core';
import { ProductApplicationService } from './product.aplication.service';

describe('ProductApplicationService', () => {
  let service: ProductApplicationService;
  let productStoreMock: jest.Mocked<ProductStore>;

  beforeEach(() => {
    productStoreMock = {
      selectProductId: jest.fn(),
      verifyProduct: jest.fn(),
      getProducts: jest.fn((): Signal<Product[]> => signal([])),
      loadProducts: jest.fn(),
      updateProduct: jest.fn(),
      createProduct: jest.fn(),
      deleteProduct: jest.fn(),
      getLoading: jest.fn((): Signal<boolean> => signal(false)),
      getProductSelected: jest.fn((): Signal<Product | null> => signal(null)),
      setProductSelected: jest.fn(),
      getDeleteSuccessUi: jest.fn((): Signal<string | null> => signal(null)),
      getDeleteErrorUi: jest.fn((): Signal<string | null> => signal(null)),
      getUpdateSuccessUi: jest.fn((): Signal<string | null> => signal(null)),
      getUpdateErrorUi: jest.fn((): Signal<string | null> => signal(null)),
      getCreateSuccessUi: jest.fn((): Signal<string | null> => signal(null)),
      getCreateErrorUi: jest.fn((): Signal<string | null> => signal(null)),
      getSuccessUi: jest.fn((): Signal<string | null> => signal(null)),
      getErrorUi: jest.fn((): Signal<string | null> => signal(null)),
    };

    TestBed.configureTestingModule({
      providers: [
        ProductApplicationService,
        { provide: PRODUCT_STORE, useValue: productStoreMock },
      ],
    });

    service = TestBed.inject(ProductApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call loadProducts on product store', () => {
    service.loadProducts();
    expect(productStoreMock.loadProducts).toHaveBeenCalled();
  });

  it('should return loading state', () => {
    expect(service.getLoading()()).toBe(false);
  });

  it('should call updateProduct with correct arguments', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: '2025-03-03',
      date_revision: '2025-09-03',
    };
    service.updatProduct('1', product);
    expect(productStoreMock.updateProduct).toHaveBeenCalledWith('1', product);
  });

  it('should call createProduct with correct product', () => {
    const product: Product = {
      id: '2',
      name: 'New Product',
      description: 'New Description',
      logo: 'new-logo.png',
      date_release: '2025-04-01',
      date_revision: '2025-10-01',
    };
    service.createProduct(product);
    expect(productStoreMock.createProduct).toHaveBeenCalledWith(product);
  });

  it('should call deleteProduct with correct id', () => {
    service.deleteProduct('1');
    expect(productStoreMock.deleteProduct).toHaveBeenCalledWith('1');
  });

  it('should update search term', () => {
    service.setSearch('test');
    expect(service['search']()).toBe('test');
  });

  it('should return the filtered products correctly', () => {
    productStoreMock.getProducts.mockReturnValue(
      signal([
        {
          id: '1',
          name: 'Apple',
          description: 'A fresh apple',
          logo: 'apple-logo.png',
          date_release: '2025-03-01',
          date_revision: '2025-09-01',
        },
        {
          id: '2',
          name: 'Banana',
          description: 'A yellow banana',
          logo: 'banana-logo.png',
          date_release: '2025-02-15',
          date_revision: '2025-08-15',
        },
      ])
    );
  });

  it('should return selected product', () => {
    const product: Product = {
      id: '1',
      name: 'Selected Product',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: '2025-05-01',
      date_revision: '2025-11-01',
    };

    productStoreMock.getProductSelected.mockReturnValue(signal(product));

    expect(service.getProductSelected()()).toEqual(product);
  });

  it('should set selected product', () => {
    const product: Product = {
      id: '1',
      name: 'Selected Product',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: '2025-05-01',
      date_revision: '2025-11-01',
    };

    service.setProductSelected(product);
    expect(productStoreMock.setProductSelected).toHaveBeenCalledWith(product);
  });

  it('should return delete success UI state', () => {
    expect(service.getDeleteSuccessUi()()).toBeNull();
  });

  it('should return delete error UI state', () => {
    expect(service.getDeleteErrorUi()()).toBeNull();
  });

  it('should return update success UI state', () => {
    expect(service.getUpdateSuccessUi()()).toBeNull();
  });

  it('should return update error UI state', () => {
    expect(service.getUpdateErrorUi()()).toBeNull();
  });

  it('should return create success UI state', () => {
    expect(service.getCreateSuccessUi()()).toBeNull();
  });

  it('should return create error UI state', () => {
    expect(service.getCreateErrorUi()()).toBeNull();
  });

  it('should return general success UI state', () => {
    expect(service.getSuccessUi()()).toBeNull();
  });

  it('should return general error UI state', () => {
    expect(service.getErrorUi()()).toBeNull();
  });

  it('should return product table rows correctly', () => {
    productStoreMock.getProducts!.mockReturnValue(
      signal([
        {
          id: '1',
          name: 'Product A',
          description: '',
          logo: '',
          date_release: '',
          date_revision: '',
        },
        {
          id: '2',
          name: 'Product B',
          description: '',
          logo: '',
          date_release: '',
          date_revision: '',
        },
      ])
    );

    const result = service.getProductTableRows();
    expect(result().length).toBe(2);
  });

  it('should return all products when search term is empty', () => {
    productStoreMock.getProducts!.mockReturnValue(
      signal([
        {
          id: '1',
          name: 'Apple',
          description: '',
          logo: '',
          date_release: '',
          date_revision: '',
        },
        {
          id: '2',
          name: 'Banana',
          description: '',
          logo: '',
          date_release: '',
          date_revision: '',
        },
      ])
    );

    service.setSearch('');
    const filteredProducts = service.filterProducts();
    expect(filteredProducts().length).toBe(2);
  });

  it('should filter products correctly when search term is applied', () => {
    productStoreMock.getProducts!.mockReturnValue(
      signal([
        {
          id: '1',
          name: 'Apple',
          description: '',
          logo: '',
          date_release: '',
          date_revision: '',
        },
        {
          id: '2',
          name: 'Banana',
          description: '',
          logo: '',
          date_release: '',
          date_revision: '',
        },
      ])
    );

    service.setSearch('Apple');
    const filteredProducts = service.filterProducts();
    expect(filteredProducts().length).toBe(1);
    expect(filteredProducts()[0].id).toBe('1');
  });
});
