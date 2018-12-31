import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUpdateCoreComponent } from './user-update-core.component';

describe('UserUpdateCoreComponent', () => {
  let component: UserUpdateCoreComponent;
  let fixture: ComponentFixture<UserUpdateCoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserUpdateCoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUpdateCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
