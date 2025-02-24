import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormProductComponent } from './form-product.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormValidatorService } from '../../../services/form-validator.service';
import { DateUtils } from '../../../utils/date/date.util';
import { of } from 'rxjs';
import { Product } from '../../../interfaces';

describe('FormProductComponent', () => {
  let component: FormProductComponent;
  let fixture: ComponentFixture<FormProductComponent>;
  let formValidatorMock: jest.Mocked<FormValidatorService>;

  const mockProduct: Product = {
    id: '123',
    name: 'Producto Test',
    description: 'Descripción de prueba',
    logo: 'https://example.com/logo.png',
    date_release: '2023-01-01',
    date_revision: '2024-01-01',
  };

  beforeEach(async () => {
    // ✅ Mockear métodos de DateUtils ANTES de cada test
    jest.spyOn(DateUtils, 'toDateInputFormat').mockReturnValue('2023-01-01');
    jest
      .spyOn(DateUtils, 'toUTCDateString')
      .mockReturnValue('2023-01-01T00:00:00.000Z');
    jest
      .spyOn(DateUtils, 'calculateRevisionDate')
      .mockReturnValue('2024-01-01');

    formValidatorMock = {
      validateIdExists: jest.fn().mockReturnValue(() => of(null)),
      validateReleaseDate: jest.fn().mockReturnValue(() => null),
    } as unknown as jest.Mocked<FormValidatorService>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormProductComponent],
      providers: [
        FormBuilder,
        { provide: FormValidatorService, useValue: formValidatorMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe llamar `toDateInputFormat()` en la inicialización del formulario', () => {
    expect(DateUtils.toDateInputFormat).toHaveBeenCalled();
  });

  // it('Debe emitir `formSubmit` con fechas formateadas', () => {
  //   const formSubmitSpy = jest.spyOn(component.formSubmit, 'emit');

  //   component.formProduct.patchValue(mockProduct);
  //   component.send();

  //   expect(formSubmitSpy).toHaveBeenCalledWith({
  //     ...mockProduct,
  //     date_release: '2025-01-01T00:00:00.000Z',
  //     date_revision: '2024-01-01T00:00:00.000Z',
  //   });
  // });

  it('No debe emitir `formSubmit` si el formulario no es válido', () => {
    const formSubmitSpy = jest.spyOn(component.formSubmit, 'emit');

    component.send(); // No se llena el formulario → Debe fallar

    expect(formSubmitSpy).not.toHaveBeenCalled();
  });

  it('Debe emitir `formSubmit` con datos formateados si el formulario es válido', () => {
    const formSubmitSpy = jest.spyOn(component.formSubmit, 'emit');

    component.formProduct.patchValue({
      id: '123',
      name: 'Producto Test',
      description: 'Descripción de prueba',
      logo: 'https://example.com/logo.png',
      date_release: '2023-01-01',
      date_revision: '2023-01-01',
    });

    component.send(); // ✅ Ahora el formulario es válido

    expect(formSubmitSpy).toHaveBeenCalledWith({
      id: '123',
      name: 'Producto Test',
      description: 'Descripción de prueba',
      logo: 'https://example.com/logo.png',
      date_release: '2023-01-01T00:00:00.000Z',
      date_revision: '2023-01-01T00:00:00.000Z',
    });
  });

  it('Debe resetear el formulario cuando `cancel()` es llamado', () => {
    const resetSpy = jest.spyOn(component.formProduct, 'reset');

    component.cancel();

    expect(resetSpy).toHaveBeenCalled();
  });
});
