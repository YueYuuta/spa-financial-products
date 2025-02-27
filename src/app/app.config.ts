import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
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
import { reducers, metaReducers } from './store/ngrx/reducers';
import { provideEffects } from '@ngrx/effects';
import { ProductEffects } from './store/ngrx/affects/product.effect';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { PRODUCT_STORE } from './services/product.store.interface';
import { ProductNgrxService } from './services/product.ngrx.service';
import { ProductSignalService } from './services/product.signal.service';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: PRODUCT_STORE, useClass: ProductSignalService },
    provideHttpClient(withInterceptorsFromDi()),

    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    provideStore(reducers, { metaReducers }),
    provideEffects(ProductEffects),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      // autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      // trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      // traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      // connectInZone: true, // If set to true, the connection is established within the Angular zone
    }),
  ],
};
