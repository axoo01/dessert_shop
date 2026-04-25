import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  // Inject the service to access our signals
  cartService = inject(CartService);

  onRemoveItem(productName: string) {
    // We'll use the negative of the item's current quantity to remove it entirely
    const item = this.cartService.items().find(i => i.name === productName);
    if (item) {
      this.cartService.updateQuantity(productName, -item.quantity);
    }
  }
}