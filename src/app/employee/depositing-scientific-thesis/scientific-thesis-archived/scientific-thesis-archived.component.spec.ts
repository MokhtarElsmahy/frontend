import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScientificThesisArchivedComponent } from './scientific-thesis-archived.component';

describe('ScientificThesisArchivedComponent', () => {
  let component: ScientificThesisArchivedComponent;
  let fixture: ComponentFixture<ScientificThesisArchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScientificThesisArchivedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScientificThesisArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
