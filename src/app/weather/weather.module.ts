import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

import { WeatherRoutingModule } from './weather-routing.module';
import { WeatherComponent } from './weather.component';
import { ImageryComponent } from './imagery/imagery.component';
import { FormsModule } from '@angular/forms';
import { ChartsComponent } from './charts/charts.component';


@NgModule({
  declarations: [WeatherComponent, ImageryComponent, ChartsComponent],
  imports: [
    CommonModule,
    WeatherRoutingModule,
    FormsModule,
    MatTabsModule
  ]
})
export class WeatherModule { }
