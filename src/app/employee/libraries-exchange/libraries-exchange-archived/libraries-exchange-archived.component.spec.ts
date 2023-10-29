import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrariesExchangeArchivedComponent } from './libraries-exchange-archived.component';

describe('LibrariesExchangeArchivedComponent', () => {
  let component: LibrariesExchangeArchivedComponent;
  let fixture: ComponentFixture<LibrariesExchangeArchivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibrariesExchangeArchivedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibrariesExchangeArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
