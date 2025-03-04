import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductApplicationService } from '../../services/product.aplication.service';
import { Router } from '@angular/router';
import { ModalService } from '../../lib/modal/services';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { signal, Signal } from '@angular/core';
import { DeleteProductComponent } from '../../components/organisms/delete-product/delete-product.component';
import { mapTableRowToProduct } from '../../utils/products/product.utils';
import { TableRow, TableColumn } from '../../interfaces';
import { take } from 'rxjs';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productApplicationServiceMock: Partial<ProductApplicationService>;
  let routerMock: Partial<Router>;
  let modalServiceMock: Partial<ModalService>;

  beforeEach(async () => {
    productApplicationServiceMock = {
      filterProducts: jest.fn(() => signal<TableRow[]>([])),
      getCreateSuccessUi: jest.fn(() => signal<string | null>(null)),
      getDeleteSuccessUi: jest.fn(() => signal<string | null>(null)),
      loadProducts: jest.fn(),
      setSearch: jest.fn(),
      setProductSelected: jest.fn(),
      deleteProduct: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    modalServiceMock = {
      show: jest.fn().mockReturnValue({
        modalRef: { hide: jest.fn() },
        contentRef: {
          instance: {
            formSubmit: { pipe: jest.fn(() => ({ subscribe: jest.fn() })) },
            formCancel: { pipe: jest.fn(() => ({ subscribe: jest.fn() })) },
          },
        },
      }),
      hide: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ProductListComponent],
      declarations: [],
      providers: [
        {
          provide: ProductApplicationService,
          useValue: productApplicationServiceMock,
        },
        { provide: Router, useValue: routerMock },
        { provide: ModalService, useValue: modalServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productApplicationServiceMock.loadProducts).toHaveBeenCalled();
  });

  // it('should update search term when searchControl value changes', () => {
  //   component.searchControl.setValue('test');
  //   fixture.detectChanges();
  //   expect(productApplicationServiceMock.setSearch).toHaveBeenCalledWith(
  //     'test'
  //   );
  // });

  it('should navigate to create page when create method is called', () => {
    component.create();
    expect(routerMock.navigate).toHaveBeenCalledWith([
      '/financial-products/create',
    ]);
  });

  it('should handle edit action correctly', () => {
    const mockTableRow: TableRow = {
      id: '1',
      status: 'success',
      label: 'Test Product',
      columns: [
        {
          headerId: 'name',
          primaryText: 'Product Name',
          secundaryText: 'Secondary Info',
          avatar: { type: 'image', src: 'image.png', size: 'sm' },
        },
      ],
    };
    const product = mapTableRowToProduct(mockTableRow);

    component.handleAction({ action: 'Editar', row: mockTableRow });

    expect(
      productApplicationServiceMock.setProductSelected
    ).toHaveBeenCalledWith(product);
    expect(routerMock.navigate).toHaveBeenCalledWith([
      '/financial-products/update',
    ]);
  });

  it('should open modal and handle delete action correctly', () => {
    const mockTableRow: TableRow = {
      id: '1',
      status: 'error',
      label: 'Test Product',
      columns: [
        {
          headerId: 'name',
          primaryText: 'Product Name',
        },
      ],
    };
    const product = mapTableRowToProduct(mockTableRow);

    component.handleAction({ action: 'Eliminar', row: mockTableRow });

    expect(
      productApplicationServiceMock.setProductSelected
    ).toHaveBeenCalledWith(product);
    expect(modalServiceMock.show).toHaveBeenCalledWith(
      DeleteProductComponent,
      expect.any(Object)
    );
  });
});
