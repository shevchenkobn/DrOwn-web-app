import { TestBed } from '@angular/core/testing';

import { DroneOrdersService } from './drone-orders.service';

describe('DroneOrdersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DroneOrdersService = TestBed.get(DroneOrdersService);
    expect(service).toBeTruthy();
  });
});
