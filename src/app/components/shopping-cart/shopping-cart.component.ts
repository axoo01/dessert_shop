import { Component, inject, output } from '@angular/core'; // 👈 Added 'output'
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
  cartService = inject(CartService);

  confirmOrder = output<void>(); 

  onRemoveItem(productName: string) {
    const item = this.cartService.items().find(i => i.name === productName);
    if (item) {
      this.cartService.updateQuantity(productName, -item.quantity);
    }
  }

  onConfirmClick() {
    this.confirmOrder.emit();
  }
}