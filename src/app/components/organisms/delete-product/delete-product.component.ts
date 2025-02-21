import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalData } from '../../../interfaces/modal-data.interface';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-delete-product',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './delete-product.component.html',
  styleUrl: './delete-product.component.scss',
})
export class DeleteProductComponent {
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();
  @Input() data: ModalData = {
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

  submit() {
    this.formSubmit.emit('hola'); // Emitir los datos del formulario
  }

  cancel() {
    this.formCancel.emit(); // Emitir el evento de cancelación
  }
}
