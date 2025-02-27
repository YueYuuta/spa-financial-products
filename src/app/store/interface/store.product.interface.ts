import { Product } from '../models';

export interface ProductState {
  products: Product[];
  selectProductId: string | null;
  loading: boolean;
  loadingSelect: boolean;
  error: string | null;
  success: string | null;
  selectedProduct: Product | null;
  addProductSuccess: string | null;
  updateProductSuccess: string | null;
  deleteProductSuccess: string | null;
  addProductError: string | null;
  updateProductError: string | null;
  deleteProductError: string | null;
  selectedProductId: Product | null;
}
