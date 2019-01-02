import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DroneMeasurementsComponent } from './drone-measurements.component';

describe('DroneMeasurementsComponent', () => {
  let component: DroneMeasurementsComponent;
  let fixture: ComponentFixture<DroneMeasurementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DroneMeasurementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroneMeasurementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
