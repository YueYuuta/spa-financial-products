import { ComponentRef } from '@angular/core';
import { ModalComponent } from '../components/modal/modal.component';
import { SizeModal, TypeModal } from '../types';

export interface ModalOptions<T> {
  initialState?: Partial<T>;
  initialStateModal?: Partial<ModalComponent>;
  modalClass?: SizeModal;
  backdrop?: TypeModal;
  keyboard?: boolean;
  animation?: boolean;
  selector?: string;
}

export interface ModalInstance<T> {
  modalRef: ComponentRef<ModalComponent>;
  contentRef: ComponentRef<T>;
}

export interface ModalSetupOptions {
  modalClass: SizeModal;
  backdrop: TypeModal;
  keyboard: boolean;
  animation: boolean;
}
