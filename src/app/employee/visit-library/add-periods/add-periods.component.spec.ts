import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPeriodsComponent } from './add-periods.component';

describe('AddPeriodsComponent', () => {
  let component: AddPeriodsComponent;
  let fixture: ComponentFixture<AddPeriodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPeriodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
