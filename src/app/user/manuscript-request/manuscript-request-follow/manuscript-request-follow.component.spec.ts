import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuscriptRequestFollowComponent } from './manuscript-request-follow.component';

describe('ManuscriptRequestFollowComponent', () => {
  let component: ManuscriptRequestFollowComponent;
  let fixture: ComponentFixture<ManuscriptRequestFollowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManuscriptRequestFollowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManuscriptRequestFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
