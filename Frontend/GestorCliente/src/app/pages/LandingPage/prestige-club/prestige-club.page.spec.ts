import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrestigeClubPage } from './prestige-club.page';

describe('PrestigeClubPage', () => {
  let component: PrestigeClubPage;
  let fixture: ComponentFixture<PrestigeClubPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestigeClubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
