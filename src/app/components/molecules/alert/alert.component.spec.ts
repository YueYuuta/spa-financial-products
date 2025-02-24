import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe tener valores predeterminados correctos', () => {
    expect(component.type).toBe('info');
    expect(component.message).toBe('');
    expect(component.dismissible).toBe(false);
    expect(component.autoCloseTime).toBeUndefined();
    expect(component.show).toBe(true);
  });

  it('Debe cerrar la alerta cuando se llama a closeAlert()', () => {
    component.closeAlert();
    expect(component.show).toBe(false);
  });

  it('Debe cerrar la alerta automáticamente después de `autoCloseTime`', () => {
    jest.useFakeTimers();
    const setTimeoutSpy = jest.spyOn(window, 'setTimeout');

    component.autoCloseTime = 3000; // 3 segundos
    component.ngOnInit(); // Simular la inicialización del componente

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 3000); // Validamos que setTimeout fue llamado

    jest.advanceTimersByTime(3000); // Simular el tiempo transcurrido
    expect(component.show).toBe(false);
  });
});
