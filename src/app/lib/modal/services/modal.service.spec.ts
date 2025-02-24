import { TestBed } from '@angular/core/testing';
import {
  RendererFactory2,
  Renderer2,
  ViewRef,
  ComponentRef,
  ApplicationRef,
} from '@angular/core';
import { ModalService } from './modal.service';
import { DeleteProductComponent } from '../../../components/organisms/delete-product/delete-product.component';
import { ModalComponent } from '../components/modal/modal.component';

describe('ModalService', () => {
  let service: ModalService;
  let rendererFactory: RendererFactory2;
  let renderer: Renderer2;
  let appRef: ApplicationRef;
  const mockViewRef: ViewRef = {
    destroy: jest.fn(),
    destroyed: false,
    onDestroy: jest.fn(),
    markForCheck: jest.fn(),
    detach: jest.fn(),
    detectChanges: jest.fn(),
    checkNoChanges: jest.fn(),
    reattach: jest.fn(),
  };

  // Mock de ComponentRef
  const mockComponentRef: ComponentRef<any> = {
    hostView: mockViewRef, // Usa el mock de ViewRef
    instance: {}, // Mock de la instancia del componente
    destroy: jest.fn(), // Mock del método destroy
    location: { nativeElement: document.createElement('div') }, // Mock del elemento nativo
    changeDetectorRef: {} as any, // Mock del ChangeDetectorRef
    componentType: {} as any, // Mock del tipo de componente
    injector: {} as any, // Mock del injector
    onDestroy: jest.fn(), // Mock del método onDestroy
    setInput: jest.fn(), // Mock de setInput
  };

  // Mock de ApplicationRef
  const mockApplicationRef = {
    injector: {},
    attachView: jest.fn(), // Mock del método attachView
    detachView: jest.fn(),
    tick: jest.fn(),
  };
  const mockRenderer: Renderer2 = {
    createRenderer: jest.fn(),
    appendChild: jest.fn(),
    setStyle: jest.fn(),
    selectRootElement: jest.fn(),
    createElement: jest.fn(() => document.createElement('div')), // Añade createElement
    destroy: jest.fn(), // Añade destroy si es necesario
    removeChild: jest.fn(), // Añade removeChild si es necesario
    listen: jest.fn(),
    setAttribute: jest.fn(),
    createText: jest.fn(),
    createComment: jest.fn(),
  } as unknown as Renderer2;
  // Mock de RendererFactory2
  const mockRendererFactory = {
    createRenderer: jest.fn(() => mockRenderer),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [
        ModalService,
        { provide: RendererFactory2, useValue: mockRendererFactory },
        // { provide: ApplicationRef, useValue: mockApplicationRef },
      ],
    });

    service = TestBed.inject(ModalService);
    rendererFactory = TestBed.inject(RendererFactory2);
    renderer = mockRenderer;
    appRef = TestBed.inject(ApplicationRef);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    // service.show(DeleteProductComponent, { selector: 'body' });
  });

  it('should create a renderer in the constructor', () => {
    expect(rendererFactory.createRenderer).toHaveBeenCalledWith(null, null);
    expect(service['renderer']).toBe(mockRenderer); // Acceder a la propiedad privada renderer
  });
  //   it('should create and show a modal with the provided component and options', () => {
  //     // Mock del componente dinámico
  //     class MockComponent {}

  //     // Mock del ModalComponent
  //     class MockModalComponent {
  //       setupModal = jest.fn();
  //       container = {
  //         createComponent: jest.fn(() => ({
  //           instance: {}, // Mock del componente dinámico
  //         })),
  //       };
  //       closed = {
  //         emit: jest.fn(),
  //         subscribe: jest.fn(),
  //       };
  //       backdrop = false;
  //       keyboard = false;
  //       modalClass = '';
  //       animation = false;
  //     }

  //     // Opciones del modal
  //     const options: any = {
  //       backdrop: true,
  //       keyboard: true,
  //       modalClass: 'md',
  //       animation: true,
  //       selector: 'body',
  //     };

  //     // Llamar al método show
  //     const modalInstance = service.show(DeleteProductComponent, options);
  //   });
});
