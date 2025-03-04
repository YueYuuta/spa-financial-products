import { TestBed } from '@angular/core/testing';

import { ProductStateService } from '../store/signal/products-state.service';
import { Product } from '../interfaces';
import { signal, Signal } from '@angular/core';
import { ProductSignalService } from './product.signal.service';
import { ProductState } from '../store/interface/store.product.interface';
import { HttpClientModule } from '@angular/common/http';

describe('ProductSignalService', () => {
  let service: ProductSignalService;
  let productStateMock: Partial<ProductStateService>;

  beforeEach(() => {
    productStateMock = {
      get: <K extends keyof ProductState>(key: K): Signal<ProductState[K]> => {
        const mockData: ProductState = {
          products: [
            {
              id: '1',
              name: 'Test Product',
              description: '',
              logo: '',
              date_release: '',
              date_revision: '',
            },
          ],
          selectedProductId: null,
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
          selectProductId: null,
        };

        return signal(mockData[key]) as Signal<ProductState[K]>;
      },
      set: jest.fn(),
      loadProducts: jest.fn(),
      updateProduct: jest.fn(),
      addProduct: jest.fn(),
      deleteProduct: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        ProductSignalService,
        { provide: ProductStateService, useValue: productStateMock },
      ],
    });

    service = TestBed.inject(ProductSignalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load products', () => {
    service.loadProducts();
    expect(productStateMock.loadProducts).toHaveBeenCalled();
  });

  it('should return the list of products', () => {
    const products = service.getProducts();
    expect(products().length).toBe(1);
    expect(products()[0].id).toBe('1');
  });

  it('should return loading state', () => {
    expect(service.getLoading()()).toBe(false);
  });
  it('should return delete success UI signal', () => {
    productStateMock.get = jest
      .fn()
      .mockImplementation(() => signal<string | null>('Delete successful'));

    const result = service.getDeleteSuccessUi();
    expect(result()).toBe('Delete successful');
  });

  it('should set the selected product', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      description: 'Description',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2025-06-01',
    };

    service.setProductSelected(product);
    expect(productStateMock.set).toHaveBeenCalledWith(
      'selectedProduct',
      product
    );
  });

  it('should update a product', () => {
    const product: Product = {
      id: '1',
      name: 'Updated Product',
      description: 'Updated Description',
      logo: 'updated-logo.png',
      date_release: '2025-01-01',
      date_revision: '2025-06-01',
    };

    service.updateProduct('1', product);
    expect(productStateMock.updateProduct).toHaveBeenCalledWith('1', product);
  });

  it('should create a product', () => {
    const product: Product = {
      id: '2',
      name: 'New Product',
      description: 'New Product Description',
      logo: 'new-logo.png',
      date_release: '2025-02-01',
      date_revision: '2025-07-01',
    };

    service.createProduct(product);
    expect(productStateMock.addProduct).toHaveBeenCalledWith(product);
  });

  it('should delete a product by id', () => {
    service.deleteProduct('1');
    expect(productStateMock.deleteProduct).toHaveBeenCalledWith('1');
  });

  it('should return delete error UI signal', () => {
    productStateMock.get = jest
      .fn()
      .mockImplementation(() => signal<string | null>('Delete error occurred'));

    const result = service.getDeleteErrorUi();
    expect(result()).toBe('Delete error occurred');
  });

  it('should return update success UI signal', () => {
    productStateMock.get = jest
      .fn()
      .mockImplementation(() => signal<string | null>('Update successful'));

    const result = service.getUpdateSuccessUi();
    expect(result()).toBe('Update successful');
  });

  it('should return update error UI signal', () => {
    productStateMock.get = jest
      .fn()
      .mockImplementation(() => signal<string | null>('Update error occurred'));

    const result = service.getUpdateErrorUi();
    expect(result()).toBe('Update error occurred');
  });

  it('should return create success UI signal', () => {
    productStateMock.get = jest
      .fn()
      .mockImplementation(() =>
        signal<string | null>('Product created successfully')
      );

    const result = service.getCreateSuccessUi();
    expect(result()).toBe('Product created successfully');
  });

  it('should return create error UI signal', () => {
    productStateMock.get = jest
      .fn()
      .mockImplementation(() =>
        signal<string | null>('Error creating product')
      );

    const result = service.getCreateErrorUi();
    expect(result()).toBe('Error creating product');
  });

  it('should return general success UI signal', () => {
    productStateMock.get = jest
      .fn()
      .mockImplementation(() => signal<string | null>('Success message'));

    const result = service.getSuccessUi();
    expect(result()).toBe('Success message');
  });

  it('should return general error UI signal', () => {
    productStateMock.get = jest
      .fn()
      .mockImplementation(() => signal<string | null>('Error message'));

    const result = service.getErrorUi();
    expect(result()).toBe('Error message');
  });

  it('should return product selected signal', () => {
    productStateMock.get = jest.fn().mockImplementation(() =>
      signal<Product | null>({
        date_release: '',
        date_revision: 'D',
        description: 'des',
        id: '2',
        logo: 'logo',
        name: 'name',
      })
    );

    const result = service.getProductSelected();
    expect(result()).toEqual({
      date_release: '',
      date_revision: 'D',
      description: 'des',
      id: '2',
      logo: 'logo',
      name: 'name',
    });
  });

  // it('should select product by id', () => {
  //   service.selectProductId('123');
  //   expect(productStateMock.set).toHaveBeenCalledWith(
  //     'selectedProductId',
  //     '123'
  //   );
  // });

  // it('should verify if a product exists', () => {
  //   const exists = service.verifyProduct('1');
  //   expect(exists()).toBe(true);
  // });
});
