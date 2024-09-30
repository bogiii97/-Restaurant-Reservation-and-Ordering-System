import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantsGostComponent } from './restaurants-gost.component';

describe('RestaurantsGostComponent', () => {
  let component: RestaurantsGostComponent;
  let fixture: ComponentFixture<RestaurantsGostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestaurantsGostComponent]
    });
    fixture = TestBed.createComponent(RestaurantsGostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
