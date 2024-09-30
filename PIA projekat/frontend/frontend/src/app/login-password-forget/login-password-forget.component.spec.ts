import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPasswordForgetComponent } from './login-password-forget.component';

describe('LoginPasswordForgetComponent', () => {
  let component: LoginPasswordForgetComponent;
  let fixture: ComponentFixture<LoginPasswordForgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPasswordForgetComponent]
    });
    fixture = TestBed.createComponent(LoginPasswordForgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
