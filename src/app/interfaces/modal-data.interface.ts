import { Product } from '../store/models';

export interface ModalData {
  title: string;
  description?: string;
  additionalInfo?: string; // Campo opcional
  product: Product;
}
