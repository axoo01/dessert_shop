import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartItem } from '../../models/product.interface';

@Component({
  selector: 'app-order-confirmed-modal',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './order-confirmed-modal.component.html',
  styleUrl: './order-confirmed-modal.component.scss'
})
export class OrderConfirmedModalComponent {
  
  items = input.required<CartItem[]>();
  total = input.required<number>();
  
  
  startNewOrder = output<void>();

  onButtonClick() {
    this.startNewOrder.emit();
  }
}