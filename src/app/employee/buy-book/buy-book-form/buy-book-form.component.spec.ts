import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyBookFormComponent } from './buy-book-form.component';

describe('BuyBookFormComponent', () => {
  let component: BuyBookFormComponent;
  let fixture: ComponentFixture<BuyBookFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyBookFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyBookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
