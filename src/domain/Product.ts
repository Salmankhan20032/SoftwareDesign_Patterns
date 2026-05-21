export type ProductCategory = 'electronics' | 'clothing' | 'books' | 'food';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
}
