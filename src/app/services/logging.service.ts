import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  logAction(action: string, data?: any) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ACTION: ${action}`, data || '');
  }

  logError(message: string) {
    console.error(`[ERROR]: ${message}`);
  }
}