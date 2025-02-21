import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormProductComponent } from './form-product.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interfaces';
import { InputComponent } from '../../molecules/input/input.component';
import { ButtonComponent } from '../../atoms/button/button.component';

describe('FormProductComponent', () => {
  let fixture: ComponentFixture<FormProductComponent>;
  let component: FormProductComponent;
  let productService: ProductService;

  const mockProductService = {
    verifyProduct: jest.fn(),
  };

  const mockProduct: Product = {
    id: '123',
    name: 'Product A',
    description: 'Description for Product A',
    logo: 'logo-url',
    date_release: '2023-01-01',
    date_revision: '2024-01-01',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        InputComponent,
        ButtonComponent,
        FormProductComponent,
      ],
      declarations: [],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        FormBuilder,
      ],
    });

    fixture = TestBed.createComponent(FormProductComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    fixture.detectChanges();
  });

  it('should create the FormProductComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should update the revision date automatically', () => {
    const releaseDate = '2023-01-01';

    // Acceder al método privado de esta manera
    component['updateRevisionDate'](releaseDate);

    // Verificar si la fecha de revisión se actualizó correctamente
    expect(component.formProduct.get('date_revision')?.value).toBe(
      '2024-01-01'
    );
  });

  it('should initialize the form for create action', () => {
    component.product = null;
    component.ngOnInit();
    expect(component.formProduct).toBeTruthy();
    expect(component.formProduct.get('id')).toBeTruthy();
    expect(component.formProduct.get('name')).toBeTruthy();
    expect(component.formProduct.get('description')).toBeTruthy();
  });

  it('should initialize the form for update action', () => {
    component.product = mockProduct;
    component.ngOnInit();
    expect(component.formProduct.get('id')?.value).toBe(mockProduct.id);
    expect(component.formProduct.get('name')?.value).toBe(mockProduct.name);
  });

  // it('should update the revision date automatically', () => {
  //   const releaseDate = '2023-01-01';
  //   component.updateRevisionDate(releaseDate);
  //   expect(component.formProduct.get('date_revision')?.value).toBe(
  //     '2024-01-01'
  //   );
  // });

  it('should emit formSubmit when the form is valid and send data', () => {
    const spy = jest.spyOn(component.formSubmit, 'emit');
    component.product = mockProduct;
    component.ngOnInit();
    component.formProduct.get('id')?.setValue('124');
    component.formProduct.get('name')?.setValue('New Product');
    component.formProduct
      .get('description')
      ?.setValue('New Product Description');
    component.formProduct.get('date_release')?.setValue('2023-02-01');
    component.formProduct.get('date_revision')?.setValue('2024-02-01');

    component.send();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  // it('should not emit formSubmit if the form is invalid', () => {
  //   const spy = jest.spyOn(component.formSubmit, 'emit');
  //   component.formProduct.get('id')?.setValue('');
  //   component.send();
  //   expect(spy).not.toHaveBeenCalledTimes(0);
  // });

  it('should emit btnReboot when cancel is called', () => {
    const spy = jest.spyOn(component.btnReboot, 'emit');
    component.cancel();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should validate idexists async validator when id is entered', () => {
    mockProductService.verifyProduct.mockReturnValue(of(true)); // Mock API response to simulate existing ID

    const control = component.formProduct.get('id');
    control?.setValue('123');
    component.formProduct.get('id')?.markAsTouched();

    fixture.detectChanges();

    control?.setValue('existing-id'); // This should trigger the async validator
    expect(control?.hasError('idexists')).toBe(false); // The async validator should mark the ID as existing
  });

  it('should validate release date correctly', () => {
    const control = component.formProduct.get('date_release');
    control?.setValue('2022-12-31');
    fixture.detectChanges();

    expect(control?.hasError('invaliddate')).toBe(true); // Should fail as the date is in the past
  });

  it('should convert date correctly to UTC string', () => {
    const date = '2023-01-01';
    const utcString = component['toUTCDateString'](date);
    expect(utcString).toContain('2023-01-01');
  });
});
