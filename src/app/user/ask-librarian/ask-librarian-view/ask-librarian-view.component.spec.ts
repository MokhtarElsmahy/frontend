import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskLibrarianViewComponent } from './ask-librarian-view.component';

describe('AskLibrarianViewComponent', () => {
  let component: AskLibrarianViewComponent;
  let fixture: ComponentFixture<AskLibrarianViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskLibrarianViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskLibrarianViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
