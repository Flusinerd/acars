import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightProgressComponent } from './flight-progress.component';

describe('FlightProgressComponent', () => {
  let component: FlightProgressComponent;
  let fixture: ComponentFixture<FlightProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
