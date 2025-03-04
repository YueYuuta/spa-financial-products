import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateProductComponent } from './create-product.component';
import { ProductApplicationService } from '../../services/product.aplication.service';
import { FormProductComponent } from '../../components/organisms/form-product/form-product.component';
import { AlertComponent } from '../../components/molecules/alert/alert.component';
import { SpinnerOverlayComponent } from '../../components/atoms/spinner-overlay/spinner-overlay.component';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { Product } from '../../interfaces';
import { HttpClientModule } from '@angular/common/http';

describe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;
  let productApplicationServiceMock: Partial<ProductApplicationService>;

  beforeEach(async () => {
    productApplicationServiceMock = {
      getLoading: jest.fn(() => signal(false)),
      getCreateErrorUi: jest.fn(() => signal('Error creating product')), // ✅ Valor correcto desde el inicio
      getCreateSuccessUi: jest.fn(() => signal('Product created successfully')), // ✅ Valor correcto desde el inicio
      createProduct: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormProductComponent,
        AlertComponent,
        SpinnerOverlayComponent,
        CreateProductComponent,
        HttpClientModule,
      ],
      declarations: [],
      providers: [
        {
          provide: ProductApplicationService,
          useValue: productApplicationServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should get loading signal from service', () => {
    expect(component.loading$()).toBe(false);
  });

  it('should get error message signal from service', () => {
    expect(component.errorMessage$()).toBe('Error creating product');
  });

  it('should get success message signal from service', () => {
    expect(component.successMessage$()).toBe('Product created successfully');
  });

  it('should call createProduct on form submit', () => {
    const product: Product = {
      id: '1',
      name: 'New Product',
      description: 'Description Test',
      logo: 'logo.png',
      date_release: '2025-03-01',
      date_revision: '2025-09-01',
    };

    component.handleFormSubmit(product);
    expect(productApplicationServiceMock.createProduct).toHaveBeenCalledWith(
      product
    );
  });

  it('should handle form cancel', () => {
    console.log = jest.fn(); // Mock console.log
    component.handleFormCancel();
    expect(console.log).toHaveBeenCalledWith('Form clean');
  });
});
