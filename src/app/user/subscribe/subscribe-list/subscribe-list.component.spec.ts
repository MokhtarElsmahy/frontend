import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeListComponent } from './subscribe-list.component';

describe('SubscribeListComponent', () => {
  let component: SubscribeListComponent;
  let fixture: ComponentFixture<SubscribeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscribeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscribeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
