import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateProductComponent } from './update-product.component';
import { FormProductComponent } from '../../components/organisms/form-product/form-product.component';
import { AlertComponent } from '../../components/molecules/alert/alert.component';
import { SpinnerOverlayComponent } from '../../components/atoms/spinner-overlay/spinner-overlay.component';
import { ProductApplicationService } from '../../services/product.aplication.service';

import { of } from 'rxjs';
import { Product } from '../../store/models';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

describe('UpdateProductComponent', () => {
  let component: UpdateProductComponent;
  let fixture: ComponentFixture<UpdateProductComponent>;
  let productApplicationService: ProductApplicationService;

  const mockProduct: Product = {
    id: '1',
    name: 'Producto de prueba',
    description: 'Descripción del producto',
    logo: 'https://example.com/logo.png',
    date_release: '2023-01-01',
    date_revision: '2025-01-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormProductComponent,
        AlertComponent,
        SpinnerOverlayComponent,
        UpdateProductComponent,
        HttpClientModule,
      ],
      declarations: [],
      providers: [
        {
          provide: ProductApplicationService,
          useValue: {
            getLoading: jest.fn().mockReturnValue(of(false)),
            getUpdateErrorUi: jest.fn().mockReturnValue(of(null)),
            getUpdateSuccessUi: jest
              .fn()
              .mockReturnValue(of('Actualizado con éxito')),
            getProductIdSelect: jest.fn().mockReturnValue(of(mockProduct)),
            updatProduct: jest.fn(),
          },
        },
        // MockProvider(ProductApplicationService, {
        //   getLoading: jest.fn().mockReturnValue(of(false)),
        //   getUpdateErrorUi: jest.fn().mockReturnValue(of(null)),
        //   getUpdateSuccessUi: jest
        //     .fn()
        //     .mockReturnValue(of('Actualizado con éxito')),
        //   getProductIdSelect: jest.fn().mockReturnValue(of(mockProduct)),
        //   updatProduct: jest.fn(),
        // }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateProductComponent);
    component = fixture.componentInstance;
    productApplicationService = TestBed.inject(ProductApplicationService);
    fixture.detectChanges();
  });

  it('Debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe suscribirse a loading$, error$, success$ y product$', (done) => {
    component.loading$.subscribe((loading) => {
      expect(loading).toBe(false);
    });

    component.error$.subscribe((error) => {
      expect(error).toBeNull();
    });

    component.success$.subscribe((success) => {
      expect(success).toBe('Actualizado con éxito');
    });

    component.product$.subscribe((product) => {
      expect(product).toEqual(mockProduct);
      done();
    });
  });

  it('Debe llamar a updatProduct con el producto enviado en handleFormSubmit', () => {
    const spyUpdate = jest.spyOn(productApplicationService, 'updatProduct');

    component.handleFormSubmit(mockProduct);

    expect(spyUpdate).toHaveBeenCalledWith(mockProduct.id, mockProduct);
  });

  it('Debe mostrar mensaje en consola al cancelar el formulario', () => {
    const consoleSpy = jest.spyOn(console, 'log');

    component.handleFormCancel();

    expect(consoleSpy).toHaveBeenCalledWith('Formulario cancelado');
  });
});
