import { Component, inject } from '@angular/core'; // Removed OnInit
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { ProductItemComponent } from '../product-item/product-item.component';
import { ProductHighlightService } from '../../services/product-highlight.service';
import { map, Observable } from 'rxjs'; // 👈 Added map

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductItemComponent], 
  providers: [ProductHighlightService],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  private dataService = inject(DataService);
  private productService = inject(ProductService);

  // 🛡️ Task 2 & 3: Convert to an Observable stream and apply sorting via 'map'
  products$: Observable<Product[]> = this.dataService.getProducts().pipe(
    map(data => this.productService.sortByPrice(data))
  );
}