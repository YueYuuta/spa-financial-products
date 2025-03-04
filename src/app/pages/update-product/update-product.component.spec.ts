import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateProductComponent } from './update-product.component';
import { ProductApplicationService } from '../../services/product.aplication.service';
import { FormProductComponent } from '../../components/organisms/form-product/form-product.component';
import { AlertComponent } from '../../components/molecules/alert/alert.component';
import { SpinnerOverlayComponent } from '../../components/atoms/spinner-overlay/spinner-overlay.component';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { Product } from '../../store/models';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('UpdateProductComponent', () => {
  let component: UpdateProductComponent;
  let fixture: ComponentFixture<UpdateProductComponent>;
  let productApplicationServiceMock: Partial<ProductApplicationService>;

  beforeEach(async () => {
    productApplicationServiceMock = {
      getLoading: jest.fn(() => signal(false)),
      getUpdateErrorUi: jest.fn(() => signal(null)),
      getUpdateSuccessUi: jest.fn(() => signal(null)),
      getProductSelected: jest.fn(() => signal<Product | null>(null)),
      updatProduct: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        UpdateProductComponent,
        FormProductComponent,
        AlertComponent,
        SpinnerOverlayComponent,
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

    fixture = TestBed.createComponent(UpdateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should get loading signal from service', () => {
    expect(component.loading$()).toBe(false);
  });

  it('should get error signal from service', () => {
    productApplicationServiceMock.getUpdateErrorUi = jest
      .fn()
      .mockReturnValue(signal('Error updating product'));

    fixture = TestBed.createComponent(UpdateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.error$()).toBe('Error updating product');
  });

  it('should get success signal from service', () => {
    productApplicationServiceMock.getUpdateSuccessUi = jest
      .fn()
      .mockReturnValue(signal('Product updated successfully'));

    fixture = TestBed.createComponent(UpdateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.success$()).toBe('Product updated successfully');
  });

  it('should get selected product from service', () => {
    const product: Product = {
      id: '1',
      name: 'Product Test',
      description: 'Description Test',
      logo: 'logo.png',
      date_release: '2025-03-01',
      date_revision: '2025-09-01',
    };

    productApplicationServiceMock.getProductSelected = jest
      .fn()
      .mockReturnValue(signal(product));

    fixture = TestBed.createComponent(UpdateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.product$()).toEqual(product);
  });

  it('should call updateProduct on form submit', () => {
    const product: Product = {
      id: '1',
      name: 'Updated Product',
      description: 'Updated Description',
      logo: 'updated-logo.png',
      date_release: '2025-03-01',
      date_revision: '2025-09-01',
    };

    component.handleFormSubmit(product);
    expect(productApplicationServiceMock.updatProduct).toHaveBeenCalledWith(
      product.id,
      product
    );
  });

  it('should handle form cancel', () => {
    console.log = jest.fn(); // Mock console.log
    component.handleFormCancel();
    expect(console.log).toHaveBeenCalledWith('Formulario cancelado');
  });
});
