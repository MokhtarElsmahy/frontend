import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookGiftFollowComponent } from './book-gift-follow.component';

describe('BookGiftFollowComponent', () => {
  let component: BookGiftFollowComponent;
  let fixture: ComponentFixture<BookGiftFollowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookGiftFollowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookGiftFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
