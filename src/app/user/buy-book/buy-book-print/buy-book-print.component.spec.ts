import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyBookPrintComponent } from './buy-book-print.component';

describe('BuyBookPrintComponent', () => {
  let component: BuyBookPrintComponent;
  let fixture: ComponentFixture<BuyBookPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyBookPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyBookPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
