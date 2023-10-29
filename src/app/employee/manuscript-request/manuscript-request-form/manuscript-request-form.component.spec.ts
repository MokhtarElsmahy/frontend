import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuscriptRequestFormComponent } from './manuscript-request-form.component';

describe('ManuscriptRequestFormComponent', () => {
  let component: ManuscriptRequestFormComponent;
  let fixture: ComponentFixture<ManuscriptRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManuscriptRequestFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManuscriptRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
