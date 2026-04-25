import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/product.interface';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // 1. The "Source of Truth" - a private signal
  private cartItems = signal<CartItem[]>([]);

  // 2. Public read-only signals for components to "listen" to
  items = this.cartItems.asReadonly();
  
  // 3. Computed signals (automatically update when cartItems change)
  totalItems = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  addToCart(product: Product) {
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

  // cart.service.ts

updateQuantity(productName: string, change: number) {
  this.cartItems.update(prev => {
    return prev.map(item => {
      if (item.name === productName) {
        const newQty = item.quantity + change;
        // If quantity is > 0, return updated item, else return null (to be filtered out)
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter((item): item is CartItem => item !== null); 
    // .filter removes the 'null' items if quantity hit 0
  });
}

  // We'll add updateQuantity and removeFromCart in the next step!
}