import { TestBed } from '@angular/core/testing';

import { ProductHighlightService } from './product-highlight.service';

describe('ProductHighlightService', () => {
  let service: ProductHighlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductHighlightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
