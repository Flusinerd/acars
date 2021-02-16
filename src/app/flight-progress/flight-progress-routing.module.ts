import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth-guard.guard';
import { FlightProgressComponent } from './flight-progress.component';

const routes: Routes = [
  { path: 'flight-progress', component: FlightProgressComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightProgressRoutingModule { }
