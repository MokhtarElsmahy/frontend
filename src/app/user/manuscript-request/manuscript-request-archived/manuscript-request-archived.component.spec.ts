import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuscriptRequestArchivedComponent } from './manuscript-request-archived.component';

describe('ManuscriptRequestArchivedComponent', () => {
  let component: ManuscriptRequestArchivedComponent;
  let fixture: ComponentFixture<ManuscriptRequestArchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManuscriptRequestArchivedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManuscriptRequestArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
