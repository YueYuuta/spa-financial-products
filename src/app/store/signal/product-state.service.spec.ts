import { fakeAsync, flush, TestBed } from '@angular/core/testing';

import { ProductService } from '../../services/product.service';
import { OsoStateJC } from 'oso-state-jc';
import { Product } from '../models/product.model';
import { Signal, signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ProductStateService } from './products-state.service';

describe('ProductStateService', () => {
  let service: ProductStateService;
  let productServiceMock: Partial<ProductService>;

  beforeEach(() => {
    productServiceMock = {
      createProduct: jest.fn((product: Product) => of({ data: product })), // ✅ Mock corregido
      deleteProduct: jest.fn((id: string) =>
        of({ message: 'Product deleted successfully' })
      ), // ✅ Mock corregido
      updateProduct: jest.fn((id: string, product: Product) =>
        of({ data: product })
      ),
      getProducts: jest.fn(() => of([])),
      verifyProduct: jest.fn((id: string) => of(true)),
    };

    TestBed.configureTestingModule({
      providers: [
        ProductStateService,
        { provide: ProductService, useValue: productServiceMock },
      ],
    });

    service = TestBed.inject(ProductStateService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should get a value from state', () => {
    const result = service.get('loading');
    expect(result()).toBe(false);
  });

  it('should set a value in the state', () => {
    service.set('loading', true);
    expect(service.get('loading')()).toBe(true);
  });

  it('should add a product successfully', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    };

    service.addProduct(product);

    expect(productServiceMock.createProduct).toHaveBeenCalledWith(product);
  });

  it('should handle product creation error', () => {
    jest
      .spyOn(productServiceMock, 'createProduct')
      .mockReturnValue(throwError(() => new Error('Error creating product')));

    service.addProduct({
      id: '1',
      name: 'Test Product',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    });

    expect(service.get('addProductError')()).toBe('Error creating product');
  });

  it('should delete a product successfully', () => {
    service.deleteProduct('1');
    expect(productServiceMock.deleteProduct).toHaveBeenCalledWith('1');
  });

  it('should handle delete product error', () => {
    jest
      .spyOn(productServiceMock, 'deleteProduct')
      .mockReturnValue(throwError(() => new Error('Error deleting product')));

    service.deleteProduct('1');

    expect(service.get('deleteProductError')()).toBe('Error deleting product');
  });

  it('should update a product successfully', () => {
    const product: Product = {
      id: '1',
      name: 'Updated Product',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    };

    service.updateProduct('1', product);

    expect(productServiceMock.updateProduct).toHaveBeenCalledWith('1', product);
  });

  it('should load products from service', () => {
    jest.spyOn(productServiceMock, 'getProducts').mockReturnValue(
      of([
        {
          id: '1',
          name: 'Product',
          description: '',
          logo: '',
          date_release: '',
          date_revision: '',
        },
      ])
    );

    service.loadProducts();

    expect(productServiceMock.getProducts).toHaveBeenCalled();
    expect(service.get('products')().length).toBe(1);
  });

  it('should reset success and error messages', () => {
    service.set('success', 'Some success message');
    service.set('error', 'Some error message');

    service.resetMessage();

    expect(service.get('success')()).toBe(null);
    expect(service.get('error')()).toBe(null);
  });
});
