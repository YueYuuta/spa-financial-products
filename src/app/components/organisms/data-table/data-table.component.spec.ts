import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent } from './data-table.component';
import { TablePaginationComponent } from '../../molecules/table-pagination/table-pagination.component';
import { By } from '@angular/platform-browser';
import { TableRow } from '../../../interfaces';

describe('DataTableComponent', () => {
  let fixture: ComponentFixture<DataTableComponent>;
  let component: DataTableComponent;

  const mockHeaders = [
    { id: 'name', label: 'Name' },
    { id: 'age', label: 'Age' },
  ];

  const mockRows: TableRow[] = [
    {
      id: '1',
      status: 'success', // Cambiado a un valor válido
      label: 'Row 1',
      columns: [
        { headerId: 'name', primaryText: 'Alice' },
        { headerId: 'age', primaryText: '30' },
      ],
    },
    {
      id: '2',
      status: 'warning', // Cambiado a un valor válido
      label: 'Row 2',
      columns: [
        { headerId: 'name', primaryText: 'Bob' },
        { headerId: 'age', primaryText: '25' },
      ],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DataTableComponent, TablePaginationComponent],
    });

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;

    component.headers = mockHeaders;
    component.rows = mockRows;

    fixture.detectChanges();
  });

  it('should create the DataTableComponent', () => {
    expect(component).toBeTruthy();
  });

  // it('should handle pagination and display correct rows', () => {
  //   component.pageSize = 1;
  //   component.changePage(1);
  //   fixture.detectChanges();
  //   const rows = fixture.debugElement.queryAll(By.css('.table-row'));
  //   expect(rows.length).toBe(1);
  // });

  it('should emit an action when handleAction is called', () => {
    const spy = jest.spyOn(component.clickAction, 'emit');
    component.handleAction('edit', mockRows[0]);
    expect(spy).toHaveBeenCalledWith({ action: 'edit', row: mockRows[0] });
  });

  it('should isDate tobe null', () => {
    const isDate = component.isDate('');
    expect(isDate).toBeFalsy();
  });

  it('should changePage', () => {
    component.changePage(2);
    expect(component.currentPage).toEqual(2);
  });

  it('should sortable', () => {
    component.sortDirection = 'asc';
    component.sortColumn = 's';
    component.sortTable('s');
    expect(component.sortDirection).toEqual('desc');
  });

  it('should sort the table rows when sortTable is called', () => {
    component.sortTable('name');
    fixture.detectChanges();
    expect(component.sortColumn).toBe('name');
    expect(component.sortDirection).toBe('desc');

    component.sortTable('name');
    fixture.detectChanges();
    expect(component.sortDirection).toBe('asc');
  });

  it('should check if a value is a date', () => {
    expect(component.isDate('2022-01-01')).toBe(false);
    expect(component.isDate('invalid date')).toBe(false);
  });

  it('should toggle the menu when toggleMenu is called', () => {
    component.toggleMenu('1');
    expect(component.openMenuId).toBe('1');

    component.toggleMenu('1');
    expect(component.openMenuId).toBeNull();
  });

  it('should paginate rows based on current page and page size', () => {
    component.pageSize = 1;
    component.currentPage = 1;
    fixture.detectChanges();
    const paginatedRows = component.paginatedRows;
    expect(paginatedRows.length).toBe(1);
    expect(paginatedRows[0].id).toBe('1');
  });

  it('should change the page size and reset to the first page', () => {
    component.onPageSizeChange(10);
    expect(component.pageSize).toBe(10);
    expect(component.currentPage).toBe(1);
  });
});
