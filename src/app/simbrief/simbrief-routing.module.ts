import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth-guard.guard';
import { CallbackComponent } from './callback/callback.component';
import { SimbriefComponent } from './simbrief.component';

const routes: Routes = [
  { path: 'simbrief', component: SimbriefComponent, canActivate: [AuthGuard] },
  { path: 'simbrief-callback', component: CallbackComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimbriefRoutingModule { }
