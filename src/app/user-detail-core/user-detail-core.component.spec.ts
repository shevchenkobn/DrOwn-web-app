import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailCoreComponent } from './user-detail-core.component';

describe('UserDetailCoreComponent', () => {
  let component: UserDetailCoreComponent;
  let fixture: ComponentFixture<UserDetailCoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDetailCoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
