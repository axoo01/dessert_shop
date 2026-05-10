import { Component, inject, DestroyRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms'; 
import { DataService } from '../../services/data.service';
import { ProductService } from '../../services/product.service';
import { LoggingService } from '../../services/logging.service';
import { ProductItemComponent } from '../product-item/product-item.component';
import { ProductHighlightService } from '../../services/product-highlight.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  imports: [CommonModule, ProductItemComponent, ReactiveFormsModule], 
  providers: [ProductHighlightService],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  private dataService = inject(DataService);
  private productService = inject(ProductService);
  private loggingService = inject(LoggingService);
  private destroyRef = inject(DestroyRef);


  constructor() {
   
    this.products$.pipe(
      takeUntilDestroyed(this.destroyRef) 
    ).subscribe(products => {
      console.log(`UI Updated with ${products.length} products`);
    });
  }

  
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
    
    tap(() => this.errorSubject.next(null)), 
    catchError(err => {
      this.loggingService.logError('Failed to load products');
      this.errorSubject.next('We couldn’t load the desserts. Please try again later.');
      return of([]); 
    })
  ),
  this.searchTerm$
]).pipe(
  map(([products, term]) => {
    
    
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(term.toLowerCase())
    );
    return this.productService.sortByPrice(filtered);
  })
);
}