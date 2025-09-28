export interface Product {
  id: number;
  name: string;
  other_names?: string[];
  price?: number;
  currency?: string;
  category: string;
  promotion?: string;
  promotion_end?: string;
  promotion_start?: string;
  unit?: string;
  package_size?: string;
  image_filename: string;
  description: string;
  original_price?: number;
  color?: string;
}

export interface ProductData {
  scraped_date: string;
  source: string;
  total_products: number;
  products: Product[];
}