import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitLibraryViewComponent } from './visit-library-view.component';

describe('VisitLibraryViewComponent', () => {
  let component: VisitLibraryViewComponent;
  let fixture: ComponentFixture<VisitLibraryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitLibraryViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitLibraryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
