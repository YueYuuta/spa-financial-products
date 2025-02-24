import {
  mapProductsToTableRows,
  mapProductToTableRow,
  mapTableRowToProduct,
  filterTableRows,
} from './product.utils';
import { Product, TableRow } from '../../interfaces';

describe('Product Utils', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Producto de prueba',
    description: 'Descripción de prueba',
    logo: 'https://example.com/logo.png',
    date_release: '2023-01-01',
    date_revision: '2025-01-01',
  };

  const mockTableRow: TableRow = {
    id: '1',
    status: 'success',
    label: 'Producto de prueba',
    columns: [
      {
        headerId: 'logo',
        primaryText: '',
        avatar: {
          type: 'image',
          src: 'https://example.com/logo.png',
          size: 'sm',
        },
      },
      { headerId: 'name', primaryText: 'Producto de prueba' },
      { headerId: 'description', primaryText: 'Descripción de prueba' },
      { headerId: 'date_release', primaryText: '2023-01-01' },
      { headerId: 'date_revision', primaryText: '2025-01-01' },
    ],
  };

  describe('mapProductToTableRow', () => {
    it('Debe mapear un `Product` a `TableRow` correctamente', () => {
      const result = mapProductToTableRow(mockProduct);
      expect(result).toEqual(mockTableRow);
    });

    it('Debe manejar un producto sin logo correctamente', () => {
      const productWithoutLogo: Product = { ...mockProduct, logo: '' };
      const result = mapProductToTableRow(productWithoutLogo);

      expect(
        result.columns.find((col) => col.headerId === 'logo')?.avatar
      ).toBeUndefined();
    });
  });

  describe('mapProductsToTableRows', () => {
    it('Debe mapear un array de `Product[]` a `TableRow[]` correctamente', () => {
      const result = mapProductsToTableRows([mockProduct]);
      expect(result).toEqual([mockTableRow]);
    });

    it('Debe retornar un array vacío si no hay productos', () => {
      expect(mapProductsToTableRows([])).toEqual([]);
    });
  });

  describe('mapTableRowToProduct', () => {
    it('Debe mapear un `TableRow` a `Product` correctamente', () => {
      const result = mapTableRowToProduct(mockTableRow);
      expect(result).toEqual(mockProduct);
    });

    it('Debe manejar un `TableRow` sin logo correctamente', () => {
      const tableRowWithoutLogo: TableRow = {
        ...mockTableRow,
        columns: mockTableRow.columns.map((col) =>
          col.headerId === 'logo' ? { ...col, avatar: undefined } : col
        ),
      };

      const result = mapTableRowToProduct(tableRowWithoutLogo);
      expect(result.logo).toBe('');
    });
  });

  describe('filterTableRows', () => {
    const tableRows: TableRow[] = [mockTableRow];

    it('Debe retornar todos los elementos si no hay término de búsqueda', () => {
      expect(filterTableRows(tableRows, '')).toEqual(tableRows);
    });

    it('Debe filtrar correctamente por nombre', () => {
      expect(filterTableRows(tableRows, 'producto')).toEqual(tableRows);
    });

    it('Debe filtrar correctamente por descripción', () => {
      expect(filterTableRows(tableRows, 'Descripción')).toEqual(tableRows);
    });

    it('Debe ser insensible a mayúsculas y minúsculas', () => {
      expect(filterTableRows(tableRows, 'PRODuctO')).toEqual(tableRows);
    });

    it('Debe retornar un array vacío si no hay coincidencias', () => {
      expect(filterTableRows(tableRows, 'No existe')).toEqual([]);
    });
  });
});
