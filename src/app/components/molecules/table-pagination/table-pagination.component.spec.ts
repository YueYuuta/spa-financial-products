import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablePaginationComponent } from './table-pagination.component';

describe('TablePaginationComponent', () => {
  let component: TablePaginationComponent;
  let fixture: ComponentFixture<TablePaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablePaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TablePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe calcular correctamente el total de páginas', () => {
    component.totalItems = 25;
    component.pageSize = 10;
    component.calculateTotalPages();
    expect(component.totalPages).toBe(3); // 25 / 10 = 2.5 → 3 páginas
  });

  it('Debe actualizar `totalPages` cuando cambian los inputs', () => {
    component.totalItems = 30;
    component.pageSize = 10;
    component.ngOnChanges();
    expect(component.totalPages).toBe(3);
  });

  it('Debe emitir el evento `pageChange` cuando se cambia de página', () => {
    const pageChangeSpy = jest.spyOn(component.pageChange, 'emit');

    component.totalPages = 5;
    component.changePage(3);

    expect(pageChangeSpy).toHaveBeenCalledWith(3);
  });

  it('No debe emitir `pageChange` si la página es inválida', () => {
    const pageChangeSpy = jest.spyOn(component.pageChange, 'emit');

    component.totalPages = 5;
    component.changePage(6); // Página fuera de rango

    expect(pageChangeSpy).not.toHaveBeenCalled();
  });

  it('Debe emitir `pageSizeChange` cuando se cambia el tamaño de página', () => {
    const pageSizeChangeSpy = jest.spyOn(component.pageSizeChange, 'emit');
    const mockEvent = { target: { value: '20' } };

    component.onPageSizeChange(mockEvent);

    expect(pageSizeChangeSpy).toHaveBeenCalledWith(20);
  });

  it('Debe generar correctamente el array `totalPagesArray`', () => {
    component.totalPages = 4;
    expect(component.totalPagesArray).toEqual([1, 2, 3, 4]);
  });
});
