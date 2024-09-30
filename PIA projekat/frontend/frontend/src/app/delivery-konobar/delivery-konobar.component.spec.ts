import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryKonobarComponent } from './delivery-konobar.component';

describe('DeliveryKonobarComponent', () => {
  let component: DeliveryKonobarComponent;
  let fixture: ComponentFixture<DeliveryKonobarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryKonobarComponent]
    });
    fixture = TestBed.createComponent(DeliveryKonobarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
