import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationErrorsComponent } from './validation-errors.component';
import { SimpleChanges } from '@angular/core';

describe('ValidationErrorsComponent', () => {
  let component: ValidationErrorsComponent;
  let fixture: ComponentFixture<ValidationErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationErrorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe actualizar `errorMessages` cuando `customErrorMessages` cambie', () => {
    component.errorMessages = { required: 'Este campo es obligatorio' };

    const changes: SimpleChanges = {
      customErrorMessages: {
        currentValue: { minlength: 'Debe tener al menos 3 caracteres' },
        previousValue: {},
        firstChange: false,
        isFirstChange: () => false,
      },
    };

    component.ngOnChanges(changes);

    expect(component.errorMessages).toEqual({
      required: 'Este campo es obligatorio',
      minlength: 'Debe tener al menos 3 caracteres',
    });
  });

  it('No debe modificar `errorMessages` si `customErrorMessages` no cambia', () => {
    component.errorMessages = { required: 'Este campo es obligatorio' };

    const changes: SimpleChanges = {}; // Simula que no hay cambios

    component.ngOnChanges(changes);

    expect(component.errorMessages).toEqual({
      required: 'Este campo es obligatorio',
    });
  });
});
