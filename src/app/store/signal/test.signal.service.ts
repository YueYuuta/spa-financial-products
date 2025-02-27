import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Signal } from '@angular/core';
import { NanoStateJC } from './lib.v0.0.2.service';

interface ProductState {
  products: Product[];
  selectProductId: string | null;
  loading: boolean;
  loadingSelect: boolean;
  error: string | null;
  success: string | null;
  addProductSuccess: string | null;
  updateProductSuccess: string | null;
  deleteProductSuccess: string | null;
  addProductError: string | null;
  updateProductError: string | null;
  deleteProductError: string | null;
  user: { name: string; id: number } | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProductStateService {
  private state: NanoStateJC<ProductState>;

  constructor() {
    this.state = NanoStateJC.create<ProductState>({
      products: [],
      selectProductId: null,
      loading: false,
      loadingSelect: false,
      error: null,
      success: null,
      addProductSuccess: null,
      updateProductSuccess: null,
      deleteProductSuccess: null,
      addProductError: null,
      updateProductError: null,
      deleteProductError: null,
      user: null,
    });
  }

  // ✅ Obtener el estado reactivo
  get<K extends keyof ProductState>(key: K): Signal<ProductState[K]> {
    return this.state.modify(key).get();
  }

  // ✅ Modificar valores de manera más intuitiva
  set<K extends keyof ProductState>(key: K, value: ProductState[K]): void {
    this.state.modify(key).set(value);
  }

  // ✅ Agregar un producto sin modificar toda la lista
  addProduct(product: Product) {
    this.state.modify('products').add(product);
  }

  // ✅ Remover un producto por ID
  removeProduct(productId: string) {
    this.state.modify('products').remove((p) => p.id === productId);
  }

  updateProduct(productId: string, updatedProduct: Partial<Product>) {
    this.state.modify('products').update(
      (p: Product) => p.id === productId, // Predicado para encontrar el producto
      (p: Product) => ({
        ...p,
        ...updatedProduct, // Combina el producto original con los cambios
      })
    );
  }

  // ✅ Modificar un valor anidado dentro del usuario
  updateUserName(newName: string) {
    this.state.modify('user').nested('name', newName);
  }

  // ✅ Modificar un valor profundamente anidado
  deepUpdateUserName(newName: string) {
    this.state.modify('user').deep('name', newName);
  }
}
