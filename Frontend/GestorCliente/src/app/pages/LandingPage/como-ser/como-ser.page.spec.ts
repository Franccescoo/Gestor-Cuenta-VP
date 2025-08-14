import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComoSerPage } from './como-ser.page';

describe('ComoSerPage', () => {
  let component: ComoSerPage;
  let fixture: ComponentFixture<ComoSerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComoSerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
