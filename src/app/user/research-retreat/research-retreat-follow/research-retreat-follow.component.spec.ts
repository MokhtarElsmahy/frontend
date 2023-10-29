import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchRetreatFollowComponent } from './research-retreat-follow.component';

describe('ResearchRetreatFollowComponent', () => {
  let component: ResearchRetreatFollowComponent;
  let fixture: ComponentFixture<ResearchRetreatFollowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchRetreatFollowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchRetreatFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
