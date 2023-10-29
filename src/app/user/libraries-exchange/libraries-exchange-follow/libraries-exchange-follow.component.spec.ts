import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrariesExchangeFollowComponent } from './libraries-exchange-follow.component';

describe('LibrariesExchangeFollowComponent', () => {
  let component: LibrariesExchangeFollowComponent;
  let fixture: ComponentFixture<LibrariesExchangeFollowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibrariesExchangeFollowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibrariesExchangeFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
