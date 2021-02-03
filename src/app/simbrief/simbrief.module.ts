import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimbriefRoutingModule } from './simbrief-routing.module';
import { SimbriefComponent } from './simbrief.component';
import { CallbackComponent } from './callback/callback.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';


@NgModule({
  declarations: [SimbriefComponent, CallbackComponent],
  imports: [
    CommonModule,
    SimbriefRoutingModule,
    NgxExtendedPdfViewerModule
  ]
})
export class SimbriefModule { }
