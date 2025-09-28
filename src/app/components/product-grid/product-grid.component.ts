import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-grid',
  standalone: false,
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss'
})
export class ProductGridComponent implements OnInit {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  loading = true;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.filteredProducts = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
        this.allProducts = [
          {
            id: 1,
            name: "Frozen Tilapia",
            other_names: ["冷冻鲫鱼"],
            price: 2.98,
            currency: "USD",
            category: "Frozen Seafood",
            promotion: "Until 10/9",
            image_filename: "2_FROZEN_TILAPIA______2_98_TIL_10_9_jpeg.jpg",
            description: "Frozen Tilapia fish"
          },
          {
            id: 2,
            name: "Australia Tangerine",
            other_names: ["澳洲橘子"],
            price: 0.98,
            currency: "USD",
            category: "Fresh Produce",
            unit: "lb",
            image_filename: "3______AUSTRALIA_TANGERINE_0_98_jpeg.jpg",
            description: "Fresh tangerines from Australia"
          }
        ];
        this.filteredProducts = this.allProducts;
      }
    });
  }

  onSearchChange() {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = this.allProducts;
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredProducts = this.allProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        (product.other_names && product.other_names.some(name =>
          name.toLowerCase().includes(searchLower)
        ))
      );
    }
  }

  getImagePath(filename: string): string {
    return `assets/images/${filename}`;
  }

  formatPrice(product: Product): string {
    if (product.price) {
      return `$${product.price.toFixed(2)}`;
    }
    return '';
  }

  hasPromotion(product: Product): boolean {
    return !!product.promotion;
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/placeholder.jpg';
  }
}
