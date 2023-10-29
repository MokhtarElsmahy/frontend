import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitLibraryFormComponent } from './visit-library-form.component';

describe('VisitLibraryFormComponent', () => {
  let component: VisitLibraryFormComponent;
  let fixture: ComponentFixture<VisitLibraryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitLibraryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitLibraryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
