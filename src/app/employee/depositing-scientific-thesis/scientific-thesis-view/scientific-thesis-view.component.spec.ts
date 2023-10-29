import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScientificThesisViewComponent } from './scientific-thesis-view.component';

describe('ScientificThesisViewComponent', () => {
  let component: ScientificThesisViewComponent;
  let fixture: ComponentFixture<ScientificThesisViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScientificThesisViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScientificThesisViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
