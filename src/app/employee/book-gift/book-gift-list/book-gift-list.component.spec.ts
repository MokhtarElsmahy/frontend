import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookGiftListComponent } from './book-gift-list.component';

describe('BookGiftListComponent', () => {
  let component: BookGiftListComponent;
  let fixture: ComponentFixture<BookGiftListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookGiftListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookGiftListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
