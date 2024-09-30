import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageGostComponent } from './main-page-gost.component';

describe('MainPageGostComponent', () => {
  let component: MainPageGostComponent;
  let fixture: ComponentFixture<MainPageGostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainPageGostComponent]
    });
    fixture = TestBed.createComponent(MainPageGostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
