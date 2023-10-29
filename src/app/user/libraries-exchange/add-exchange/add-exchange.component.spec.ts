import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExchangeComponent } from './add-exchange.component';

describe('AddExchangeComponent', () => {
  let component: AddExchangeComponent;
  let fixture: ComponentFixture<AddExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExchangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
