import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  TableHeader,
  TableRow,
  TableAction,
  TableColumn,
} from '../../../interfaces';
import { TablePaginationComponent } from '../../molecules/table-pagination/table-pagination.component';

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  imports: [CommonModule, TablePaginationComponent],
})
export class DataTableComponent implements OnInit {
  @Input() headers: TableHeader[] = [];
  @Input() rows: TableRow[] = [];
  @Input() actions?: TableAction[];
  @Input() showPagination = true;

  @Output() clickAction = new EventEmitter<{ action: string; row: TableRow }>();

  openMenuId: string | null = null;
  toggleMenu(rowId: string): void {
    this.openMenuId = this.openMenuId === rowId ? null : rowId;
  }

  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  processedRows: Array<
    TableRow & { columnMap: Record<string, TableColumn | null> }
  > = [];
  currentPage: number = 1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  ngOnInit() {
    this.processRows();
  }

  ngOnChanges() {
    this.processRows();
  }

  isDate(value: any): boolean {
    if (!value) return false;

    // Regex para verificar si la cadena tiene un formato ISO válido
    const isoDateRegex =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-]\d{2}:\d{2}))$/;

    // Verificar si el valor es una fecha ISO válida
    if (isoDateRegex.test(value)) {
      const date = new Date(value);

      return !isNaN(date.getTime()); // Verificar si la fecha es válida
    }

    // Si no es un formato ISO válido, retornar false
    return false;
  }

  private processRows() {
    let sortedRows = [...this.rows].map((row) => ({
      ...row,
      columnMap: this.headers.reduce((acc, header) => {
        acc[header.id] =
          row.columns?.find((col) => col.headerId === header.id) || null;
        return acc;
      }, {} as Record<string, TableColumn | null>),
    }));

    if (this.sortColumn) {
      sortedRows.sort((a, b) => {
        const valueA = a.columnMap[this.sortColumn!]?.primaryText || '';
        const valueB = b.columnMap[this.sortColumn!]?.primaryText || '';

        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
    }

    this.processedRows = sortedRows;
  }

  get paginatedRows() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.processedRows.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.currentPage = 1;
  }

  sortTable(columnId: string) {
    if (this.sortColumn === columnId) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnId;
      this.sortDirection = 'desc';
    }
    this.processRows();
  }

  handleAction(action: string, row: TableRow): void {
    this.clickAction.emit({ action, row });
    this.openMenuId = null;
  }
}
