import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchRetreatArchivedComponent } from './research-retreat-archived.component';

describe('ResearchRetreatArchivedComponent', () => {
  let component: ResearchRetreatArchivedComponent;
  let fixture: ComponentFixture<ResearchRetreatArchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchRetreatArchivedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchRetreatArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
