import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialCanjesPage } from './historial-canjes.page';

describe('HistorialCanjesPage', () => {
  let component: HistorialCanjesPage;
  let fixture: ComponentFixture<HistorialCanjesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialCanjesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
