import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CartService } from './services/cart.service';
import { OrderConfirmedModalComponent } from './components/order-confirmed-modal/order-confirmed-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    ProductListComponent, 
    ShoppingCartComponent, 
    OrderConfirmedModalComponent 
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dessert-shop';

  
  cartService = inject(CartService);

  
  isModalOpen = signal(false);

  
  handleStartNewOrder() {
    this.isModalOpen.set(false);
    this.cartService.clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}