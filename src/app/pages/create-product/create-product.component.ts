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
  private store = inject(Store);
  loading$: Observable<boolean> = this.store.select(selectLoading);
  errorMessage$: Observable<string | null> = this.store.select(
    selectAddProductError
  );
  successMessage$: Observable<string | null> = this.store.select(
    selectAddProductSuccess
  );

  ngOnInit(): void {}

  handleFormSubmit(product: Product) {
    this.store.dispatch(ProductActions.addProduct({ product }));
  }

  handleFormCancel() {
    console.log('Formulario cancelado'); // 🚀 Aquí puedes redirigir a otra página si deseas
  }
}
