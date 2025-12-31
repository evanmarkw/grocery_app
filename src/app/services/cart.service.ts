import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.interface';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'shopping_cart';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.loadCartFromStorage());
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor() {}

  private loadCartFromStorage(): CartItem[] {
    try {
      const cartData = localStorage.getItem(this.CART_STORAGE_KEY);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return [];
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.getCartItems();
    const existingItemIndex = currentCart.findIndex(item => item.product.id === product.id);

    if (existingItemIndex > -1) {
      // Update quantity if product already in cart
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      currentCart.push({ product, quantity });
    }

    this.cartItemsSubject.next(currentCart);
    this.saveCartToStorage(currentCart);
  }

  removeFromCart(productId: number): void {
    const currentCart = this.getCartItems().filter(item => item.product.id !== productId);
    this.cartItemsSubject.next(currentCart);
    this.saveCartToStorage(currentCart);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentCart = this.getCartItems();
    const itemIndex = currentCart.findIndex(item => item.product.id === productId);

    if (itemIndex > -1) {
      currentCart[itemIndex].quantity = quantity;
      this.cartItemsSubject.next(currentCart);
      this.saveCartToStorage(currentCart);
    }
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.saveCartToStorage([]);
  }

  getCartItemCount(): number {
    return this.getCartItems().reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal(): number {
    return this.getCartItems().reduce((total, item) => {
      const price = item.product.price || 0;
      return total + (price * item.quantity);
    }, 0);
  }

  isInCart(productId: number): boolean {
    return this.getCartItems().some(item => item.product.id === productId);
  }

  getCartItemQuantity(productId: number): number {
    const item = this.getCartItems().find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }
}
