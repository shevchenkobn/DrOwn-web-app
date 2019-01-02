import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DroneOrdersComponent } from './drone-orders.component';

describe('DroneOrdersComponent', () => {
  let component: DroneOrdersComponent;
  let fixture: ComponentFixture<DroneOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DroneOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroneOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
