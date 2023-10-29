import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyBookFormComponent } from './copy-book-form.component';

describe('CopyBookFormComponent', () => {
  let component: CopyBookFormComponent;
  let fixture: ComponentFixture<CopyBookFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyBookFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyBookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
