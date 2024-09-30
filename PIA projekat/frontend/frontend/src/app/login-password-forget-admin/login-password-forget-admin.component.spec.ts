import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPasswordForgetAdminComponent } from './login-password-forget-admin.component';

describe('LoginPasswordForgetAdminComponent', () => {
  let component: LoginPasswordForgetAdminComponent;
  let fixture: ComponentFixture<LoginPasswordForgetAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPasswordForgetAdminComponent]
    });
    fixture = TestBed.createComponent(LoginPasswordForgetAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
