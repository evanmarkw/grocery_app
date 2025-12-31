import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.interface';
import { Recipe } from '../../models/recipe.interface';
import { ProductService } from '../../services/product.service';
import { RecipeService } from '../../services/recipe.service';

interface Shelf {
  name: string;
  products: Product[];
  quantity: number;
}

interface Aisle {
  name: string;
  shelves: Shelf[];
  totalProducts: number;
}

@Component({
  selector: 'app-product-grid',
  standalone: false,
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.css'
})
export class ProductGridComponent implements OnInit {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  productsByCategory: { [category: string]: Product[] } = {};
  categoryKeys: string[] = [];
  aisles: Aisle[] = [];
  searchTerm: string = '';
  loading = true;
  productRecipes: { [productId: number]: Recipe[] } = {};
  selectedRecipe: Recipe | null = null;
  showRecipeModal = false;

  constructor(
    private productService: ProductService,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadRecipes();
  }

  loadProducts() {
    this.productService.getProductsGroupedByCategory().subscribe({
      next: (groupedProducts) => {
        this.productsByCategory = groupedProducts;
        this.categoryKeys = Object.keys(groupedProducts).sort();
        this.allProducts = Object.values(groupedProducts).flat();
        this.filteredProducts = this.allProducts;
        this.organizeIntoAisles();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
        // Fallback data
        const fallbackProducts = [
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
        this.allProducts = fallbackProducts;
        this.filteredProducts = fallbackProducts;
        this.productsByCategory = this.groupProductsByCategory(fallbackProducts);
        this.categoryKeys = Object.keys(this.productsByCategory);
        this.organizeIntoAisles();
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

  private groupProductsByCategory(products: Product[]): { [category: string]: Product[] } {
    const grouped: { [category: string]: Product[] } = {};
    products.forEach(product => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
    return grouped;
  }

  getFilteredProductsByCategory(): { [category: string]: Product[] } {
    if (!this.searchTerm.trim()) {
      return this.productsByCategory;
    }

    const filtered: { [category: string]: Product[] } = {};
    const searchLower = this.searchTerm.toLowerCase();

    Object.keys(this.productsByCategory).forEach(category => {
      const categoryProducts = this.productsByCategory[category].filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        (product.other_names && product.other_names.some(name =>
          name.toLowerCase().includes(searchLower)
        ))
      );

      if (categoryProducts.length > 0) {
        filtered[category] = categoryProducts;
      }
    });

    return filtered;
  }

  getFilteredCategoryKeys(): string[] {
    const filteredCategories = this.getFilteredProductsByCategory();
    return Object.keys(filteredCategories).sort();
  }

  loadRecipes() {
    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        // Group recipes by product ID
        recipes.forEach(recipe => {
          if (!this.productRecipes[recipe.linked_product_id]) {
            this.productRecipes[recipe.linked_product_id] = [];
          }
          this.productRecipes[recipe.linked_product_id].push(recipe);
        });
      },
      error: (error) => {
        console.error('Error loading recipes:', error);
      }
    });
  }

  hasRecipes(product: Product): boolean {
    return this.productRecipes[product.id] && this.productRecipes[product.id].length > 0;
  }

  getRecipesForProduct(product: Product): Recipe[] {
    return this.productRecipes[product.id] || [];
  }

  showRecipes(product: Product) {
    const recipes = this.getRecipesForProduct(product);
    if (recipes.length === 1) {
      this.selectedRecipe = recipes[0];
      this.showRecipeModal = true;
    } else if (recipes.length > 1) {
      // For multiple recipes, show the first one for now
      // Could be enhanced to show a recipe selection modal
      this.selectedRecipe = recipes[0];
      this.showRecipeModal = true;
    }
  }

  closeRecipeModal() {
    this.showRecipeModal = false;
    this.selectedRecipe = null;
  }

  private organizeIntoAisles() {
    // Define aisle groupings based on product categories
    const aisleMap: { [aisleName: string]: string[] } = {
      'Frozen Foods': ['Frozen Seafood', 'Frozen Food', 'Frozen Poultry', 'Frozen Fruit', 'Frozen Pastry'],
      'Fresh Market': ['Fresh Produce', 'Fresh Seafood', 'Live Seafood'],
      'Pantry & Dry Goods': ['Condiments', 'Instant Noodles', 'Dried Noodles', 'Dried Seafood'],
      'Refrigerated Items': ['Refrigerated', 'Ready-to-Eat'],
      'Health & Beauty': ['Beauty & Personal Care', 'Traditional Medicine'],
      'Desserts & Snacks': ['Desserts']
    };

    this.aisles = [];

    Object.keys(aisleMap).forEach(aisleName => {
      const categoriesInAisle = aisleMap[aisleName];
      const shelves: Shelf[] = [];
      let totalProducts = 0;

      categoriesInAisle.forEach(category => {
        if (this.productsByCategory[category]) {
          const products = this.productsByCategory[category];
          const shelfSize = 4; // Products per shelf

          // Split products into shelves of 4 items each
          for (let i = 0; i < products.length; i += shelfSize) {
            const shelfProducts = products.slice(i, i + shelfSize);
            const shelfNumber = Math.floor(i / shelfSize) + 1;
            const shelfName = products.length <= shelfSize
              ? category
              : `${category} - Shelf ${shelfNumber}`;

            shelves.push({
              name: shelfName,
              products: shelfProducts,
              quantity: shelfProducts.length
            });
            totalProducts += shelfProducts.length;
          }
        }
      });

      if (shelves.length > 0) {
        this.aisles.push({
          name: aisleName,
          shelves: shelves,
          totalProducts: totalProducts
        });
      }
    });
  }

  getFilteredAisles(): Aisle[] {
    if (!this.searchTerm.trim()) {
      return this.aisles;
    }

    const searchLower = this.searchTerm.toLowerCase();
    const filteredAisles: Aisle[] = [];

    this.aisles.forEach(aisle => {
      const filteredShelves: Shelf[] = [];
      let totalProducts = 0;

      aisle.shelves.forEach(shelf => {
        const matchingProducts = shelf.products.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          (product.other_names && product.other_names.some(name =>
            name.toLowerCase().includes(searchLower)
          ))
        );

        if (matchingProducts.length > 0) {
          filteredShelves.push({
            name: shelf.name,
            products: matchingProducts,
            quantity: matchingProducts.length
          });
          totalProducts += matchingProducts.length;
        }
      });

      if (filteredShelves.length > 0) {
        filteredAisles.push({
          name: aisle.name,
          shelves: filteredShelves,
          totalProducts: totalProducts
        });
      }
    });

    return filteredAisles;
  }
}
