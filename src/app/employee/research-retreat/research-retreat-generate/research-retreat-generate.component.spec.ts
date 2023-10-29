import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchRetreatGenerateComponent } from './research-retreat-generate.component';

describe('ResearchRetreatGenerateComponent', () => {
  let component: ResearchRetreatGenerateComponent;
  let fixture: ComponentFixture<ResearchRetreatGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchRetreatGenerateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchRetreatGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
