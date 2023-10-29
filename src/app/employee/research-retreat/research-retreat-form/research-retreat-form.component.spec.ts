import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchRetreatFormComponent } from './research-retreat-form.component';

describe('ResearchRetreatFormComponent', () => {
  let component: ResearchRetreatFormComponent;
  let fixture: ComponentFixture<ResearchRetreatFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchRetreatFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchRetreatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
