import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeFlightComponent } from './free-flight.component';

describe('FreeFlightComponent', () => {
  let component: FreeFlightComponent;
  let fixture: ComponentFixture<FreeFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeFlightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
