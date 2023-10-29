import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookGiftViewComponent } from './book-gift-view.component';

describe('BookGiftViewComponent', () => {
  let component: BookGiftViewComponent;
  let fixture: ComponentFixture<BookGiftViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookGiftViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookGiftViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
