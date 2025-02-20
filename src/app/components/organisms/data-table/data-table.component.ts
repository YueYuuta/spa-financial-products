import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  TableHeader,
  TableRow,
  TableAction,
  TableColumn,
} from '../../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  imports: [CommonModule],
})
export class DataTableComponent implements OnInit {
  @Input() headers: TableHeader[] = [];
  @Input() rows: TableRow[] = [];
  @Input() actions?: TableAction[];
  @Input() sizeStart = 2;
  @Input() showPagination = true;

  @Output() clickAction = new EventEmitter<{ action: string; row: TableRow }>();

  openMenuId: string | null = null;
  toggleMenu(rowId: string): void {
    this.openMenuId = this.openMenuId === rowId ? null : rowId;
  }

  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  sortTable(columnId: string): void {
    if (this.sortColumn === columnId) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnId;
      this.sortDirection = 'asc';
    }

    this.processRows();
  }

  handleAction(action: string, row: TableRow): void {
    this.clickAction.emit({ action, row });
    this.openMenuId = null; // Cierra el menú después de seleccionar una opción
  }

  processedRows: Array<
    TableRow & { columnMap: Record<string, TableColumn | null> }
  > = [];
  currentPage: number = 1;
  pageSize: number = 1;
  totalPages: number = 1;
  pageSizeOptions: number[] = [2, 5, 10, 20, 50];

  ngOnInit() {
    this.processRows();
    this.calculatePagination();
  }

  ngOnChanges() {
    this.processRows();
    this.calculatePagination();
  }

  /** Procesa los datos antes de renderizar */
  private processRows() {
    let sortedRows = [...this.rows].map((row) => ({
      ...row,
      columnMap: this.headers.reduce((acc, header) => {
        acc[header.id] =
          row.columns?.find((col) => col.headerId === header.id) || null;
        return acc;
      }, {} as Record<string, TableColumn | null>),
    }));

    // Aplicar ordenación
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
    this.calculatePagination();
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginatedRows(): Array<
    TableRow & { columnMap: Record<string, TableColumn | null> }
  > {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.processedRows.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.processedRows.length / this.pageSize);
  }

  onPageSizeChange(event: any) {
    this.pageSize = Number(event.target.value);
    this.currentPage = 1;
    this.calculatePagination();
  }
}
