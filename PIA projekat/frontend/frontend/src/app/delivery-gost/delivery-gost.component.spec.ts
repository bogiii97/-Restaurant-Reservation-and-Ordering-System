import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryGostComponent } from './delivery-gost.component';

describe('DeliveryGostComponent', () => {
  let component: DeliveryGostComponent;
  let fixture: ComponentFixture<DeliveryGostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryGostComponent]
    });
    fixture = TestBed.createComponent(DeliveryGostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
