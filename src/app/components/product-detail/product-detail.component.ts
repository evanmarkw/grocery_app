import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product.interface';
import { Recipe } from '../../models/recipe.interface';
import { ProductService } from '../../services/product.service';
import { RecipeService } from '../../services/recipe.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  recipes: Recipe[] = [];
  quantity: number = 1;
  loading: boolean = true;
  selectedRecipe: Recipe | null = null;
  showRecipeModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private recipeService: RecipeService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(+productId);
      this.loadRecipes(+productId);
    } else {
      this.loading = false;
    }
  }

  loadProduct(id: number) {
    this.productService.getProductsGroupedByCategory().subscribe({
      next: (groupedProducts) => {
        const allProducts = Object.values(groupedProducts).flat();
        this.product = allProducts.find(p => p.id === id) || null;
        this.loading = false;

        if (!this.product) {
          console.error('Product not found');
        }
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
      }
    });
  }

  loadRecipes(productId: number) {
    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes.filter(r => r.linked_product_id === productId);
      },
      error: (error) => {
        console.error('Error loading recipes:', error);
      }
    });
  }

  getImagePath(filename: string): string {
    return `assets/images/${filename}`;
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/placeholder.jpg';
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      alert(`Added ${this.quantity} ${this.product.name} to cart!`);
      // Optionally navigate to cart or show a success message
      // this.router.navigate(['/cart']);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  hasRecipes(): boolean {
    return this.recipes.length > 0;
  }

  showRecipes() {
    if (this.recipes.length > 0) {
      this.selectedRecipe = this.recipes[0];
      this.showRecipeModal = true;
    }
  }

  closeRecipeModal() {
    this.showRecipeModal = false;
    this.selectedRecipe = null;
  }

  getTotalPrice(): string {
    if (this.product && this.product.price) {
      return this.formatPrice(this.product.price * this.quantity);
    }
    return '$0.00';
  }
}
