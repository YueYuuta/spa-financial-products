import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateProductComponent } from './create-product.component';
import { CommonModule } from '@angular/common';
import { FormProductComponent } from '../../components/organisms/form-product/form-product.component';
import { AlertComponent } from '../../components/molecules/alert/alert.component';
import { SpinnerOverlayComponent } from '../../components/atoms/spinner-overlay/spinner-overlay.component';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as ProductActions from '../../store/actions/product.action';
import { Product } from '../../interfaces';
import {
  selectAddProductError,
  selectAddProductSuccess,
  selectLoading,
} from '../../store/selectors/product.selector';
import { HttpClientModule } from '@angular/common/http';

describe('CreateProductComponent', () => {
  let fixture: ComponentFixture<CreateProductComponent>;
  let component: CreateProductComponent;
  let store: Store;

  const mockProduct: Product = {
    id: '124',
    name: 'New Product',
    description: 'New product description',
    logo: 'logo-url',
    date_release: '2023-03-01',
    date_revision: '2024-03-01',
  };

  const mockStore = {
    select: jest.fn(),
    dispatch: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormProductComponent,
        AlertComponent,
        SpinnerOverlayComponent,
        CreateProductComponent,
        HttpClientModule,
      ],
      declarations: [],
      providers: [{ provide: Store, useValue: mockStore }],
    });

    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create the CreateProductComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should select loading, error, success from the store', () => {
    const loading$ = of(true);
    const error$ = of('Error message');
    const success$ = of('Product added successfully');

    mockStore.select.mockImplementationOnce((selector) => {
      switch (selector) {
        case selectLoading:
          return loading$;
        case selectAddProductError:
          return error$;
        case selectAddProductSuccess:
          return success$;
        default:
          return of(null);
      }
    });
  });

  it('should dispatch the addProduct action when form is submitted', () => {
    const spy = jest.spyOn(mockStore, 'dispatch');
    component.handleFormSubmit(mockProduct);
    expect(spy).toHaveBeenCalledWith(
      ProductActions.addProduct({ product: mockProduct })
    );
  });

  it('should handle form cancel correctly', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    component.handleFormCancel();
    expect(consoleSpy).toHaveBeenCalledWith('Formulario cancelado');
  });

  it('should dispatch addProduct action when form is submitted', () => {
    const spy = jest.spyOn(mockStore, 'dispatch');
    component.handleFormSubmit(mockProduct);
    expect(spy).toHaveBeenCalledWith(
      ProductActions.addProduct({ product: mockProduct })
    );
  });
});
