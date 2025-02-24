import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { reducers, metaReducers } from './store/reducers';
import { provideEffects } from '@ngrx/effects';
import { ProductEffects } from './store/affects/product.effect';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { PRODUCT_STORE } from './services/product.store.interface';
import { ProductNgrxService } from './services/product.ngrx.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: PRODUCT_STORE, useClass: ProductNgrxService },
    provideHttpClient(withInterceptorsFromDi()),

    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    provideStore(reducers, { metaReducers }),
    provideEffects(ProductEffects),
  ],
};
