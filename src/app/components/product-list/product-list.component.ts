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
  tap,
  catchError, 
  of,         
  Subject
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

  
  private errorSubject = new Subject<string | null>();
  error$ = this.errorSubject.asObservable();

  searchControl = new FormControl('', { nonNullable: true });

  private searchTerm$ = this.searchControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    startWith('')
  );

  products$: Observable<any[]> = combineLatest([
    this.dataService.getProducts().pipe(
      catchError(err => {
        this.loggingService.logError('Failed to load products');
        this.errorSubject.next('We couldn’t load the desserts. Please try again later.');
        return of([]); 
      })
    ),
    this.searchTerm$
  ]).pipe(
    map(([products, term]) => {
      this.errorSubject.next(null); 
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(term.toLowerCase())
      );
      return this.productService.sortByPrice(filtered);
    })
  );
}