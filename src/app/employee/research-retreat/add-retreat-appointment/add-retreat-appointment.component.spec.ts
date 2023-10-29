import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRetreatAppointmentComponent } from './add-retreat-appointment.component';

describe('AddRetreatAppointmentComponent', () => {
  let component: AddRetreatAppointmentComponent;
  let fixture: ComponentFixture<AddRetreatAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRetreatAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRetreatAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
