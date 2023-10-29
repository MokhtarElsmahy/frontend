import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyBookViewComponent } from './buy-book-view.component';

describe('BuyBookViewComponent', () => {
  let component: BuyBookViewComponent;
  let fixture: ComponentFixture<BuyBookViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyBookViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyBookViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
