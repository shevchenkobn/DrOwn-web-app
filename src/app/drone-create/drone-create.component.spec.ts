import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DroneCreateComponent } from './drone-create.component';

describe('DroneCreateComponent', () => {
  let component: DroneCreateComponent;
  let fixture: ComponentFixture<DroneCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DroneCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroneCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
