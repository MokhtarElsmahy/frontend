import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyBookArchivedComponent } from './copy-book-archived.component';

describe('CopyBookArchivedComponent', () => {
  let component: CopyBookArchivedComponent;
  let fixture: ComponentFixture<CopyBookArchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyBookArchivedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyBookArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
