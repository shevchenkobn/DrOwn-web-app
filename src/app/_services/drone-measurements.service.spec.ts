import { TestBed } from '@angular/core/testing';

import { DroneMeasurementsService } from './drone-measurements.service';

describe('DroneMeasurementsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DroneMeasurementsService = TestBed.get(DroneMeasurementsService);
    expect(service).toBeTruthy();
  });
});
