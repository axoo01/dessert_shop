import { Component, Input, inject, computed } from '@angular/core'; // 1. Import Input
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.interface'; // 2. Import our Interface
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
    console.log('✅ Clicked Add to Cart for:', this.product.name);
    this.cartService.addToCart(this.product);
  }

  // Inside ProductItemComponent class
onDecrement() {
  if (this.cartItem()) {
    this.cartService.updateQuantity(this.product.name, -1);
  }
}
}