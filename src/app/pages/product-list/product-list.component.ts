import { Component, inject, OnInit, signal } from '@angular/core';
import { Product, TableAction, TableHeader, TableRow } from '../../interfaces';
import { DataTableComponent } from '../../components/organisms/data-table/data-table.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, filter, first, Observable, Subject, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ProductActions from '../../store/actions/product.action';
import {
  selectLoading,
  selectError,
  selectDeleteProductId,
} from '../../store/selectors/product.selector';
import { SpinnerOverlayComponent } from '../../components/atoms/spinner-overlay/spinner-overlay.component';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../components/molecules/alert/alert.component';
import { ButtonComponent } from '../../components/atoms/button/button.component';
import { Router } from '@angular/router';
import { ModalService } from '../../lib/modal/services';
import { DeleteProductComponent } from '../../components/organisms/delete-product/delete-product.component';
import { ModalData } from '../../interfaces/modal-data.interface';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [
    DataTableComponent,
    FormsModule,
    SpinnerOverlayComponent,
    CommonModule,
    AlertComponent,
    ButtonComponent,
  ],
})
export class ProductListComponent implements OnInit {
  private store = inject(
    Store<{
      products: { products: Product[]; isEmpty: boolean; error: string | null };
    }>
  );

  private _modalService = inject(ModalService);

  private router = inject(Router);
  products$ = this.store.select((state) => state.products.products);
  isEmpty$ = this.store.select((state) => state.products.isEmpty);
  selectedProduct$ = this.store.select(selectDeleteProductId);

  loading$: Observable<boolean> = this.store.select(selectLoading);
  error$: Observable<string | null> = this.store.select(selectError);
  isLoading = signal(true);
  searchTerm = '';
  searchSubject = new Subject<string>();
  filteredRows: TableRow[] = [];
  headers: TableHeader[] = [
    { id: 'logo', label: 'Logo' },
    { id: 'name', label: 'Nombre', sort: true, info: true },
    { id: 'description', label: 'Descripción' },
    { id: 'date_release', label: 'Fecha de Liberación', sort: true },
    { id: 'date_revision', label: 'Fecha de Restauración', sort: true },
  ];

  actions: TableAction[] = [
    {
      id: 'editar',
      label: 'Editar',
      action: (row) => alert(`Editando ${row.id}`),
    },
    {
      id: 'eliminar',
      label: 'Eliminar',
      action: (row) => alert(`Eliminando ${row.id}`),
    },
  ];

  rows: TableRow[] = [];

  constructor() {}

  ngOnInit() {
    this.fetchProducts();
    this.filteredRows = [...this.rows];

    // Configurar debounce para optimizar la búsqueda
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.filterRows();
    });
  }
  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.trim().toLowerCase();
    this.searchSubject.next(this.searchTerm); // Emite el valor para activar el debounce
  }

  create() {
    this.router.navigate(['/financial-products/create']);
  }

  filterRows() {
    if (!this.searchTerm) {
      this.filteredRows = [...this.rows]; // Si está vacío, mostrar todos los productos
      return;
    }

    this.filteredRows = this.rows.filter((row) =>
      row.columns.some((col) =>
        col.primaryText.toLowerCase().includes(this.searchTerm)
      )
    );
  }

  private fetchProducts(): void {
    this.products$.subscribe((products: Product[]) => {
      if (products.length === 0) {
        this.store.dispatch(ProductActions.loadProducts());
      } else {
        this.rows = products.map((product) =>
          this.mapProductToTableRow(product)
        );
        this.isLoading.set(false);
        this.filteredRows = [...this.rows];
      }
    });
  }

  private mapProductToTableRow(product: Product): TableRow {
    return {
      id: product.id,
      status: 'success',
      label: product.name,
      columns: [
        {
          headerId: 'logo',
          primaryText: '',
          avatar: product.logo
            ? {
                type: 'image',
                src: product.logo,
                size: 'sm',
              }
            : undefined,
        },
        {
          headerId: 'name',
          primaryText: product.name,
          secundaryText: undefined,
        },
        {
          headerId: 'description',
          primaryText: product.description,
          secundaryText: undefined,
        },
        {
          headerId: 'date_release',
          primaryText: product.date_release,
          secundaryText: undefined,
        },
        {
          headerId: 'date_revision',
          primaryText: product.date_revision,
          secundaryText: undefined,
        },
      ],
    };
  }

  handleAction(event: { action: string; row: TableRow }) {
    console.log(
      '🚀 ~ ProductListComponent ~ handleAction ~ row:',
      event.row.id
    );
    if (event.action === 'Editar') {
      this.store.dispatch(
        ProductActions.selectProductById({ id: event.row.id })
      );
    } else {
      // 🔹 Disparar la acción para verificar si el producto existe
      this.store.dispatch(
        ProductActions.selectProductToDelete({ id: event.row.id })
      );

      // 🔹 Escuchar el producto seleccionado en el Store y abrir el modal (solo una vez)
      this.selectedProduct$
        .pipe(
          filter((product) => !!product),
          take(1) // ✅ Asegura que la suscripción se ejecuta solo una vez
        )
        .subscribe((product) => {
          if (product) {
            const data: ModalData = {
              title: 'Eliminar Producto',
              description: '¿Estás seguro de eliminar este producto?',
              product,
            };

            const { modalRef, contentRef } = this._modalService.show(
              DeleteProductComponent,
              {
                initialState: { data },
                initialStateModal: {
                  title: 'Eliminar Producto',
                  modalClass: 'xs',
                },
                selector: 'body',
              }
            );

            contentRef.instance.formSubmit.pipe(take(1)).subscribe(() => {
              console.log('✅ Eliminando producto:', product.id);
              this.store.dispatch(
                ProductActions.deleteProduct({ id: product.id })
              );
              this._modalService.hide();
            });

            contentRef.instance.formCancel.pipe(take(1)).subscribe(() => {
              console.log('❌ Cancelado por el usuario.');
              this._modalService.hide();
            });
          }
        });
    }
    console.log(`Acción ejecutada: ${event.action}`, event.row);
  }
}
