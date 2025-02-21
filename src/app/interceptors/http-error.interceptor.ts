import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocurrió un error inesperado.';

        // ✅ Extraer mensaje del backend si existe
        if (error.error && typeof error.error === 'object') {
          errorMessage =
            error.error.message || 'Error desconocido en el servidor.';
        } else if (error.status === 0) {
          errorMessage = 'No hay conexión con el servidor.';
        } else if (error.status === 400) {
          errorMessage = 'Solicitud incorrecta. Verifica los datos enviados.';
        } else if (error.status === 404) {
          errorMessage = 'Recurso no encontrado.';
        } else if (error.status === 500) {
          errorMessage = 'Error interno del servidor.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
