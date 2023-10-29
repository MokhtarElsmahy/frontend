import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskLibrarianArchivedComponent } from './ask-librarian-archived.component';

describe('AskLibrarianArchivedComponent', () => {
  let component: AskLibrarianArchivedComponent;
  let fixture: ComponentFixture<AskLibrarianArchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskLibrarianArchivedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskLibrarianArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
