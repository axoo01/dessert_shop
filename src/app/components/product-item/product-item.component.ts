import { Component, Input } from '@angular/core'; // 1. Import Input
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.interface'; // 2. Import our Interface

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {
  
  @Input({ required: true }) product!: Product; 
}