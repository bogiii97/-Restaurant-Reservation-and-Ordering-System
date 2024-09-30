import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsGostComponent } from './reservations-gost.component';

describe('ReservationsGostComponent', () => {
  let component: ReservationsGostComponent;
  let fixture: ComponentFixture<ReservationsGostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationsGostComponent]
    });
    fixture = TestBed.createComponent(ReservationsGostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
