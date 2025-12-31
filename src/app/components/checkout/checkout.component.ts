import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PaymentInfo {
  method: string;
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  currentStep: number = 1;

  shippingInfo: ShippingInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  };

  paymentInfo: PaymentInfo = {
    method: 'credit-card'
  };

  paymentMethods = [
    { label: 'Credit Card', value: 'credit-card', icon: 'pi-credit-card' },
    { label: 'Debit Card', value: 'debit-card', icon: 'pi-credit-card' },
    { label: 'PayPal', value: 'paypal', icon: 'pi-paypal' },
    { label: 'Cash on Delivery', value: 'cod', icon: 'pi-money-bill' }
  ];

  usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  orderPlaced: boolean = false;
  orderNumber: string = '';

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  loadCart() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      if (items.length === 0 && !this.orderPlaced) {
        this.router.navigate(['/cart']);
      }
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

  getSubtotal(): number {
    return this.cartService.getCartTotal();
  }

  getTax(): number {
    return this.getSubtotal() * 0.08;
  }

  getShipping(): number {
    return this.getSubtotal() >= 50 ? 0 : 5.99;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax() + this.getShipping();
  }

  nextStep() {
    if (this.currentStep === 1 && this.validateShippingInfo()) {
      this.currentStep = 2;
    } else if (this.currentStep === 2 && this.validatePaymentInfo()) {
      this.currentStep = 3;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateShippingInfo(): boolean {
    const required = [
      this.shippingInfo.firstName,
      this.shippingInfo.lastName,
      this.shippingInfo.email,
      this.shippingInfo.phone,
      this.shippingInfo.address,
      this.shippingInfo.city,
      this.shippingInfo.state,
      this.shippingInfo.zipCode
    ];

    const allFilled = required.every(field => field && field.trim() !== '');

    if (!allFilled) {
      alert('Please fill in all shipping information fields');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.shippingInfo.email)) {
      alert('Please enter a valid email address');
      return false;
    }

    return true;
  }

  validatePaymentInfo(): boolean {
    if (this.paymentInfo.method === 'credit-card' || this.paymentInfo.method === 'debit-card') {
      const required = [
        this.paymentInfo.cardNumber,
        this.paymentInfo.cardName,
        this.paymentInfo.expiryDate,
        this.paymentInfo.cvv
      ];

      const allFilled = required.every(field => field && field.trim() !== '');

      if (!allFilled) {
        alert('Please fill in all payment information fields');
        return false;
      }
    }

    return true;
  }

  placeOrder() {
    if (!this.validateShippingInfo() || !this.validatePaymentInfo()) {
      return;
    }

    // Generate order number
    this.orderNumber = 'ORD-' + Date.now().toString().slice(-8);

    // Simulate order placement
    console.log('Order placed:', {
      orderNumber: this.orderNumber,
      shipping: this.shippingInfo,
      payment: this.paymentInfo,
      items: this.cartItems,
      total: this.getTotal()
    });

    this.orderPlaced = true;

    // Clear cart after order
    this.cartService.clearCart();
  }

  continueShopping() {
    this.router.navigate(['/']);
  }

  backToCart() {
    this.router.navigate(['/cart']);
  }

  isCardPayment(): boolean {
    return this.paymentInfo.method === 'credit-card' || this.paymentInfo.method === 'debit-card';
  }

  getPaymentMethodLabel(): string {
    const method = this.paymentMethods.find(m => m.value === this.paymentInfo.method);
    return method ? method.label : '';
  }

  getFreeShippingRemaining(): string {
    const remaining = 50 - this.getSubtotal();
    return remaining > 0 ? remaining.toFixed(2) : '0.00';
  }
}
