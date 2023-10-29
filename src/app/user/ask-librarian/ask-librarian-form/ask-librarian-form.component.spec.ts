import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskLibrarianFormComponent } from './ask-librarian-form.component';

describe('AskLibrarianFormComponent', () => {
  let component: AskLibrarianFormComponent;
  let fixture: ComponentFixture<AskLibrarianFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskLibrarianFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskLibrarianFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
