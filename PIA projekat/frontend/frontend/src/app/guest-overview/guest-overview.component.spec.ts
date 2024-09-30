import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestOverviewComponent } from './guest-overview.component';

describe('GuestOverviewComponent', () => {
  let component: GuestOverviewComponent;
  let fixture: ComponentFixture<GuestOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuestOverviewComponent]
    });
    fixture = TestBed.createComponent(GuestOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
