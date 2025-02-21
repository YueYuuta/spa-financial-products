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
  private store = inject(Store);
  loading$: Observable<boolean> = this.store.select(
    (state) => state.products.loading
  );

  error$: Observable<string | null> = this.store.select(
    selectUpdateProductError
  );
  success$: Observable<string | null> = this.store.select(
    selectUpdateProductSuccess
  );

  product$: Observable<Product | null> = this.store.select(
    selectSelectedProduct
  );

  ngOnInit(): void {}

  handleFormSubmit(product: Product) {
    this.store.dispatch(
      ProductActions.updateProduct({ id: product.id, product })
    );
  }

  handleFormCancel() {
    console.log('Formulario cancelado'); // 🚀 Aquí puedes redirigir a otra página si deseas
  }
}
