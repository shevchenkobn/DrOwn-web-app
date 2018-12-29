import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePasswordChangeComponent } from './profile-password-change.component';

describe('ProfilePasswordChangeComponent', () => {
  let component: ProfilePasswordChangeComponent;
  let fixture: ComponentFixture<ProfilePasswordChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePasswordChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePasswordChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
