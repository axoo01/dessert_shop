import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
  BehaviorSubject,
  finalize,
  shareReplay
 
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

  private errorSubject = new BehaviorSubject<string | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(true);

 
  searchControl = new FormControl('', { nonNullable: true });

  private searchTerm$ = this.searchControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    startWith('')
  );

  
  private productsData$ = this.dataService.getProducts().pipe(
    tap(() => this.errorSubject.next(null)), 
    catchError(err => {
      this.loggingService.logError('Data Fetch Failed');
      this.errorSubject.next('We couldn’t load the desserts. Please try again later.');
      return of([]);
    }),
    finalize(() => this.loadingSubject.next(false)),
    shareReplay(1) 
  );

  
  products$: Observable<any[]> = combineLatest([
    this.productsData$.pipe(
    
      startWith([]) 
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

  
  vm$ = combineLatest({
    products: this.products$,
    loading: this.loadingSubject.asObservable(),
    error: this.errorSubject.asObservable()
  });

}