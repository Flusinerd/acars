import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightProgressComponent } from './flight-progress.component';

const routes: Routes = [
  { path: 'flight-progress', component: FlightProgressComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightProgressRoutingModule { }
