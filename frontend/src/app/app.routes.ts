import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/core/guard/auth.guard';

const authGuards = {
  canLoad: [AuthGuard],
  canActivateChild: [AuthGuard],
};

export const AppRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('@app/public').then(m => m.PublicModule)
  },
  {
    path: 'console',
    canActivate: [AuthGuard],
    loadChildren: () => import('@app/private').then(m => m.PrivateModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(AppRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
