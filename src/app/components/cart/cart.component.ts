import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  getImagePath(filename: string): string {
    return `assets/images/${filename}`;
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/placeholder.jpg';
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  getItemTotal(item: CartItem): number {
    return (item.product.price || 0) * item.quantity;
  }

  increaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    }
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.product.id);
  }

  clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }

  getSubtotal(): number {
    return this.cartService.getCartTotal();
  }

  getTax(): number {
    return this.getSubtotal() * 0.08; // 8% tax
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax();
  }

  continueShopping() {
    this.router.navigate(['/']);
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout']);
  }

  viewProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  isEmpty(): boolean {
    return this.cartItems.length === 0;
  }
}
