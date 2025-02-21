import { Component, inject, OnInit, signal } from '@angular/core';
import { Product, TableAction, TableHeader, TableRow } from '../../interfaces';
import { DataTableComponent } from '../../components/organisms/data-table/data-table.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ProductActions from '../../store/actions/product.action';
import {
  selectAllProducts,
  selectLoading,
  selectError,
} from '../../store/selectors/product.selector';
import { SpinnerOverlayComponent } from '../../components/atoms/spinner-overlay/spinner-overlay.component';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../components/molecules/alert/alert.component';

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
  ],
})
export class ProductListComponent implements OnInit {
  private store = inject(
    Store<{
      products: { products: Product[]; isEmpty: boolean; error: string | null };
    }>
  );
  products$ = this.store.select((state) => state.products.products);
  isEmpty$ = this.store.select((state) => state.products.isEmpty);

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

  /** 🔄 Mapea un producto a una fila de la tabla */
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
    if (event.action === 'Editar') {
      this.store.dispatch(
        ProductActions.selectProductById({ id: event.row.id })
      );
    }
    console.log(`Acción ejecutada: ${event.action}`, event.row);
  }
}
