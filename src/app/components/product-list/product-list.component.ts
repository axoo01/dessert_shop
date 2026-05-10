import { Component, inject, DestroyRef } from '@angular/core'; // 👈 Added DestroyRef for Task 7
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms'; // 👈 Task 4: Forms
import { DataService } from '../../services/data.service';
import { ProductService } from '../../services/product.service';
import { LoggingService } from '../../services/logging.service';
import { ProductItemComponent } from '../product-item/product-item.component';
import { ProductHighlightService } from '../../services/product-highlight.service';
import { 
  map, 
  Observable, 
  combineLatest, 
  startWith, 
  debounceTime, 
  distinctUntilChanged, 
  tap 
} from 'rxjs'; 

@Component({
  selector: 'app-product-list',
  standalone: true,
  // 🛡️ Added ReactiveFormsModule for the search input
  imports: [CommonModule, ProductItemComponent, ReactiveFormsModule], 
  providers: [ProductHighlightService],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  private dataService = inject(DataService);
  private productService = inject(ProductService);
  private loggingService = inject(LoggingService);

  // 🛡️ Task 4: Reactive User Input
  searchControl = new FormControl('', { nonNullable: true });

  // 🛡️ Task 3 & 4: Creating the Search Stream
  private searchTerm$: Observable<string> = this.searchControl.valueChanges.pipe(
    debounceTime(300), // Wait for user to pause
    distinctUntilChanged(), // Only if search changed
    startWith(''), // Initial state: no filter
    tap(term => this.loggingService.logAction('Search Term Changed', term)) // Task 3: tap
  );

  // 🛡️ Task 5: Combining Multiple Streams
  products$: Observable<any[]> = combineLatest([
    this.dataService.getProducts(),
    this.searchTerm$
  ]).pipe(
    map(([products, term]) => {
      // First, filter by name
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(term.toLowerCase())
      );
      // Second, sort by price (using your ProductService method)
      return this.productService.sortByPrice(filtered);
    }),
    tap(results => this.loggingService.logAction('Filtered Results count', results.length))
  );
}