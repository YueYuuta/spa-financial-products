import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';

import { ProductService } from '../../../services/product.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as ProductActions from '../actions/product.action';
import { Product } from '../../models';
import { ProductEffects } from './product.effect';

describe('ProductEffects', () => {
  let actions$: Observable<any>;
  let effects: ProductEffects;
  let productService: jest.Mocked<ProductService>;
  let store: jest.Mocked<Store>;
  let router: jest.Mocked<Router>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductEffects,
        provideMockActions(() => actions$),
        {
          provide: ProductService,
          useValue: {
            verifyProduct: jest.fn(),
            getProducts: jest.fn(),
            createProduct: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
          },
        },
        {
          provide: Store,
          useValue: {
            select: jest.fn(),
            pipe: jest.fn(),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          },
        },
      ],
    });

    effects = TestBed.inject(ProductEffects);
    productService = TestBed.inject(
      ProductService
    ) as jest.Mocked<ProductService>;
    store = TestBed.inject(Store) as jest.Mocked<Store>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  describe('selectProductById$', () => {
    it('should return selectProductSuccess if product exists', (done) => {
      const product = { id: '1', name: 'Product 1' } as Product;
      const action = ProductActions.selectProductById({ id: '1' });
      const expectedAction = ProductActions.selectProductSuccess({ product });

      actions$ = of(action);
      productService.verifyProduct.mockReturnValue(of(true));
      store.select.mockReturnValue(of(product));

      effects.selectProductById$.subscribe((result: any) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should return selectProductFailure if product does not exist', (done) => {
      const action = ProductActions.selectProductById({ id: '1' });
      const expectedAction = ProductActions.selectProductFailure({
        error: 'El producto no está disponible en el sistema.',
      });

      actions$ = of(action);
      productService.verifyProduct.mockReturnValue(of(true));
      store.select.mockReturnValue(of(null));

      effects.selectProductById$.subscribe((result: any) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should return selectProductFailure if ID does not exist', (done) => {
      const action = ProductActions.selectProductById({ id: '1' });
      const expectedAction = ProductActions.selectProductFailure({
        error: 'El ID no existe.',
      });

      actions$ = of(action);
      productService.verifyProduct.mockReturnValue(of(false));

      effects.selectProductById$.subscribe((result: any) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should return selectProductFailure if there is an error', (done) => {
      const action = ProductActions.selectProductById({ id: '1' });
      const expectedAction = ProductActions.selectProductFailure({
        error: 'Error verificando el ID.',
      });

      actions$ = of(action);
      productService.verifyProduct.mockReturnValue(throwError('Error'));

      effects.selectProductById$.subscribe((result: any) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });
  });

  describe('navigateToEdit$', () => {
    it('should navigate to /financial-products/update on selectProductSuccess', (done) => {
      const product = { id: '1', name: 'Product 1' } as Product;
      const action = ProductActions.selectProductSuccess({ product });

      actions$ = of(action);

      effects.navigateToEdit$.subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith([
          '/financial-products/update',
        ]);
        done();
      });
    });
  });

  //   describe('loadProducts$', () => {
  //     it('should return loadProductsSuccess if products are already loaded', (done) => {
  //       const products = [{ id: '1', name: 'Product 1' }] as Product[];
  //       const action = ProductActions.loadProducts();
  //       const expectedAction = ProductActions.loadProductsSuccess({ products });

  //       actions$ = of(action); // Simula la acción
  //       const state = { products: { products, isEmpty: false } };

  //       // Simula el store.pipe para devolver el estado
  //       store.pipe.mockImplementation(() => of(state));

  //       effects.loadProducts$.subscribe((result) => {
  //         expect(result).toEqual(expectedAction); // Verifica la acción esperada
  //         done(); // Finaliza la prueba
  //       });
  //     });

  //     it('should return loadProductsSuccess if products are fetched successfully', (done) => {
  //       const products = [{ id: '1', name: 'Product 1' }] as Product[];
  //       const action = ProductActions.loadProducts();
  //       const expectedAction = ProductActions.loadProductsSuccess({ products });

  //       actions$ = of(action); // Simula la acción
  //       const state = { products: { products: [], isEmpty: true } };

  //       // Simula el store.pipe para devolver el estado
  //       store.pipe.mockImplementation(() => of(state));

  //       // Simula la respuesta del servicio
  //       productService.getProducts.mockReturnValue(of({ data: products }));

  //       effects.loadProducts$.subscribe((result) => {
  //         expect(result).toEqual(expectedAction); // Verifica la acción esperada
  //         done(); // Finaliza la prueba
  //       });
  //     });

  //     it('should return loadProductsFailure if there is an error', (done) => {
  //       const action = ProductActions.loadProducts();
  //       const expectedAction = ProductActions.loadProductsFailure({
  //         error: 'Error message',
  //       });

  //       actions$ = of(action); // Simula la acción
  //       const state = { products: { products: [], isEmpty: true } };

  //       // Simula el store.pipe para devolver el estado
  //       store.pipe.mockImplementation(() => of(state));

  //       // Simula un error en el servicio
  //       productService.getProducts.mockReturnValue(
  //         throwError({ message: 'Error message' })
  //       );

  //       effects.loadProducts$.subscribe((result) => {
  //         expect(result).toEqual(expectedAction); // Verifica la acción esperada
  //         done(); // Finaliza la prueba
  //       });
  //     });
  //   });

  describe('addProduct$', () => {
    it('should return addProductSuccess if product is added successfully', (done) => {
      const product = { id: '1', name: 'Product 1' } as Product;
      const action = ProductActions.addProduct({ product });
      const expectedAction = ProductActions.addProductSuccess({ product });

      actions$ = of(action);
      productService.createProduct.mockReturnValue(of({ data: product }));

      effects.addProduct$.subscribe((result: any) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should return addProductFailure if there is an error', (done) => {
      const product = { id: '1', name: 'Product 1' } as Product;
      const action = ProductActions.addProduct({ product });
      const expectedAction = ProductActions.addProductFailure({
        error: 'Error message',
      });

      actions$ = of(action);
      productService.createProduct.mockReturnValue(
        throwError({ message: 'Error message' })
      );

      effects.addProduct$.subscribe((result: any) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });
  });

  describe('updateProduct$', () => {
    it('should return updateProductSuccess if product is updated successfully', (done) => {
      const product = { id: '1', name: 'Product 1' } as Product;
      const action = ProductActions.updateProduct({ id: '1', product });
      const expectedAction = ProductActions.updateProductSuccess({ product });

      actions$ = of(action);
      productService.updateProduct.mockReturnValue(of({ data: product }));

      effects.updateProduct$.subscribe((result: any) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should return updateProductFailure if there is an error', (done) => {
      const product = { id: '1', name: 'Product 1' } as Product;
      const action = ProductActions.updateProduct({ id: '1', product });
      const expectedAction = ProductActions.updateProductFailure({
        error: 'Error message',
      });

      actions$ = of(action);
      productService.updateProduct.mockReturnValue(
        throwError({ message: 'Error message' })
      );

      effects.updateProduct$.subscribe((result: any) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });
  });

  describe('selectProductToDelete$', () => {
    it('should return selectProductToDeleteSuccess if product exists', (done) => {
      const product = { id: '1', name: 'Product 1' } as Product;
      const action = ProductActions.selectProductToDelete({ id: '1' });
      const expectedAction = ProductActions.selectProductToDeleteSuccess({
        product,
      });

      actions$ = of(action);
      productService.verifyProduct.mockReturnValue(of(true));
      store.select.mockReturnValue(of(product));

      effects.selectProductToDelete$.subscribe((result: any) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should return selectProductToDeleteFailure if product does not exist', (done) => {
      const action = ProductActions.selectProductToDelete({ id: '1' });
      const expectedAction = ProductActions.selectProductToDeleteFailure({
        error: 'El producto no está disponible en el sistema.',
      });

      actions$ = of(action);
      productService.verifyProduct.mockReturnValue(of(true));
      store.select.mockReturnValue(of(null));

      effects.selectProductToDelete$.subscribe((result: any) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should return selectProductToDeleteFailure if ID does not exist', (done) => {
      const action = ProductActions.selectProductToDelete({ id: '1' });
      const expectedAction = ProductActions.selectProductToDeleteFailure({
        error: 'El ID no existe.',
      });

      actions$ = of(action);
      productService.verifyProduct.mockReturnValue(of(false));

      effects.selectProductToDelete$.subscribe((result: any) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should return selectProductToDeleteFailure if there is an error', (done) => {
      const action = ProductActions.selectProductToDelete({ id: '1' });
      const expectedAction = ProductActions.selectProductToDeleteFailure({
        error: 'Error al verificar el producto',
      });

      actions$ = of(action);
      productService.verifyProduct.mockReturnValue(throwError('Error'));

      effects.selectProductToDelete$.subscribe((result: any) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });
  });

  describe('deleteProduct$', () => {
    it('should return deleteProductSuccess if product is deleted successfully', (done) => {
      const action = ProductActions.deleteProduct({ id: '1' });
      const expectedAction = ProductActions.deleteProductSuccess({ id: '1' });

      actions$ = of(action);
      productService.deleteProduct.mockReturnValue(of({ message: '' }));

      effects.deleteProduct$.subscribe((result: any) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });

    it('should return deleteProductFailure if there is an error', (done) => {
      const action = ProductActions.deleteProduct({ id: '1' });
      const expectedAction = ProductActions.deleteProductFailure({
        error: 'Error message',
      });

      actions$ = of(action);
      productService.deleteProduct.mockReturnValue(
        throwError({ message: 'Error message' })
      );

      effects.deleteProduct$.subscribe((result: any) => {
        expect(result).toEqual(expectedAction);
        done();
      });
    });
  });
});
