import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductApplicationService } from '../../services/product.aplication.service';
import { ModalService } from '../../lib/modal/services';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { DeleteProductComponent } from '../../components/organisms/delete-product/delete-product.component';
import { TableRow, TableColumn } from '../../interfaces';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productApplicationService: ProductApplicationService;
  let modalService: ModalService;
  let router: Router;

  const mockProduct = {
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
        headerId: 'name',
        primaryText: 'Producto de prueba',
        secundaryText: 'Descripción de prueba',
        avatar: {
          type: 'image',
          src: 'https://example.com/logo.png',
          size: 'md',
        },
      },
    ],
  };
  let formSubmitSubject: Subject<void>;
  let formCancelSubject: Subject<void>;

  const mockProductApplicationService = {
    getLoading: jest.fn().mockReturnValue(of(false)),
    getDeleteErrorUi: jest.fn().mockReturnValue(of(null)),
    getDeleteSuccessUi: jest.fn().mockReturnValue(of(null)),
    filterProducts: jest.fn().mockReturnValue(of([mockProduct])),
    selectProductId: jest.fn(),
    deleteProduct: jest.fn(),
  };

  // const mockModalService = {
  //   show: jest.fn().mockReturnValue({
  //     modalRef: { hide: jest.fn() },
  //     contentRef: {
  //       instance: {
  //         formSubmit: formSubmitSubject.asObservable(),
  //         formCancel: formCancelSubject.asObservable(),
  //       },
  //     },
  //   }),
  //   hide: jest.fn(),
  // };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    formSubmitSubject = new Subject<void>();
    formCancelSubject = new Subject<void>();

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        {
          provide: ProductApplicationService,
          useValue: mockProductApplicationService,
        },
        {
          provide: ModalService,
          useValue: {
            show: jest.fn().mockReturnValue({
              modalRef: { hide: jest.fn() },
              contentRef: {
                instance: {
                  formSubmit: formSubmitSubject.asObservable(),
                  formCancel: formCancelSubject.asObservable(),
                },
              },
            }),
            hide: jest.fn(),
          },
        },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productApplicationService = TestBed.inject(ProductApplicationService);
    modalService = TestBed.inject(ModalService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('Debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe suscribirse al control de búsqueda y filtrar productos', (done) => {
    component.filteredRows$.subscribe((products) => {
      expect(products).toEqual([mockProduct]);
      done();
    });
  });

  it('Debe navegar a la ruta de creación al ejecutar create()', () => {
    component.create();
    expect(router.navigate).toHaveBeenCalledWith([
      '/financial-products/create',
    ]);
  });

  it('Debe llamar a selectProductId y navegar a la edición cuando se selecciona "Editar"', () => {
    const event = { action: 'Editar', row: mockTableRow };
    component.handleAction(event);
    expect(productApplicationService.selectProductId).toHaveBeenCalledWith(
      mockTableRow.id
    );
    expect(router.navigate).toHaveBeenCalledWith([
      '/financial-products/update',
    ]);
  });

  it('Debe abrir el modal y eliminar el producto cuando se selecciona "Eliminar"', () => {
    const event = { action: 'Eliminar', row: mockTableRow };
    const spyModalShow = jest.spyOn(modalService, 'show');

    component.handleAction(event);

    expect(spyModalShow).toHaveBeenCalledWith(
      DeleteProductComponent,
      expect.any(Object)
    );
  });

  it('Debe abrir el modal y eliminar el producto cuando se selecciona "Eliminar"', () => {
    const event = { action: 'Eliminar', row: mockTableRow };

    component.handleAction(event);

    expect(modalService.show).toHaveBeenCalledWith(
      DeleteProductComponent,
      expect.any(Object)
    );

    // Simular el evento de confirmación de eliminación
    formSubmitSubject.next();

    expect(productApplicationService.deleteProduct).toHaveBeenCalledWith(
      mockProduct.id
    );
    expect(modalService.hide).toHaveBeenCalled();
  });

  it('Debe cerrar el modal cuando se cancela la eliminación', () => {
    const event = { action: 'Eliminar', row: mockTableRow };

    component.handleAction(event);

    // Simular el evento de cancelación
    formCancelSubject.next();

    expect(modalService.hide).toHaveBeenCalled();
  });
});
