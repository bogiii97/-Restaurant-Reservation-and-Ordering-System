import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageKonobarComponent } from './main-page-konobar.component';

describe('MainPageKonobarComponent', () => {
  let component: MainPageKonobarComponent;
  let fixture: ComponentFixture<MainPageKonobarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainPageKonobarComponent]
    });
    fixture = TestBed.createComponent(MainPageKonobarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
