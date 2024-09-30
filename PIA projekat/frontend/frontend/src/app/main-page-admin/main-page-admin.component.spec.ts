import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageAdminComponent } from './main-page-admin.component';

describe('MainPageAdminComponent', () => {
  let component: MainPageAdminComponent;
  let fixture: ComponentFixture<MainPageAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainPageAdminComponent]
    });
    fixture = TestBed.createComponent(MainPageAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
