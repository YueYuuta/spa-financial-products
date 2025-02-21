import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateProductComponent } from './update-product.component';
import { CommonModule } from '@angular/common';
import { FormProductComponent } from '../../components/organisms/form-product/form-product.component';
import { AlertComponent } from '../../components/molecules/alert/alert.component';
import { SpinnerOverlayComponent } from '../../components/atoms/spinner-overlay/spinner-overlay.component';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import * as ProductActions from '../../store/actions/product.action';
import { Product } from '../../store/models';
import {
  selectUpdateProductError,
  selectUpdateProductSuccess,
  selectLoading,
  selectSelectedProduct,
} from '../../store/selectors/product.selector';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('UpdateProductComponent', () => {
  let fixture: ComponentFixture<UpdateProductComponent>;
  let component: UpdateProductComponent;
  let store: Store;

  const mockProduct: Product = {
    id: '123',
    name: 'Product A',
    description: 'Description for Product A',
    logo: 'logo-url',
    date_release: '2023-01-01',
    date_revision: '2024-01-01',
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
        UpdateProductComponent,
        HttpClientModule,
      ],
      declarations: [],
      providers: [{ provide: Store, useValue: mockStore }],
    });

    fixture = TestBed.createComponent(UpdateProductComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create the UpdateProductComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch the updateProduct action when form is submitted', () => {
    const spy = jest.spyOn(mockStore, 'dispatch');
    component.handleFormSubmit(mockProduct);
    expect(spy).toHaveBeenCalledWith(
      ProductActions.updateProduct({ id: mockProduct.id, product: mockProduct })
    );
  });

  it('should handle form cancel correctly', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    component.handleFormCancel();
    expect(consoleSpy).toHaveBeenCalledWith('Formulario cancelado');
  });

  it('should dispatch the updateProduct action on form submission', () => {
    const spy = jest.spyOn(mockStore, 'dispatch');
    component.handleFormSubmit(mockProduct);
    expect(spy).toHaveBeenCalledWith(
      ProductActions.updateProduct({ id: mockProduct.id, product: mockProduct })
    );
  });
});
