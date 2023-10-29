import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScientificThesisFormComponent } from './scientific-thesis-form.component';

describe('ScientificThesisFormComponent', () => {
  let component: ScientificThesisFormComponent;
  let fixture: ComponentFixture<ScientificThesisFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScientificThesisFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScientificThesisFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
