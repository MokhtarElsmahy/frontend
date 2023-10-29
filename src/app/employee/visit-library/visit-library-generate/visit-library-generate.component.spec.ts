import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitLibraryGenerateComponent } from './visit-library-generate.component';

describe('VisitLibraryGenerateComponent', () => {
  let component: VisitLibraryGenerateComponent;
  let fixture: ComponentFixture<VisitLibraryGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitLibraryGenerateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitLibraryGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
