import { Product, TableRow } from '../../interfaces';

/** 🔹 Transforma `Product[]` en `TableRow[]` */
export const mapProductsToTableRows = (products: Product[]): TableRow[] =>
  products.map(mapProductToTableRow);

/** 🔹 Transforma un solo `Product` en `TableRow` */
export const mapProductToTableRow = (product: Product): TableRow => ({
  id: product.id,
  status: 'success',
  label: product.name,
  columns: [
    {
      headerId: 'logo',
      primaryText: '',
      avatar: product.logo
        ? { type: 'image', src: product.logo, size: 'sm' }
        : undefined,
    },
    { headerId: 'name', primaryText: product.name },
    { headerId: 'description', primaryText: product.description },
    { headerId: 'date_release', primaryText: product.date_release },
    { headerId: 'date_revision', primaryText: product.date_revision },
  ],
});

export const mapTableRowToProduct = (row: TableRow): Product => ({
  id: row.id,
  name: row.label,
  logo: row.columns.find((col) => col.headerId === 'logo')?.avatar?.src ?? '',
  description:
    row.columns.find((col) => col.headerId === 'description')?.primaryText ??
    '',
  date_release:
    row.columns.find((col) => col.headerId === 'date_release')?.primaryText ??
    '',
  date_revision:
    row.columns.find((col) => col.headerId === 'date_revision')?.primaryText ??
    '',
});

/** 🔹 Filtra `TableRow[]` según un término de búsqueda */
export const filterTableRows = (
  rows: TableRow[],
  searchTerm: string
): TableRow[] => {
  if (!searchTerm.trim()) return rows;
  return rows.filter((row) =>
    row.columns.some((col) =>
      col.primaryText.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
};
