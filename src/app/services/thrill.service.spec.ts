import { TestBed } from '@angular/core/testing';

import { ThrillService } from './thrill.service';

describe('ThrillService', () => {
  let service: ThrillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThrillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
