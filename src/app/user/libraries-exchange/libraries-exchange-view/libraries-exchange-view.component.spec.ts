import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrariesExchangeViewComponent } from './libraries-exchange-view.component';

describe('LibrariesExchangeViewComponent', () => {
  let component: LibrariesExchangeViewComponent;
  let fixture: ComponentFixture<LibrariesExchangeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibrariesExchangeViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibrariesExchangeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
