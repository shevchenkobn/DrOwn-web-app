import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DroneUpdateComponent } from './drone-update.component';

describe('DroneUpdateComponent', () => {
  let component: DroneUpdateComponent;
  let fixture: ComponentFixture<DroneUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DroneUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroneUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
