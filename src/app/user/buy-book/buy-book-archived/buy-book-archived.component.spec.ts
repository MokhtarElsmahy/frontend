import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyBookArchivedComponent } from './buy-book-archived.component';

describe('BuyBookArchivedComponent', () => {
  let component: BuyBookArchivedComponent;
  let fixture: ComponentFixture<BuyBookArchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyBookArchivedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyBookArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
