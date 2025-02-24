import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Product, TableRow } from '../../interfaces';
import { DataTableComponent } from '../../components/organisms/data-table/data-table.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  startWith,
  Subject,
  take,
} from 'rxjs';

import { SpinnerOverlayComponent } from '../../components/atoms/spinner-overlay/spinner-overlay.component';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../components/molecules/alert/alert.component';
import { ButtonComponent } from '../../components/atoms/button/button.component';
import { Router } from '@angular/router';
import { ModalService } from '../../lib/modal/services';
import { actionsTable, headerTable } from './header-table';
import { ProductApplicationService } from '../../services/product.aplication.service';
import { mapTableRowToProduct } from '../../utils/products/product.utils';
import { DeleteProductComponent } from '../../components/organisms/delete-product/delete-product.component';
import { ModalData } from '../../interfaces/modal-data.interface';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,

  imports: [
    DataTableComponent,
    FormsModule,
    SpinnerOverlayComponent,
    CommonModule,
    AlertComponent,
    ButtonComponent,
    ReactiveFormsModule,
  ],
})
export class ProductListComponent {
  private _modalService = inject(ModalService);

  private router = inject(Router);

  private readonly _productAplicationService = inject(
    ProductApplicationService
  );
  searchControl = new FormControl<string>('', { nonNullable: true });
  loading$ = this._productAplicationService.getLoading();
  errorDeleteProduct$ = this._productAplicationService.getDeleteErrorUi();
  successDeleteProduct$ = this._productAplicationService.getDeleteSuccessUi();

  filteredRows$ = this._productAplicationService.filterProducts(
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged()
    )
  );

  headers = headerTable;
  actions = actionsTable;

  create() {
    this.router.navigate(['/financial-products/create']);
  }

  handleAction(event: { action: string; row: TableRow }) {
    const product = mapTableRowToProduct(event.row);

    if (event.action === 'Editar') {
      this._productAplicationService.selectProductId(event.row.id);
      this.router.navigate(['/financial-products/update']);
    } else {
      const data: ModalData = {
        title: 'Eliminar Producto',
        product,
      };
      const { modalRef, contentRef } = this._modalService.show(
        DeleteProductComponent,
        {
          initialState: { data },
          initialStateModal: {
            title: '',
            modalClass: 'xs',
          },
          selector: 'body',
        }
      );
      contentRef.instance.formSubmit.pipe(take(1)).subscribe(() => {
        this._productAplicationService.deleteProduct(product.id);
        this._modalService.hide();
      });
      contentRef.instance.formCancel.pipe(take(1)).subscribe(() => {
        this._modalService.hide();
      });
    }
  }
}
