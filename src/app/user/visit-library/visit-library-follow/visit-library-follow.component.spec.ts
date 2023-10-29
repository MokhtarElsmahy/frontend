import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitLibraryFollowComponent } from './visit-library-follow.component';

describe('VisitLibraryFollowComponent', () => {
  let component: VisitLibraryFollowComponent;
  let fixture: ComponentFixture<VisitLibraryFollowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitLibraryFollowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitLibraryFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
