import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitLibraryScheduleComponent } from './visit-library-schedule.component';

describe('VisitLibraryScheduleComponent', () => {
  let component: VisitLibraryScheduleComponent;
  let fixture: ComponentFixture<VisitLibraryScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitLibraryScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitLibraryScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
