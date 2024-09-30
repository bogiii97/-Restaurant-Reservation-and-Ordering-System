import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsKonobarComponent } from './reservations-konobar.component';

describe('ReservationsKonobarComponent', () => {
  let component: ReservationsKonobarComponent;
  let fixture: ComponentFixture<ReservationsKonobarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationsKonobarComponent]
    });
    fixture = TestBed.createComponent(ReservationsKonobarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
