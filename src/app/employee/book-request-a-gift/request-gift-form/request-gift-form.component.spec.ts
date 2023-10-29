import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestGiftFormComponent } from './request-gift-form.component';

describe('RequestGiftFormComponent', () => {
  let component: RequestGiftFormComponent;
  let fixture: ComponentFixture<RequestGiftFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestGiftFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestGiftFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
