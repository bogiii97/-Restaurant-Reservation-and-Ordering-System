import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationRequestsComponent } from './registration-requests.component';

describe('RegistrationRequestsComponent', () => {
  let component: RegistrationRequestsComponent;
  let fixture: ComponentFixture<RegistrationRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationRequestsComponent]
    });
    fixture = TestBed.createComponent(RegistrationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
