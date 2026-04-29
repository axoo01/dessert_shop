import { Injectable, signal } from '@angular/core';

@Injectable() 
export class ProductHighlightService {
  highlightedProductName = signal<string | null>(null);

  setHighlight(name: string | null) {
    this.highlightedProductName.set(name);
  }
}