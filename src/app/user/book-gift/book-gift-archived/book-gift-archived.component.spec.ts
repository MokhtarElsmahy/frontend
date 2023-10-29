import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookGiftArchivedComponent } from './book-gift-archived.component';

describe('GiftRequestArchivedComponent', () => {
  let component: BookGiftArchivedComponent;
  let fixture: ComponentFixture<BookGiftArchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookGiftArchivedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookGiftArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
