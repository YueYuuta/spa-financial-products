import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteProductComponent } from './delete-product.component';
import { ModalData } from '../../../interfaces/modal-data.interface';
import { ButtonComponent } from '../../atoms/button/button.component';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';

describe('DeleteProductComponent', () => {
  let component: DeleteProductComponent;
  let fixture: ComponentFixture<DeleteProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [CommonModule, ButtonComponent, DeleteProductComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    const modalData: ModalData = {
      title: 'Delete Product',
      description: 'Are you sure you want to delete this product?',
      product: {
        id: '124',
        name: 'New Product',
        description: 'New product description',
        logo: 'logo-url',
        date_release: '2023-03-01',
        date_revision: '2024-03-01',
      }, // Asegurarse de que `product` esté definido
    };
    component.data = modalData;
    expect(component).toBeTruthy();
  });

  it('should emit formSubmit when submit() is called', () => {
    const formSubmitSpy = jest.spyOn(component.formSubmit, 'emit');

    component.submit();

    expect(formSubmitSpy).toHaveBeenCalledWith('hola');
  });

  it('should emit formCancel when cancel() is called', () => {
    const formCancelSpy = jest.spyOn(component.formCancel, 'emit');

    component.cancel();

    expect(formCancelSpy).toHaveBeenCalled();
  });

  it('should bind input data correctly', () => {
    // Crear un objeto ModalData con un producto definido
    const modalData: ModalData = {
      title: 'Delete Product',
      description: 'Are you sure you want to delete this product?',
      product: {
        id: '124',
        name: 'New Product',
        description: 'New product description',
        logo: 'logo-url',
        date_release: '2023-03-01',
        date_revision: '2024-03-01',
      }, // Asegurarse de que `product` esté definido
    };

    // Asignar el objeto ModalData a la propiedad `data` del componente
    component.data = modalData;
    fixture.detectChanges();

    // Verificar que el valor de `data` es el que se pasó
    expect(component.data).toEqual(modalData);
  });
});
