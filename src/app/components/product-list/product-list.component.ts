import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { ProductItemComponent } from '../product-item/product-item.component'
import { ProductHighlightService } from '../../services/product-highlight.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductItemComponent], 
  providers: [ProductHighlightService],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private dataService = inject(DataService);
  products: Product[] = [];
  private productService = inject(ProductService);

  ngOnInit(): void {
    this.dataService.getProducts().subscribe(data => {
      this.products = this.productService.sortByPrice(data);
    });
  }
} 