import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DroneMeasurementsDeleteDialogComponent } from './drone-measurements-delete-dialog.component';

describe('DroneMeasurementsDeleteDialogComponent', () => {
  let component: DroneMeasurementsDeleteDialogComponent;
  let fixture: ComponentFixture<DroneMeasurementsDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DroneMeasurementsDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroneMeasurementsDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
