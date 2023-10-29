import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestGiftViewComponent } from './request-gift-view.component';

describe('RequestGiftViewComponent', () => {
  let component: RequestGiftViewComponent;
  let fixture: ComponentFixture<RequestGiftViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestGiftViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestGiftViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
