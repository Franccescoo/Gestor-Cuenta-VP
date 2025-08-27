import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerificarCuentaPage } from './verificar-cuenta.page';

describe('VerificarCuentaPage', () => {
  let component: VerificarCuentaPage;
  let fixture: ComponentFixture<VerificarCuentaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificarCuentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
