import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScientificThesisFollowComponent } from './scientific-thesis-follow.component';

describe('ScientificThesisFollowComponent', () => {
  let component: ScientificThesisFollowComponent;
  let fixture: ComponentFixture<ScientificThesisFollowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScientificThesisFollowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScientificThesisFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
