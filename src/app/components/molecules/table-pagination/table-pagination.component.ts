import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './table-pagination.component.html',
  styleUrls: ['./table-pagination.component.scss'],
  imports: [CommonModule],
})
export class TablePaginationComponent implements OnChanges {
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 5;
  @Input() currentPage: number = 1;
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  totalPages: number = 1;

  ngOnChanges() {
    this.calculateTotalPages();
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(event: any) {
    const newSize = Number(event.target.value);
    this.pageSizeChange.emit(newSize);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
