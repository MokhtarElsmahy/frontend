import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrariesExchangeFormComponent } from './libraries-exchange-form.component';

describe('LibrariesExchangeFormComponent', () => {
  let component: LibrariesExchangeFormComponent;
  let fixture: ComponentFixture<LibrariesExchangeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibrariesExchangeFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibrariesExchangeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
