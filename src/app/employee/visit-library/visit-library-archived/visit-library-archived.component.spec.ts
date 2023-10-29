import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitLibraryArchivedComponent } from './visit-library-archived.component';

describe('VisitLibraryArchivedComponent', () => {
  let component: VisitLibraryArchivedComponent;
  let fixture: ComponentFixture<VisitLibraryArchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitLibraryArchivedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitLibraryArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
