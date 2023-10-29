import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuscriptRequestViewComponent } from './manuscript-request-view.component';

describe('ManuscriptRequestViewComponent', () => {
  let component: ManuscriptRequestViewComponent;
  let fixture: ComponentFixture<ManuscriptRequestViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManuscriptRequestViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManuscriptRequestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
