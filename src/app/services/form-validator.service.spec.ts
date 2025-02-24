import { TestBed } from '@angular/core/testing';
import { FormValidatorService } from './form-validator.service';
import { ProductService } from './product.service';
import { of, throwError, Observable } from 'rxjs';
import { AbstractControl, ValidationErrors } from '@angular/forms';

describe('FormValidatorService', () => {
  let service: FormValidatorService;
  let productServiceMock: jest.Mocked<ProductService>;

  beforeEach(() => {
    productServiceMock = {
      verifyProduct: jest.fn(),
    } as unknown as jest.Mocked<ProductService>;

    TestBed.configureTestingModule({
      providers: [
        FormValidatorService,
        { provide: ProductService, useValue: productServiceMock },
      ],
    });

    service = TestBed.inject(FormValidatorService);
  });

  describe('validateIdExists', () => {
    it('Debe retornar `{ idexists: true }` si el ID ya existe', (done) => {
      productServiceMock.verifyProduct.mockReturnValue(of(true));

      const validator = service.validateIdExists();
      const control = { value: '123' } as AbstractControl;

      const validationResult = validator(
        control
      ) as Observable<ValidationErrors | null>;
      validationResult.subscribe((result) => {
        expect(result).toEqual({ idexists: true });
        done();
      });
    });

    it('Debe retornar `null` si el ID no existe', (done) => {
      productServiceMock.verifyProduct.mockReturnValue(of(false));

      const validator = service.validateIdExists();
      const control = { value: '123' } as AbstractControl;

      const validationResult = validator(
        control
      ) as Observable<ValidationErrors | null>;
      validationResult.subscribe((result) => {
        expect(result).toBeNull();
        done();
      });
    });

    it('Debe validar el control', (done) => {
      productServiceMock.verifyProduct.mockReturnValue(of(false));

      const validator = service.validateIdExists();
      const control = { value: undefined } as AbstractControl;

      const validationResult = validator(
        control
      ) as Observable<ValidationErrors | null>;
      validationResult.subscribe((result) => {
        expect(result).toBeNull();
        done();
      });
    });

    it('Debe retornar `null` si hay un error en la API', (done) => {
      productServiceMock.verifyProduct.mockReturnValue(
        throwError(() => new Error('API Error'))
      );

      const validator = service.validateIdExists();
      const control = { value: '123' } as AbstractControl;

      const validationResult = validator(
        control
      ) as Observable<ValidationErrors | null>;
      validationResult.subscribe((result) => {
        expect(result).toBeNull();
        done();
      });
    });
  });
});
