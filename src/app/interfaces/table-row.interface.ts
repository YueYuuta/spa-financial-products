import { TableColumn } from './';

export interface TableRow {
  id: string;
  status: 'success' | 'error' | 'warning';
  label: string;
  columns: TableColumn[];
}
