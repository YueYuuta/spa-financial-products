import { Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { ProductService } from './product.service';
import { map, catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FormValidatorService {
  private productService = inject(ProductService);

  validateIdExists(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);
      return this.productService.verifyProduct(control.value).pipe(
        map((exists) => (exists ? { idexists: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  validateReleaseDate(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl) => {
      if (!control.value) return null;
      const selectedDate = new Date(control.value + 'T00:00:00'); // 🔹 Forzar a medianoche para evitar desfases de zona horaria
      selectedDate.setHours(0, 0, 0, 0);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      return selectedDate >= today ? null : { invaliddate: true };
    };
  }
}
