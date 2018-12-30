import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateCoreComponent } from './user-create-core.component';

describe('UserCreateCoreComponent', () => {
  let component: UserCreateCoreComponent;
  let fixture: ComponentFixture<UserCreateCoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCreateCoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreateCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
