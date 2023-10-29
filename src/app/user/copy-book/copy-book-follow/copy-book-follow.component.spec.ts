import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyBookFollowComponent } from './copy-book-follow.component';

describe('CopyBookFollowComponent', () => {
  let component: CopyBookFollowComponent;
  let fixture: ComponentFixture<CopyBookFollowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyBookFollowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyBookFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
