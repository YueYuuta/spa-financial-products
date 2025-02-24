import { TableAction, TableHeader } from '../../interfaces';

export const headerTable: TableHeader[] = [
  { id: 'logo', label: 'Logo' },
  { id: 'name', label: 'Nombre', sort: true, info: true },
  { id: 'description', label: 'Descripción' },
  { id: 'date_release', label: 'Fecha de Liberación', sort: true },
  { id: 'date_revision', label: 'Fecha de Restauración', sort: true },
];

export const actionsTable: TableAction[] = [
  {
    id: 'editar',
    label: 'Editar',
  },
  {
    id: 'eliminar',
    label: 'Eliminar',
  },
];
