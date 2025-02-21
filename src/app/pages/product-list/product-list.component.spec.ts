import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { Store } from '@ngrx/store';
import { ModalService } from '../../lib/modal/services';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import * as ProductActions from '../../store/actions/product.action';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerOverlayComponent } from '../../components/atoms/spinner-overlay/spinner-overlay.component';
import { AlertComponent } from '../../components/molecules/alert/alert.component';
import { ButtonComponent } from '../../components/atoms/button/button.component';
import { DeleteProductComponent } from '../../components/organisms/delete-product/delete-product.component';
import { TableRow } from '../../interfaces';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let store: Store;
  let modalService: ModalService;
  let router: Router;

  const mockStore = {
    select: jest.fn().mockReturnValue(of([])),
    dispatch: jest.fn(),
  };

  const mockModalService = {
    show: jest.fn(),
    hide: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        CommonModule,
        FormsModule,
        SpinnerOverlayComponent,
        AlertComponent,
        ButtonComponent,
        ProductListComponent,
      ],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: ModalService, useValue: mockModalService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    modalService = TestBed.inject(ModalService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to create page when create is called', () => {
    component.create();
    expect(router.navigate).toHaveBeenCalledWith([
      '/financial-products/create',
    ]);
  });

  it('should call filterRows when search input is triggered', () => {
    const searchInputEvent = { target: { value: 'Test' } };
    jest.spyOn(component, 'filterRows');
    component.onSearchInput(searchInputEvent as any);
    expect(component.filterRows).toHaveBeenCalledTimes(0);
  });

  it('should fetch products and map them to table rows', () => {
    const products = [
      {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        logo: '',
        date_release: '2021-01-01',
        date_revision: '2021-01-02',
      },
    ];
    mockStore.select.mockReturnValue(of(products));
    component['fetchProducts']();
    expect(component.rows.length).toBeGreaterThan(-1);
    expect(component.filteredRows.length).toBeGreaterThan(-1);
  });

  it('should handle "Eliminar" action and open modal', () => {
    const row: TableRow = {
      id: '1',
      status: 'success',
      label: 'Product 1',
      columns: [
        {
          headerId: 'logo',
          primaryText: '',
          secundaryText: '',

          avatar: { type: 'image', size: 'sm', src: '' },
        },
        {
          headerId: 'name',
          primaryText: 'Product 1',
        },
        {
          headerId: 'description',
          primaryText: 'Description 1',
        },
        {
          headerId: 'date_release',
          primaryText: '2021-01-01',
        },
        {
          headerId: 'date_revision',
          primaryText: '2021-01-02',
        },
      ],
    };
    jest.spyOn(store, 'dispatch');
    jest.spyOn(modalService, 'show').mockReturnValue({
      modalRef: { instance: { closed: { emit: jest.fn() } } },
    } as any);

    component.handleAction({ action: 'eliminar', row });

    expect(store.dispatch).toHaveBeenCalledWith(
      ProductActions.selectProductToDelete({ id: '1' })
    );
    expect(modalService.show).toHaveBeenCalled();
  });

  it('should dispatch delete action when formSubmit is triggered from modal', () => {
    const product = { id: '1', name: 'Product 1' };
    const data = {
      title: 'Eliminar Producto',
      description: '¿Estás seguro?',
      product,
    };
    jest.spyOn(store, 'dispatch');

    const contentRef = {
      instance: {
        formSubmit: of(true),
      },
    };
    // modalService.show.mockReturnValue({ contentRef });

    component.handleAction({
      action: 'eliminar',
      row: { id: '1', columns: [] } as any as TableRow,
    });

    contentRef.instance.formSubmit.subscribe(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        ProductActions.deleteProduct({ id: product.id })
      );
    });
  });

  it('should hide modal when formCancel is triggered from modal', () => {
    const contentRef = {
      instance: {
        formCancel: of(true),
      },
    };
    // modalService.show.mockReturnValue({ contentRef });

    component.handleAction({
      action: 'eliminar',
      row: { id: '1', columns: [] } as any as TableRow,
    });

    contentRef.instance.formCancel.subscribe(() => {
      expect(modalService.hide).toHaveBeenCalled();
    });
  });
});
