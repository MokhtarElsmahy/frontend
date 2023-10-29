import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyBookViewComponent } from './copy-book-view.component';

describe('CopyBookViewComponent', () => {
  let component: CopyBookViewComponent;
  let fixture: ComponentFixture<CopyBookViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyBookViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyBookViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
