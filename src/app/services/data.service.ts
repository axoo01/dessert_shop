import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  private dataUrl = 'data.json'; 

  getProducts(): Observable<Product[]> {
    // Simulate a 1.5s network delay
    return this.http.get<Product[]>(this.dataUrl).pipe(
      delay(1500)
    );
  }
}