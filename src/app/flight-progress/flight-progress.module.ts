import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlightProgressRoutingModule } from './flight-progress-routing.module';
import { FlightProgressComponent } from './flight-progress.component';


@NgModule({
  declarations: [FlightProgressComponent],
  imports: [
    CommonModule,
    FlightProgressRoutingModule
  ]
})
export class FlightProgressModule { }
