import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { ModalSetupOptions } from '../../interfaces';
import { SizeModal, TypeModal } from '../../types';
import { sizesModal, typeModal } from '../../const';
import { ElementRef } from '@angular/core';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [
        {
          provide: ElementRef,
          useValue: new ElementRef(document.createElement('div')),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe emitir el evento "opened" al inicializarse', () => {
    const openedSpy = jest.spyOn(component.opened, 'emit');
    component.ngOnInit();
    expect(openedSpy).toHaveBeenCalled();
  });

  it('Debe actualizar las configuraciones del modal con setupModal()', () => {
    const options: ModalSetupOptions = {
      modalClass: sizesModal.lg,
      backdrop: typeModal.static,
      animation: false,
      keyboard: false,
    };

    component.setupModal(options);

    expect(component.modalClass).toBe(options.modalClass);
    expect(component.backdrop).toBe(options.backdrop);
    expect(component.animation).toBe(options.animation);
    expect(component.keyboard).toBe(options.keyboard);
    expect(component.animationClass).toBe('open');
  });

  it('Debe cerrar el modal y emitir "closed" con closeModal()', () => {
    jest.useFakeTimers(); // Simular tiempo de espera

    const closedSpy = jest.spyOn(component.closed, 'emit');
    component.closeModal();

    expect(component.animationClass).toBe('close');

    jest.advanceTimersByTime(300); // Simula el tiempo de animación

    expect(closedSpy).toHaveBeenCalled();
  });

  it('Debe cerrar el modal si se presiona Escape y keyboard es true', () => {
    const closeSpy = jest.spyOn(component, 'closeModal');
    component.keyboard = true;

    component.onEscape();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('No debe cerrar el modal si se presiona Escape y keyboard es false', () => {
    const closeSpy = jest.spyOn(component, 'closeModal');
    component.keyboard = false;

    component.onEscape();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('Debe evitar la propagación del evento en onBoxClick()', () => {
    const event = new MouseEvent('click');
    const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');

    component.onBoxClick(event);

    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('Debe cerrar el modal si se hace clic fuera del modal y el backdrop es dinámico', () => {
    const closeSpy = jest.spyOn(component, 'closeModal');
    component.modalBox = new ElementRef(document.createElement('div'));
    component.backdrop = typeModal.dynamic;

    const event = new MouseEvent('click');
    jest
      .spyOn(event, 'target', 'get')
      .mockReturnValue(document.createElement('div'));

    component.onContainerClick(event);

    expect(closeSpy).toHaveBeenCalled();
  });

  it('No debe cerrar el modal si se hace clic dentro del modal', () => {
    const closeSpy = jest.spyOn(component, 'closeModal');
    const modalElement = document.createElement('div');

    component.modalBox = new ElementRef(modalElement);
    component.backdrop = typeModal.dynamic;

    const event = new MouseEvent('click');
    jest.spyOn(event, 'target', 'get').mockReturnValue(modalElement);

    component.onContainerClick(event);

    expect(closeSpy).not.toHaveBeenCalled();
  });
});
