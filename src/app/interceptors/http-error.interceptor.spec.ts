import { TestBed } from '@angular/core/testing';
import { HttpErrorInterceptor } from './http-error.interceptor';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('HttpErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true,
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería interceptar un error 400 y retornar "Solicitud incorrecta. Verifica los datos enviados."', () => {
    http.get('/test').subscribe({
      error: (error: any) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(
          'Solicitud incorrecta. Verifica los datos enviados.'
        );
      },
    });

    const req = httpMock.expectOne('/test');
    req.flush(
      { message: 'Solicitud incorrecta' },
      { status: 400, statusText: 'Bad Request' }
    );
  });

  it('debería interceptar un error 404 y retornar "Recurso no encontrado."', () => {
    http.get('/test').subscribe({
      error: (error: any) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Recurso no encontrado.');
      },
    });

    const req = httpMock.expectOne('/test');
    req.flush(null, { status: 404, statusText: 'Not Found' });
  });
  it('debería manejar errores de conexión y retornar "No hay conexión con el servidor."', () => {
    http.get('/test').subscribe({
      error: (error: any) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('No hay conexión con el servidor.');
      },
    });

    const req = httpMock.expectOne('/test');
    req.error(new ErrorEvent('network error')); // Simula un error de conexión
  });
  it('debería interceptar un error 400 y retornar "Solicitud incorrecta. Verifica los datos enviados."', () => {
    http.get('/test').subscribe({
      error: (error: any) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(
          'Solicitud incorrecta. Verifica los datos enviados.'
        );
      },
    });

    const req = httpMock.expectOne('/test');
    req.flush(null, { status: 400, statusText: 'Bad Request' });
  });

  it('debería interceptar un error 500 y retornar "Error interno del servidor."', () => {
    http.get('/test').subscribe({
      error: (error: any) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Error interno del servidor.');
      },
    });

    const req = httpMock.expectOne('/test');
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  });

  it('debería manejar un error con código 0 y retornar "No hay conexión con el servidor."', () => {
    http.get('/test').subscribe({
      error: (error: any) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('No hay conexión con el servidor.');
      },
    });

    const req = httpMock.expectOne('/test');
    req.flush(null, { status: 0, statusText: 'Unknown Error' }); // 🔹 Simula `status === 0`
  });

  it('debería manejar errores sin mensaje del backend y retornar "Error desconocido en el servidor."', () => {
    http.get('/test').subscribe({
      error: (error: any) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Error desconocido en el servidor.');
      },
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 400, statusText: 'Bad Request' });
  });

  it('debería manejar errores de conexión y retornar "No hay conexión con el servidor."', () => {
    http.get('/test').subscribe({
      error: (error: any) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('No hay conexión con el servidor.');
      },
    });

    const req = httpMock.expectOne('/test');
    req.error(new ErrorEvent('network error'));
  });

  it('debería manejar respuestas con error.message del backend', () => {
    http.get('/test').subscribe({
      error: (error: any) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Mensaje personalizado del backend.');
      },
    });

    const req = httpMock.expectOne('/test');
    req.flush(
      { message: 'Mensaje personalizado del backend.' },
      { status: 400, statusText: 'Bad Request' }
    );
  });

  it('debería manejar cualquier otro error y retornar "Ocurrió un error inesperado."', () => {
    http.get('/test').subscribe({
      error: (error: any) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Ocurrió un error inesperado.');
      },
    });

    const req = httpMock.expectOne('/test');
    req.flush(null, { status: 999, statusText: 'Unknown Error' });
  });
  it('debería manejar un error sin status y retornar "Ocurrió un error inesperado."', () => {
    http.get('/test').subscribe({
      error: (error: any) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Ocurrió un error inesperado.');
      },
    });

    const req = httpMock.expectOne('/test');
    req.flush(null, {}); // Sin status
  });

  it('debería manejar un error con un objeto message en error.error', () => {
    http.get('/test').subscribe({
      error: (error: any) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Mensaje del backend');
      },
    });

    const req = httpMock.expectOne('/test');
    req.flush(
      { message: 'Mensaje del backend' },
      { status: 400, statusText: 'Bad Request' }
    );
  });

  it('debería manejar un error sin mensaje pero con status 500', () => {
    http.get('/test').subscribe({
      error: (error: any) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Error interno del servidor.');
      },
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
  });
});
