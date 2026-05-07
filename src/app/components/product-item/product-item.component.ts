import { Component, Input, inject, computed } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.interface'; 
import { CartService } from '../../services/cart.service';
// 1. Import the service
import { ProductHighlightService } from '../../services/product-highlight.service';

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

  private highlightService = inject(ProductHighlightService);

  isHighlighted = computed(() => 
    this.highlightService.highlightedProductName() === this.product.name
  );

  cartItem = computed(() => 
    this.cartService.items().find(i => i.name === this.product.name)
  );

  
  onMouseEnter() {
    this.highlightService.setHighlight(this.product.name);
  }

  onMouseLeave() {
    this.highlightService.setHighlight(null);
  }

  onAddToCart() {
    this.cartService.addToCart(this.product);
  }

  onDecrement() {
    if (this.cartItem()) {
      this.cartService.updateQuantity(this.product.name, -1);
    }
  }
}