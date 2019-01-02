import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DroneOrdersCreateComponent } from './drone-orders-create.component';

describe('DroneOrdersCreateComponent', () => {
  let component: DroneOrdersCreateComponent;
  let fixture: ComponentFixture<DroneOrdersCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DroneOrdersCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroneOrdersCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
