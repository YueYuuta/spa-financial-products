import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';

import { FormProductComponent } from '../../components/organisms/form-product/form-product.component';
import { Product } from '../../interfaces';
import { Store } from '@ngrx/store';
import * as ProductActions from '../../store/actions/product.action';
import { Observable } from 'rxjs';
import { AlertComponent } from '../../components/molecules/alert/alert.component';
import { SpinnerOverlayComponent } from '../../components/atoms/spinner-overlay/spinner-overlay.component';

import {
  selectAddProductSuccess,
  selectAddProductError,
  selectLoading,
} from '../../store/selectors/product.selector';
import { ProductApplicationService } from '../../services/product.aplication.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    CommonModule,
    FormProductComponent,
    AlertComponent,
    SpinnerOverlayComponent,
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
})
export class CreateProductComponent implements OnInit {
  private readonly _productAplicationService = inject(
    ProductApplicationService
  );
  loading$: Observable<boolean> = this._productAplicationService.getLoading();
  errorMessage$: Observable<string | null> =
    this._productAplicationService.getCreateErrorUi();
  successMessage$: Observable<string | null> =
    this._productAplicationService.getCreateSuccessUi();

  ngOnInit(): void {}

  handleFormSubmit(product: Product) {
    this._productAplicationService.createProduct(product);
  }

  handleFormCancel() {
    console.log('Form clean'); // 🚀 Aquí puedes redirigir a otra página si deseas
  }
}
