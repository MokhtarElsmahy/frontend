import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchRetreatViewComponent } from './research-retreat-view.component';

describe('ResearchRetreatViewComponent', () => {
  let component: ResearchRetreatViewComponent;
  let fixture: ComponentFixture<ResearchRetreatViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchRetreatViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchRetreatViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
