import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FreeFlightComponent } from './free-flight.component';

const routes: Routes = [
  { path: 'freeflight', component: FreeFlightComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FreeFlightRoutingModule { }
