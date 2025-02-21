import { CommonModule } from '@angular/common';
import { Component, forwardRef, Injector, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { ValidationErrorsComponent } from '../../atoms/validation-errors/validation-errors.component';
import { ControlValueAccessorDirective } from '../../../directives/control-value-accessor.directive';

type InputType = 'text' | 'number' | 'email' | 'password' | 'date';
type version = 'v1' | 'v2';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ValidationErrorsComponent, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent<T> extends ControlValueAccessorDirective<T> {
  @Input() inputId = '';
  @Input() label = 'label';
  @Input() version: version = 'v2';
  @Input() type: InputType = 'text';
  @Input() customErrorMessages: Record<string, string> = {};
  @Input() statusClass: string = 'default';
  @Input() placeholder: string = 'Enter your email';
}
