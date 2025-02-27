import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { productReducer } from '../reducers/product.reducer';
import { storeFreeze } from 'ngrx-store-freeze';
import { ProductState } from '../../interface/store.product.interface';

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
