import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookGiftFormComponent } from './book-gift-form.component';

describe('BookGiftFormComponent', () => {
  let component: BookGiftFormComponent;
  let fixture: ComponentFixture<BookGiftFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookGiftFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookGiftFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
