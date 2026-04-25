import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Product } from '../../models/product.interface';
import { ProductItemComponent } from '../product-item/product-item.component'

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductItemComponent], // Import ProductItem here!
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private dataService = inject(DataService);
  products: Product[] = [];

  ngOnInit(): void {
    this.dataService.getProducts().subscribe(data => {
      this.products = data;
    });
  }
}