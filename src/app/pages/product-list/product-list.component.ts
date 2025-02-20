import { Component, OnInit } from '@angular/core';
import { Product, TableAction, TableHeader, TableRow } from '../../interfaces';
import { ProductService } from '../../services/product.service';
import { DataTableComponent } from '../../components/organisms/data-table/data-table.component';
import { productsMock } from '../../mock/data';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [DataTableComponent, FormsModule],
})
export class ProductListComponent implements OnInit {
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

  constructor(private productService: ProductService) {}

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
    this.productService.getProducts().subscribe((products) => {
      console.log(
        '🚀 ~ ProductListComponent ~ this.productService.getProducts ~ products:',
        products
      );
      this.rows = productsMock.map((product) =>
        this.mapProductToTableRow(product)
      );
      this.filteredRows = [...this.rows];
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
    console.log(`Acción ejecutada: ${event.action}`, event.row);
  }
}
