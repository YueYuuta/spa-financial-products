import {
  Injectable,
  ApplicationRef,
  ComponentRef,
  Type,
  createComponent,
  RendererFactory2,
  Renderer2,
} from '@angular/core';
import { ModalComponent } from '../components/modal/modal.component';
import { ModalInstance, ModalOptions } from '../interfaces';
import {
  selectorOverflow,
  sizesModal,
  typeModal,
  typeOverflow,
} from '../const';
import { TypeOverflow } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalRef!: ComponentRef<ModalComponent>;
  private selector!: string;
  private renderer: Renderer2;

  constructor(
    private appRef: ApplicationRef,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  show<T extends object>(
    contentComponent: Type<T>,
    options: ModalOptions<T> = {}
  ): ModalInstance<T> {
    const {
      backdrop = typeModal.dynamic,
      initialState,
      keyboard = true,
      modalClass = sizesModal.md,
      animation = true,
      selector = selectorOverflow,
      initialStateModal,
    } = options;
    this.selector = selector;
    this.hiddenOrAutoScroll(this.selector, typeOverflow.hidden);
    // Crear el modal standalone usando createComponent
    this.modalRef = createComponent(ModalComponent, {
      environmentInjector: this.appRef.injector,
    });

    // Adjuntar la vista al ApplicationRef
    this.appRef.attachView(this.modalRef.hostView);

    // document.body.appendChild(this.modalRef.location.nativeElement);
    // Agregar el modal al DOM de manera controlada
    const body = document.body;
    this.renderer.appendChild(body, this.modalRef.location.nativeElement);

    // Delegar opciones al ModalComponent
    this.modalRef.instance.setupModal({
      modalClass,
      backdrop,
      keyboard,
      animation,
    });

    // Crear el contenido dinámico dentro del modal
    const contentRef =
      this.modalRef.instance.container.createComponent(contentComponent);

    // Pasar los datos iniciales al componente dinámico
    if (initialState) {
      Object.assign(contentRef.instance, initialState);
    }

    if (initialStateModal) {
      Object.assign(this.modalRef.instance, initialStateModal);
    }

    // Manejar el cierre del modal
    this.modalRef.instance.closed.subscribe(() => {
      this.close();
    });

    // Retornar las referencias encapsuladas en un objeto
    return { modalRef: this.modalRef, contentRef };
  }

  private close(): void {
    this.hiddenOrAutoScroll(this.selector, typeOverflow.auto);
    this.appRef.detachView(this.modalRef.hostView);
    this.modalRef.destroy();
  }

  hide(): void {
    this.modalRef.instance.closeModal();
  }

  private hiddenOrAutoScroll(selector: string, type: TypeOverflow) {
    // Obtener el contenedor raíz (en este caso, el body) y luego buscar el elemento hijo
    const body = this.renderer.selectRootElement('body', true); // Obtener el body
    if (selector === 'body') {
      this.renderer.setStyle(body, 'overflow', type);
      return;
    }

    // Usar Renderer2 para encontrar el contenedor basado en un selector
    const overflowContainer = body.querySelector(selector) as HTMLElement;

    if (overflowContainer) {
      this.renderer.setStyle(overflowContainer, 'overflow', type);
    } else {
      console.warn(`Selector ${selector} not found.`);
    }
  }
}
