import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-validation-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validation-errors.component.html',
  styleUrl: './validation-errors.component.scss',
})
export class ValidationErrorsComponent implements OnChanges {
  @Input() errors: Record<string, ValidationErrors> | null = {};
  @Input() customErrorMessages: Record<string, string> = {};
  errorMessages: Record<string, string> = {};

  ngOnChanges(changes: SimpleChanges): void {
    const { customErrorMessages } = changes;
    if (customErrorMessages) {
      this.errorMessages = {
        ...this.errorMessages,
        ...customErrorMessages.currentValue,
      };
    }
  }
}
