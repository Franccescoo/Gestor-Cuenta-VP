import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClubVipPage } from './club-vip.page';

describe('ClubVipPage', () => {
  let component: ClubVipPage;
  let fixture: ComponentFixture<ClubVipPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubVipPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
