import { Injectable, signal, computed } from '@angular/core';

import { ProductService } from '../services/product.service';
import { Product } from '../interfaces';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductSignalStore {
  constructor(private productService: ProductService) {}

  // Estado
  products = signal<Product[]>([]);
  selectProductId = signal<string | null>(null);
  loading = signal<boolean>(false);
  loadingSelect = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  addProductSuccess = signal<string | null>(null);
  updateProductSuccess = signal<string | null>(null);
  deleteProductSuccess = signal<string | null>(null);
  addProductError = signal<string | null>(null);
  updateProductError = signal<string | null>(null);
  deleteProductError = signal<string | null>(null);

  // Estado derivado: Producto seleccionado
  selectedProduct = computed(() => {
    const id = this.selectProductId();
    return this.products().find((p) => p.id === id) || null;
  });
  setSelectedProductId(id: string | null) {
    this.selectProductId.set(id);
  }

  // 🚀 Cargar productos desde la API
  async loadProducts() {
    this.loading.set(true);
    this.resetMessages();
    try {
      const response = await firstValueFrom(this.productService.getProducts());
      if (response.data.length !== 0) {
        this.products.set(response.data);
      }

      this.success.set('Productos cargados correctamente');
    } catch (error) {
      this.error.set('Error al cargar productos');
    } finally {
      this.loading.set(false);
    }
  }

  // 🏷️ Seleccionar un producto por ID
  async selectProductById(id: string) {
    this.loadingSelect.set(true);
    this.resetMessages();
    try {
      const exists = await this.productService.verifyProduct(id).toPromise();
      if (exists) {
        const product = this.products().find((p) => p.id === id);
        if (product) {
          this.selectProductId.set(id);
        } else {
          this.error.set('El producto no está disponible en el sistema.');
        }
      } else {
        this.error.set('El ID no existe.');
      }
    } catch (error) {
      this.error.set('Error verificando el ID.');
    } finally {
      this.loadingSelect.set(false);
    }
  }

  // ➕ Agregar producto
  async addProduct(product: Product) {
    this.loading.set(true);
    this.resetMessages();
    try {
      const response = await firstValueFrom(
        this.productService.createProduct(product)
      );

      this.products.update((products) => [...products, response.data]);
      this.addProductSuccess.set('Producto agregado con éxito');
    } catch (error) {
      this.addProductError.set('Error al agregar el producto');
    } finally {
      this.loading.set(false);
    }
  }

  // 🔄 Actualizar producto
  async updateProduct(updatedProduct: Product) {
    this.loading.set(true);
    this.resetMessages();
    try {
      const response = await firstValueFrom(
        this.productService.updateProduct(updatedProduct.id, updatedProduct)
      );

      this.products.update((products) =>
        products.map((p) => (p.id === updatedProduct.id ? response.data : p))
      );
      this.updateProductSuccess.set('Producto actualizado con éxito');
    } catch (error) {
      this.updateProductError.set('Error al actualizar el producto');
    } finally {
      this.loading.set(false);
    }
  }

  // 🗑️ Eliminar producto
  async deleteProduct(productId: string) {
    this.loading.set(true);
    this.resetMessages();
    try {
      await this.productService.deleteProduct(productId).toPromise();
      this.products.update((products) =>
        products.filter((p) => p.id !== productId)
      );
      this.deleteProductSuccess.set('Producto eliminado con éxito');
    } catch (error) {
      this.deleteProductError.set('Error al eliminar el producto');
    } finally {
      this.loading.set(false);
    }
  }

  // 🔄 Resetear mensajes de éxito/error
  resetMessages() {
    this.addProductSuccess.set(null);
    this.updateProductSuccess.set(null);
    this.deleteProductSuccess.set(null);
    this.addProductError.set(null);
    this.updateProductError.set(null);
    this.deleteProductError.set(null);
  }
}
