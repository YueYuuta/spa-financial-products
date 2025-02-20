import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataTableComponent } from './components/organisms/data-table/data-table.component';
import { TableAction, TableHeader, TableRow } from './interfaces';
import { ProductService } from './services/product.service';
import { ProductListComponent } from './pages/product-list/product-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DataTableComponent, ProductListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'spa-financial-products';

  private readonly _productService = inject(ProductService);
  headers: TableHeader[] = [
    { id: 'cola', label: 'Columna A', sort: true, width: '350px' },
    { id: 'colb', label: 'Columna B primero', info: true },
    { id: 'colc', label: 'Columna C' },
  ];

  rows: TableRow[] = [
    {
      id: '1',
      status: 'error',
      label: 'label',
      columns: [
        {
          headerId: 'colb',
          primaryText: 'Primary cell text 2',
          secundaryText: 'Secondary cell text',
        },
        {
          headerId: 'cola',
          primaryText: 'Primary cell text 4',
          secundaryText: 'Secondary cell text',
        },
        {
          headerId: 'colc',
          primaryText: 'Primary cell text 3',
          secundaryText: 'Secondary cell text',
        },
      ],
    },
    {
      id: '2',
      status: 'error',
      label: 'label',
      columns: [
        {
          headerId: 'colb',
          primaryText: 'Primary cell text 2',
          secundaryText: 'Secondary cell text',
        },
        {
          headerId: 'cola',
          primaryText: 'Primary cell text 6',
          secundaryText: 'Secondary cell text',
        },
        {
          headerId: 'colc',
          primaryText: 'Primary cell text 7',
          secundaryText: 'Secondary cell text',
        },
      ],
    },
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

  handleTableAction(event: any) {
    alert(`Action: ${event.action}, Row ID: ${event.row.id}`);
  }
}
