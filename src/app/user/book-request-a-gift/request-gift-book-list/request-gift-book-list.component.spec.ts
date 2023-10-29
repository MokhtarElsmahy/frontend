import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestGiftBookListComponent } from './request-gift-book-list.component';

describe('RequestGiftBookListComponent', () => {
  let component: RequestGiftBookListComponent;
  let fixture: ComponentFixture<RequestGiftBookListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestGiftBookListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestGiftBookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
