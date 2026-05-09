import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs'; // 👈 Essential RxJS imports
import { CartItem, Product } from '../models/product.interface';
import { LoggingService } from './logging.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private loggingService = inject(LoggingService);
  private utilityService = inject(UtilityService);

  // 🛡️ Task 6: BehaviorSubject maintains the "latest value" of the cart
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.loadCart());

  // 🛡️ Task 2: Expose as Observable for components to consume
  cartItems$ = this.cartItemsSubject.asObservable();

  // 🛡️ Reactive Derived State: Replacing 'computed' with 'pipe(map)'
  totalItems$ = this.cartItems$.pipe(
    map(items => items.reduce((acc, item) => acc + item.quantity, 0))
  );

  totalPrice$ = this.cartItems$.pipe(
    map(items => items.reduce((acc, item) => acc + (item.price * item.quantity), 0))
  );

  taxAmount$ = this.totalPrice$.pipe(
    map(total => this.utilityService.calculateTax(total))
  );

  grandTotal$ = this.totalPrice$.pipe(
    map(total => total + this.utilityService.calculateTax(total))
  );

  constructor() {
    // 🛡️ Manual Subscription for persistence (Service Lifecycle)
    this.cartItems$.subscribe(items => {
      localStorage.setItem('dessert_cart', JSON.stringify(items));
      this.loggingService.logAction('Cart persisted via RxJS Stream');
    });
  }

  private loadCart(): CartItem[] {
    const saved = localStorage.getItem('dessert_cart');
    return saved ? JSON.parse(saved) : [];
  }

  addToCart(product: Product) {
    const currentItems = this.cartItemsSubject.value; // Get the "now" value
    const existing = currentItems.find(i => i.name === product.name);
    
    let updatedItems: CartItem[];
    if (existing) {
      updatedItems = currentItems.map(i => i.name === product.name 
        ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updatedItems = [...currentItems, { ...product, quantity: 1 }];
    }

    this.cartItemsSubject.next(updatedItems); // 👈 Broadcast the new state
    this.loggingService.logAction('Added to cart', product.name);
  }

  updateQuantity(productName: string, change: number) {
    const updatedItems = this.cartItemsSubject.value
      .map(item => {
        if (item.name === productName) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);

    this.cartItemsSubject.next(updatedItems);
  }

  clearCart() {
    this.cartItemsSubject.next([]);
    this.loggingService.logAction('Clearing cart');
  }
}