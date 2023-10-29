import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchRetreatScheduleComponent } from './research-retreat-schedule.component';

describe('ResearchRetreatScheduleComponent', () => {
  let component: ResearchRetreatScheduleComponent;
  let fixture: ComponentFixture<ResearchRetreatScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchRetreatScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchRetreatScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
