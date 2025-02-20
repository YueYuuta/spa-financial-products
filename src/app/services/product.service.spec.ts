import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { provideHttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { Product } from '../interfaces';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProduct: Product = {
    id: '1',
    name: 'Credit Card',
    description: 'A financial product',
    logo: 'https://example.com/logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya peticiones pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should retrieve all products', () => {
      expect.assertions(3);

      service.getProducts().subscribe((products) => {
        expect(products.length).toBe(1);
        expect(products).toEqual([mockProduct]);
      });

      const req = httpMock.expectOne(service['apiUrl']);
      expect(req.request.method).toBe('GET');
      req.flush([mockProduct]);
    });

    it('should handle errors correctly', () => {
      service.getProducts().subscribe({
        next: () => fail('Expected an error, but got success'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(service['apiUrl']);
      req.flush({}, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getProductById', () => {
    it('should retrieve a product by ID', () => {
      service.getProductById('1').subscribe((product) => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });
  });

  describe('addProduct', () => {
    it('should add a new product', () => {
      service.addProduct(mockProduct).subscribe((product) => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(service['apiUrl']);
      expect(req.request.method).toBe('POST');
      req.flush(mockProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', () => {
      service.updateProduct('1', { name: 'Updated' }).subscribe((product) => {
        expect(product.name).toBe('Updated');
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush({ ...mockProduct, name: 'Updated' });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', () => {
      service.deleteProduct('1').subscribe((response) => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('checkProductIdExists', () => {
    it('should check if a product ID exists', () => {
      service.checkProductIdExists('1').subscribe((exists) => {
        expect(exists).toBe(true);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/verification/1`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });
  });
});
