import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterOverviewComponent } from './waiter-overview.component';

describe('WaiterOverviewComponent', () => {
  let component: WaiterOverviewComponent;
  let fixture: ComponentFixture<WaiterOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaiterOverviewComponent]
    });
    fixture = TestBed.createComponent(WaiterOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
