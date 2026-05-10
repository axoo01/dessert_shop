import { Component, inject, output } from '@angular/core'; // 👈 Added 'output'
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/product.interface';

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

  onRemoveItem(item: CartItem) {
    this.cartService.updateQuantity(item.name, -item.quantity);
  }

  onConfirmClick() {
    this.confirmOrder.emit();
  }
}