import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimbriefRoutingModule } from './simbrief-routing.module';
import { SimbriefComponent } from './simbrief.component';
import { CallbackComponent } from './callback/callback.component';


@NgModule({
  declarations: [SimbriefComponent, CallbackComponent],
  imports: [
    CommonModule,
    SimbriefRoutingModule
  ]
})
export class SimbriefModule { }
