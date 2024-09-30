import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsKonobarComponent } from './statistics-konobar.component';

describe('StatisticsKonobarComponent', () => {
  let component: StatisticsKonobarComponent;
  let fixture: ComponentFixture<StatisticsKonobarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticsKonobarComponent]
    });
    fixture = TestBed.createComponent(StatisticsKonobarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
