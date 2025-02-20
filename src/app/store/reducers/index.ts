import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { productReducer, ProductState } from '../reducers/product.reducer';
import { storeFreeze } from 'ngrx-store-freeze';

// Definir la interfaz del estado global
export interface AppState {
  products: ProductState;
}

// Mapa de reducers
export const reducers: ActionReducerMap<AppState> = {
  products: productReducer,
};

// MetaReducers (opcional)
export const metaReducers: MetaReducer<AppState>[] = isDevMode()
  ? [storeFreeze]
  : [];
