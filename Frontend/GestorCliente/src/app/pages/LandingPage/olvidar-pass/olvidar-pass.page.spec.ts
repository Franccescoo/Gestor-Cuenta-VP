import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OlvidarPassPage } from './olvidar-pass.page';

describe('OlvidarPassPage', () => {
  let component: OlvidarPassPage;
  let fixture: ComponentFixture<OlvidarPassPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OlvidarPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
