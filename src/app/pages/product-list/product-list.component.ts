import { Component, OnInit } from '@angular/core';
import { Product, TableAction, TableHeader, TableRow } from '../../interfaces';
import { ProductService } from '../../services/product.service';
import { DataTableComponent } from '../../components/organisms/data-table/data-table.component';
import { productsMock } from '../../mock/data';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [DataTableComponent],
})
export class ProductListComponent implements OnInit {
  headers: TableHeader[] = [
    { id: 'logo', label: 'Logo' },
    { id: 'name', label: 'Nombre', sort: true },
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
