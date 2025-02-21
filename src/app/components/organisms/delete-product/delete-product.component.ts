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
  @Input() data!: ModalData;

  submit() {
    this.formSubmit.emit('hola'); // Emitir los datos del formulario
  }

  cancel() {
    this.formCancel.emit(); // Emitir el evento de cancelación
  }
}
