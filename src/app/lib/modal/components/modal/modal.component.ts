import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ModalSetupOptions } from '../../interfaces';
import { SizeModal, TypeModal } from '../../types';
import { sizesModal, typeModal } from '../../const';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit {
  @ViewChild('dynamicContent', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;
  @ViewChild('modalBox') modalBox!: ElementRef;
  @Output() closed = new EventEmitter<void>();
  @Output() opened = new EventEmitter<void>();
  title: string = 'add user';
  modalClass: SizeModal = sizesModal.md; // Recibe clases dinámicas
  backdrop: TypeModal = typeModal.dynamic;
  keyboard: boolean = true;
  animation = true;
  animationClass: 'open' | 'close' = 'close';

  private readonly elementRef = inject(ElementRef);

  ngOnInit(): void {
    this.opened.emit(); // Emitir evento cuando el modal se abre
  }

  onBoxClick(event: MouseEvent): void {
    event.stopPropagation(); // Evita que el clic en la caja se propague al overlay
  }

  setupModal(options: ModalSetupOptions): void {
    this.modalClass = options.modalClass;
    this.backdrop = options.backdrop;
    this.animation = options.animation;
    this.keyboard = options.keyboard;
    this.animationClass = 'open';
  }

  closeModal(): void {
    this.animationClass = 'close';
    setTimeout(() => this.closed.emit(), this.animation ? 300 : 0);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    // closing modal on escape
    if (this.keyboard) {
      this.closeModal();
    }
  }

  onContainerClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (
      this.modalBox &&
      !this.modalBox.nativeElement.contains(target) &&
      this.backdrop === typeModal.dynamic
    ) {
      this.closeModal();
    }
  }
}
