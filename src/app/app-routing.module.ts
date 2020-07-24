import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NaamInvoerComponent} from './naam-invoer/naam-invoer.component';


const routes: Routes = [
  {path: '', component: NaamInvoerComponent},
  {
    path: 'deelnemer',
    loadChildren: () => import('./deelnemer/deelnemer.module').then(m => m.DeelnemerModule)
  },
  {
    path: 'tutor',
    loadChildren: () => import('./tutor/tutor.module').then(m => m.TutorModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
