import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestGiftFollowComponent } from './request-gift-follow.component';

describe('RequestGiftFollowComponent', () => {
  let component: RequestGiftFollowComponent;
  let fixture: ComponentFixture<RequestGiftFollowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestGiftFollowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestGiftFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
