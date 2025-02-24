import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormProductComponent } from '../../components/organisms/form-product/form-product.component';
import { AlertComponent } from '../../components/molecules/alert/alert.component';
import { SpinnerOverlayComponent } from '../../components/atoms/spinner-overlay/spinner-overlay.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../../store/models';

import {
  selectUpdateProductError,
  selectUpdateProductSuccess,
  selectLoading,
  selectSelectedProduct,
} from '../../store/selectors/product.selector';

import * as ProductActions from '../../store/actions/product.action';
import { ProductApplicationService } from '../../services/product.aplication.service';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [
    CommonModule,
    FormProductComponent,
    AlertComponent,
    SpinnerOverlayComponent,
  ],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss',
})
export class UpdateProductComponent {
  private readonly _productAplicationService = inject(
    ProductApplicationService
  );
  loading$: Observable<boolean> = this._productAplicationService.getLoading();
  error$: Observable<string | null> =
    this._productAplicationService.getUpdateErrorUi();
  success$: Observable<string | null> =
    this._productAplicationService.getUpdateSuccessUi();

  product$: Observable<Product> =
    this._productAplicationService.getProductIdSelect();

  ngOnInit(): void {}

  handleFormSubmit(product: Product) {
    this._productAplicationService.updatProduct(product.id, product);
  }

  handleFormCancel() {
    console.log('Formulario cancelado'); // 🚀 Aquí puedes redirigir a otra página si deseas
  }
}
