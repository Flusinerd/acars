import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveMapRoutingModule } from './live-map-routing.module';
import { LiveMapComponent } from './live-map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';


@NgModule({
  declarations: [LiveMapComponent],
  imports: [
    CommonModule,
    LiveMapRoutingModule,
    LeafletModule
  ]
})
export class LiveMapModule { }
