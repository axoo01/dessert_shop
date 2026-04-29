import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' 
})
export class UtilityService {
  private readonly TAX_RATE = 0.08; 

 
  calculateTax(amount: number): number {
    return amount * this.TAX_RATE;
  }

 
  formatItemCount(count: number): string {
    return count === 1 ? '1 item' : `${count} items`;
  }
}