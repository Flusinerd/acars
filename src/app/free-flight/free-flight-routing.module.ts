import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth-guard.guard';
import { FreeFlightComponent } from './free-flight.component';

const routes: Routes = [
  { path: 'freeflight', component: FreeFlightComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FreeFlightRoutingModule { }
