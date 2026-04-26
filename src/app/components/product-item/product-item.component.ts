import { Component, Input, inject, computed } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.interface'; 
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {
  
  @Input({ required: true }) product!: Product; 

  private cartService = inject(CartService);

  cartItem = computed(() => 
    this.cartService.items().find(i => i.name === this.product.name)
  );

  onAddToCart() {
    this.cartService.addToCart(this.product);
  }

 
onDecrement() {
  if (this.cartItem()) {
    this.cartService.updateQuantity(this.product.name, -1);
  }
}
}