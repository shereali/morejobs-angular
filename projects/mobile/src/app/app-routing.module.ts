import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TestPage} from './pages/test/test.page';

const routes: Routes = [
  {
    path: 'test',
    loadChildren: () => import('./pages/test/test.module').then( m => m.TestPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
