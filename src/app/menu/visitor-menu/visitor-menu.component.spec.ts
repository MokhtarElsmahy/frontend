import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorMenuComponent } from './visitor-menu.component';

describe('VisitorMenuComponent', () => {
  let component: VisitorMenuComponent;
  let fixture: ComponentFixture<VisitorMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
