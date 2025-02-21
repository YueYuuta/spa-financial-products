import { Directive, inject, Injector, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  FormControlName,
  FormGroupDirective,
  FormControlDirective,
} from '@angular/forms';
import { Subject } from 'rxjs';

@Directive({
  selector: '[appControlValueAccessor]',
  standalone: true,
})
export class ControlValueAccessorDirective<T>
  implements ControlValueAccessor, OnInit, OnDestroy
{
  control: FormControl = new FormControl<T>(null as T);
  private _destroy$ = new Subject<void>();

  private _onChange: (val: T | null) => void = () => {};
  private _onTouched!: () => void;
  private injector = inject(Injector);

  ngOnInit() {
    this.setFormControl();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  setFormControl() {
    const formControl = this.injector.get(NgControl, null);

    if (formControl instanceof FormControlName) {
      this.control = this.injector
        .get(FormGroupDirective)
        .getControl(formControl);
    } else if (formControl instanceof FormControlDirective) {
      this.control = (formControl as FormControlDirective).form;
    } else {
      this.control = new FormControl();
    }
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.control.disabled !== isDisabled) {
      isDisabled ? this.control.disable() : this.control.enable();
    }
  }

  writeValue(value: T | null): void {
    if (this.control.value !== value) {
      this.control.setValue(value, { emitEvent: true });
    }
  }

  registerOnChange(fn: (val: T | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  protected markControlAsTouched(): void {
    if (this._onTouched) {
      this._onTouched();
    }
    this.control.markAsTouched();
  }
}
