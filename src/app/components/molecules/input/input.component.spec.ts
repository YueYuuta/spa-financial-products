import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidationErrorsComponent } from '../../atoms/validation-errors/validation-errors.component';
import { By } from '@angular/platform-browser';

describe('InputComponent', () => {
  let fixture: ComponentFixture<InputComponent<any>>;
  let component: InputComponent<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CommonModule,
        ValidationErrorsComponent,
        InputComponent,
      ],
      declarations: [],
    });

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the InputComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize input control with the given value', () => {
    const formControl = new FormControl('test value');
    component.control = formControl;
    fixture.detectChanges();
    expect(component.control.value).toBe('test value');
  });

  it('should set input type to "email" when the type input is set to email', () => {
    component.type = 'email';
    fixture.detectChanges();
    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.type).toBe('email');
  });

  it('should set input placeholder', () => {
    component.placeholder = 'Enter your email';
    fixture.detectChanges();
    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.placeholder).toBe('Enter your email');
  });

  it('should call setDisabledState and disable the control', () => {
    component.setDisabledState(true);
    expect(component.control.disabled).toBe(true);
  });

  it('should call setDisabledState and enable the control', () => {
    component.setDisabledState(false);
    expect(component.control.disabled).toBe(false);
  });

  it('should call writeValue and update the control value', () => {
    const value = 'new value';
    component.writeValue(value);
    expect(component.control.value).toBe(value);
  });

  it('should update the control value when input value changes', () => {
    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = 'updated value';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.control.value).toBe('updated value');
  });

  // it('should mark the control as touched when input is blurred', () => {
  //   const markAsTouchedSpy = jest.spyOn(component, 'markControlAsTouched');
  //   const inputElement = fixture.nativeElement.querySelector('input');
  //   inputElement.dispatchEvent(new Event('blur'));
  //   fixture.detectChanges();
  //   expect(markAsTouchedSpy).toHaveBeenCalled();
  // });

  it('should call ngOnDestroy and complete destroy$', () => {
    const completeSpy = jest.spyOn(component['_destroy$'], 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});
