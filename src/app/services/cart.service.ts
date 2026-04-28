import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/product.interface';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  private cartItems = signal<CartItem[]>([]);

 
  items = this.cartItems.asReadonly();
  
 
  totalItems = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );
  totalPrice = computed(() => 
    this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0)
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
  this.cartItems.set([]); 
}

 
}