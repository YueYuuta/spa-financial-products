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

import { map, catchError, of } from 'rxjs';
import { FormValidatorService } from '../../../services/form-validator.service';
import { DateUtils } from '../../../utils/date/date.util';
import { ERROR_MESSAGES } from './message-error';

@Component({
  selector: 'app-form-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './form-product.component.html',
  styleUrl: './form-product.component.scss',
})
export class FormProductComponent {
  @Input() product!: Product | null;
  private readonly _fb = inject(FormBuilder);
  private validators = inject(FormValidatorService);
  formProduct: FormGroup = new FormGroup({});
  @Input() title = 'Formulario de registro';
  @Output() formSubmit = new EventEmitter<Product>();
  @Output() btnReboot = new EventEmitter<void>();

  errorMessages = ERROR_MESSAGES;

  ngOnInit(): void {
    this._initForm();
  }

  private _initForm() {
    this.formProduct = this._fb.group({
      id: [
        { value: this.product?.id || '', disabled: !!this.product },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
        this.product ? [] : [this.validators.validateIdExists()],
      ],
      name: [
        this.product?.name || '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        this.product?.description || '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: [this.product?.logo || '', [Validators.required]],
      date_release: [
        DateUtils.toDateInputFormat(this.product?.date_release),
        [Validators.required, this.validators.validateReleaseDate()],
      ],
      date_revision: [
        {
          value: DateUtils.toDateInputFormat(this.product?.date_revision),
          disabled: true,
        },
        [Validators.required],
      ],
    });

    this.formProduct.get('date_release')?.valueChanges.subscribe((date) => {
      this.formProduct
        .get('date_revision')
        ?.setValue(DateUtils.calculateRevisionDate(date));
    });
  }
  send() {
    if (this.formProduct.valid) {
      const productData = this.formProduct.getRawValue();
      console.log(
        '🚀 ~ FormProductComponent ~ send ~ productData:',
        productData
      );
      const formattedProduct: Product = {
        ...productData,
        date_release: DateUtils.toUTCDateString(productData.date_release),
        date_revision: DateUtils.toUTCDateString(productData.date_revision),
      };
      console.log(
        '🚀 ~ FormProductComponent ~ send ~ formattedProduct:',
        formattedProduct
      );
      this.formSubmit.emit(formattedProduct);
    }
  }

  cancel() {
    this.formProduct.reset();
  }
}
