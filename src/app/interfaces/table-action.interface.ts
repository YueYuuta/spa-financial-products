import { TableRow } from './';

export interface TableAction {
  id: string;
  label: string;
  action: (row: TableRow) => void;
}
