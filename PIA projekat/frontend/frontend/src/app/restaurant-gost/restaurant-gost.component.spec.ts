import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantGostComponent } from './restaurant-gost.component';

describe('RestaurantGostComponent', () => {
  let component: RestaurantGostComponent;
  let fixture: ComponentFixture<RestaurantGostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestaurantGostComponent]
    });
    fixture = TestBed.createComponent(RestaurantGostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
