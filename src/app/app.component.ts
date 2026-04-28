import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
// 1. Import the Service and the new Modal Component
import { CartService } from './services/cart.service';
import { OrderConfirmedModalComponent } from './components/order-confirmed-modal/order-confirmed-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    ProductListComponent, 
    ShoppingCartComponent, 
    OrderConfirmedModalComponent // 2. Add to imports
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dessert-shop';

  // 3. Inject the Service
  cartService = inject(CartService);

  // 4. Create the visibility state
  isModalOpen = signal(false);

  // 5. Create the reset logic
  handleStartNewOrder() {
    this.isModalOpen.set(false);
    this.cartService.clearCart(); // Resets the cart items to []
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}