import { Injectable } from '@angular/core';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

 
  sortByPrice(products: Product[]): Product[] {
    return [...products].sort((a, b) => a.price - b.price);
  }

  
  filterByCategory(products: Product[], category: string): Product[] {
    return products.filter(p => p.category === category);
  }
}