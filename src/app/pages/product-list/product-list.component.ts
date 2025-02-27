import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { TableRow } from '../../interfaces';
import { DataTableComponent } from '../../components/organisms/data-table/data-table.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpinnerOverlayComponent } from '../../components/atoms/spinner-overlay/spinner-overlay.component';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../components/molecules/alert/alert.component';
import { ButtonComponent } from '../../components/atoms/button/button.component';
import { Router } from '@angular/router';

import { actionsTable, headerTable } from './header-table';
import { ProductApplicationService } from '../../services/product.aplication.service';
import { ModalService } from '../../lib/modal/services';
import { mapTableRowToProduct } from '../../utils/products/product.utils';
import { ModalData } from '../../interfaces/modal-data.interface';
import { DeleteProductComponent } from '../../components/organisms/delete-product/delete-product.component';

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
export class ProductListComponent implements OnInit {
  headers = headerTable;
  actions = actionsTable;
  private readonly _productAplicationService = inject(
    ProductApplicationService
  );
  private router = inject(Router);
  products: Signal<TableRow[]> =
    this._productAplicationService.filterProducts();
  success = this._productAplicationService.getCreateSuccessUi();
  searchControl = new FormControl<string>('', { nonNullable: true });
  private destroyRef = inject(DestroyRef);
  private _modalService = inject(ModalService);

  ngOnInit(): void {
    this._productAplicationService.loadProducts();
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
        tap((data) => this._productAplicationService.setSearch(data))
      )
      .subscribe();
  }

  create() {
    this.router.navigate(['/financial-products/create']);
  }

  handleAction(event: { action: string; row: TableRow }) {
    const product = mapTableRowToProduct(event.row);
    this._productAplicationService.setProductSelected(product);
    if (event.action === 'Editar') {
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
