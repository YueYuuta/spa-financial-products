import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateProductComponent } from './create-product.component';
import { ProductApplicationService } from '../../services/product.aplication.service';

import { of } from 'rxjs';
import { Product } from '../../interfaces';
import { HttpClientModule } from '@angular/common/http';

describe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;
  let productApplicationService: ProductApplicationService;

  const mockProduct: Product = {
    id: '1',
    name: 'Producto de prueba',
    description: 'Descripción de prueba',
    logo: 'https://example.com/logo.png',
    date_release: '2023-01-01',
    date_revision: '2025-01-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProductComponent, HttpClientModule],
      providers: [
        {
          provide: ProductApplicationService,
          useValue: {
            getLoading: jest.fn().mockReturnValue(of(false)),
            getCreateErrorUi: jest.fn().mockReturnValue(of(null)),
            getCreateSuccessUi: jest
              .fn()
              .mockReturnValue(of('Creación exitosa')),
            createProduct: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
    productApplicationService = TestBed.inject(ProductApplicationService);
    fixture.detectChanges();
  });

  it('Debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe suscribirse a loading$, errorMessage$ y successMessage$', (done) => {
    component.loading$.subscribe((loading) => {
      expect(loading).toBe(false);
    });

    component.errorMessage$.subscribe((error) => {
      expect(error).toBeNull();
    });

    component.successMessage$.subscribe((success) => {
      expect(success).toBe('Creación exitosa');
      done();
    });
  });

  it('Debe llamar a createProduct con el producto enviado en handleFormSubmit', () => {
    const spyCreateProduct = jest.spyOn(
      productApplicationService,
      'createProduct'
    );

    component.handleFormSubmit(mockProduct);

    expect(spyCreateProduct).toHaveBeenCalledWith(mockProduct);
  });

  it('Debe mostrar mensaje en consola al cancelar el formulario', () => {
    const consoleSpy = jest.spyOn(console, 'log');

    component.handleFormCancel();

    expect(consoleSpy).toHaveBeenCalledWith('Form clean');
  });
});
