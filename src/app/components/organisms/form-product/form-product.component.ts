import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../molecules/input/input.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { Product } from '../../../interfaces';
import { ProductService } from '../../../services/product.service';
import { map, catchError, of } from 'rxjs';

@Component({
  selector: 'app-form-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './form-product.component.html',
  styleUrl: './form-product.component.scss',
})
export class FormProductComponent {
  @Input() product!: Product;
  private readonly _fb = inject(FormBuilder);
  private productService = inject(ProductService); // ✅ Servicio para validar ID existente
  formProduct: FormGroup = new FormGroup({});
  @Input() title = 'Formulario de registro';
  @Output() formSubmit = new EventEmitter<Product>();
  @Output() btnReboot = new EventEmitter<void>();

  errorMessages = {
    id: {
      required: 'El ID es obligatorio',
      minlength: 'El ID debe tener al menos 3 caracteres',
      maxlength: 'El ID no puede exceder los 10 caracteres',
      idexists: 'El ID ya existe en el sistema',
    },
    name: {
      required: 'El nombre es obligatorio',
      minlength: 'El nombre debe tener al menos 5 caracteres',
      maxlength: 'El nombre no puede exceder los 100 caracteres',
    },
    description: {
      required: 'La descripción es obligatoria',
      minlength: 'La descripción debe tener al menos 10 caracteres',
      maxlength: 'La descripción no puede exceder los 200 caracteres',
    },
    logo: {
      required: 'El logo es obligatorio',
    },
    date_release: {
      required: 'La fecha de liberación es obligatoria',
      invaliddate: 'La fecha debe ser igual o mayor a la fecha actual',
    },
    date_revision: {
      required: 'La fecha de revisión es obligatoria',
      revisiondate:
        'La fecha de revisión debe ser exactamente 1 año después de la liberación',
    },
  };

  ngOnInit(): void {
    this._initForm();
  }

  private _initForm() {
    if (!this.product) {
      this.initFormCreate();
    } else {
      this.initFormUpdate();
    }
    this.formProduct.get('date_release')?.valueChanges.subscribe((date) => {
      this.updateRevisionDate(date);
    });
  }

  private initFormCreate() {
    this.formProduct = this._fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
        [this.validateIdExists()], // ✅ Validación asincrónica
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required, this.validateReleaseDate()]],
      date_revision: [
        { value: '', disabled: true }, // Se calcula automáticamente
        [Validators.required],
      ],
    });

    this.formProduct.get('date_release')?.valueChanges.subscribe((date) => {
      this.updateRevisionDate(date);
    });
  }

  private initFormUpdate() {
    this.formProduct = this._fb.group({
      id: [
        { value: this.product.id, disabled: true },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        this.product.name,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        this.product.description,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: [this.product.logo, [Validators.required]],
      date_release: [
        this.product.date_release,
        [Validators.required, this.validateReleaseDate()],
      ],
      date_revision: [
        { value: this.product.date_revision, disabled: true },
        [Validators.required],
      ],
    });

    this.formProduct.get('date_release')?.valueChanges.subscribe((date) => {
      this.updateRevisionDate(date);
    });
  }

  send() {
    if (this.formProduct.valid) {
      const productData = this.formProduct.getRawValue();
      const formattedProduct: Product = {
        ...productData,
        date_release: new Date(productData.date_release).toISOString(),
        date_revision: new Date(productData.date_revision).toISOString(),
      };

      this.formSubmit.emit(formattedProduct);
    }
  }

  cancel() {
    this.formProduct.reset();
  }

  private validateReleaseDate(): (
    control: AbstractControl
  ) => ValidationErrors | null {
    return (control: AbstractControl) => {
      if (!control.value) return null;

      // ✅ Convertir la fecha seleccionada al formato correcto sin la hora
      const selectedDate = new Date(control.value + 'T00:00:00'); // 🔹 Forzar a medianoche para evitar desfases de zona horaria
      selectedDate.setHours(0, 0, 0, 0);

      // ✅ Obtener la fecha actual sin la hora
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      console.log('🚀 ~ FormProductComponent ~ Comparando: ', {
        selectedDate,
        today,
      });

      return selectedDate >= today ? null : { invaliddate: true };
    };
  }

  // ✅ Método para actualizar automáticamente la fecha de revisión
  private updateRevisionDate(releaseDate: string) {
    if (!releaseDate) return;

    const release = new Date(releaseDate);
    release.setFullYear(release.getFullYear() + 1); // ✅ Sumar un año a la fecha de liberación

    this.formProduct
      .get('date_revision')
      ?.setValue(release.toISOString().split('T')[0]);
  }

  // ✅ Validación Asincrónica: Verificar si el ID ya existe en la API
  private validateIdExists(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);

      return this.productService.verifyProduct(control.value).pipe(
        map((exists) => (exists ? { idexists: true } : null)), // ✅ Si existe, retorna error
        catchError(() => of(null)) // En caso de error en la API, no bloquea el formulario
      );
    };
  }
}
