import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallbackComponent } from './callback/callback.component';
import { SimbriefComponent } from './simbrief.component';

const routes: Routes = [
  { path: 'simbrief', component: SimbriefComponent },
  { path: 'simbrief-callback', component: CallbackComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimbriefRoutingModule { }
