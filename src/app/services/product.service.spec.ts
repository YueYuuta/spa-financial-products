import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Product } from '../store/models';
import { provideHttpClient } from '@angular/common/http';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = '/api/bp/products';

  const mockProduct: Product = {
    id: '1',
    name: 'Producto A',
    description: 'Desc A',
    logo: 'a_logo.png',
    date_release: '2025-02-01',
    date_revision: '2026-02-01',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(), // 🆕 Nueva forma de configurar HttpTestingController
      ],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener productos correctamente', () => {
    const mockResponse = { data: [mockProduct] };

    service.getProducts().subscribe((response) => {
      expect(response.data.length).toBe(1);
      expect(response.data).toEqual(mockResponse.data);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería crear un producto correctamente', () => {
    const mockResponse = { data: mockProduct };

    service.createProduct(mockProduct).subscribe((response) => {
      expect(response.data).toEqual(mockResponse.data);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockResponse);
  });

  it('debería actualizar un producto correctamente', () => {
    const updatedProduct: Product = {
      ...mockProduct,
      name: 'Producto A Editado',
    };
    const mockResponse = { data: updatedProduct };

    service.updateProduct('1', updatedProduct).subscribe((response) => {
      expect(response.data).toEqual(mockResponse.data);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedProduct);
    req.flush(mockResponse);
  });

  it('debería eliminar un producto correctamente', () => {
    const mockResponse = { message: 'Producto eliminado' };

    service.deleteProduct('1').subscribe((response) => {
      expect(response.message).toBe('Producto eliminado');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('debería verificar un producto correctamente', () => {
    service.verifyProduct('1').subscribe((response) => {
      expect(response).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/verification/1`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });
});
