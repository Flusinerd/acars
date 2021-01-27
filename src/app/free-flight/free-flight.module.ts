import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FreeFlightRoutingModule } from './free-flight-routing.module';
import { FreeFlightComponent } from './free-flight.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [FreeFlightComponent],
  imports: [
    CommonModule,
    FreeFlightRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class FreeFlightModule { }
