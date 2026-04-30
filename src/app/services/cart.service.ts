import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { CartItem } from '../models/product.interface';
import { Product } from '../models/product.interface';
import { LoggingService } from './logging.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private utilityService = inject(UtilityService);
  private loggingService = inject(LoggingService);
  private cartItems = signal<CartItem[]>(this.loadCart());

  constructor() {
    effect(() => {
      localStorage.setItem('dessert_cart', JSON.stringify(this.cartItems()));
      this.loggingService.logAction('Cart persisted to LocalStorage');
    });
  }

 
  items = this.cartItems.asReadonly();
  
  taxAmount = computed(() => 
    this.utilityService.calculateTax(this.totalPrice())
  );
 
  grandTotal = computed(() => 
    this.totalPrice() + this.taxAmount()
  );

  totalItems = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );
  totalPrice = computed(() => 
    this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0)
  );

  private loadCart(): CartItem[] {
    const saved = localStorage.getItem('dessert_cart');
    return saved ? JSON.parse(saved) : [];
  }

  addToCart(product: Product) {
    this.loggingService.logAction('Adding to cart', product.name);
    this.cartItems.update(prev => {
      const existing = prev.find(i => i.name === product.name);
      if (existing) {
        return prev.map(i => i.name === product.name 
          ? { ...i, quantity: i.quantity + 1 } 
          : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }



updateQuantity(productName: string, change: number) {
  this.cartItems.update(prev => {
    return prev.map(item => {
      if (item.name === productName) {
        const newQty = item.quantity + change;
       
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter((item): item is CartItem => item !== null); 
    
  });
}

clearCart() {
  this.loggingService.logAction('Clearing cart');
  this.cartItems.set([]); 
}

 
}