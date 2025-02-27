import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';

import { FormProductComponent } from '../../components/organisms/form-product/form-product.component';
import { Product } from '../../interfaces';

import { Observable } from 'rxjs';
import { AlertComponent } from '../../components/molecules/alert/alert.component';
import { SpinnerOverlayComponent } from '../../components/atoms/spinner-overlay/spinner-overlay.component';

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
export class CreateProductComponent {
  private readonly _productAplicationService = inject(
    ProductApplicationService
  );
  loading$ = this._productAplicationService.getLoading();
  errorMessage$ = this._productAplicationService.getCreateErrorUi();
  successMessage$ = this._productAplicationService.getCreateSuccessUi();

  handleFormSubmit(product: Product) {
    this._productAplicationService.createProduct(product);
  }
  handleFormCancel() {
    console.log('Form clean'); // 🚀 Aquí puedes redirigir a otra página si deseas
  }
}
