import { TestBed } from '@angular/core/testing';

import { FirebasesdataService } from './firebasesdata.service';

describe('FirebasesdataService', () => {
  let service: FirebasesdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebasesdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
