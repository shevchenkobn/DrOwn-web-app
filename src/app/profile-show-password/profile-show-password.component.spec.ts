import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileShowPasswordComponent } from './profile-show-password.component';

describe('ProfileShowPasswordComponent', () => {
  let component: ProfileShowPasswordComponent;
  let fixture: ComponentFixture<ProfileShowPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileShowPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileShowPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
