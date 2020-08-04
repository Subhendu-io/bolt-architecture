import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SHARED_MODULES, COMPONENT_DECLARATIONS } from '@app/app.common';

import { AuthGuard } from '@app/core/guard/auth.guard';
import { PipeModule } from '@app/pipes/pipe.module';

import { PrivateComponent } from '@app/private/private.component';
import { HelpComponent } from '@app/private/help/help.component';
import { AlertsComponent } from '@app/private/alerts/alerts.component';

const routes: Routes = [
  {
    path: 'console',
    component: PrivateComponent,
    canActivate: [AuthGuard],
    data: { roles: ['DEVELOPER', 'PREDEVELOPER'] },
    children: [
      {
        path: 'developer',
        canActivateChild: [AuthGuard],
        data: { roles: ['DEVELOPER'] },
        children: [
          { path: 'help', component: HelpComponent },
        ]
      },
      { path: 'alerts', component: AlertsComponent },
      { path: '**', pathMatch: 'full', redirectTo: 'alerts' }
    ]
  }
];

export const appRouting = RouterModule.forChild(routes);

@NgModule({
  declarations: [
    ...COMPONENT_DECLARATIONS,
    HelpComponent,
    AlertsComponent,
    PrivateComponent
  ],
  imports: [
    ...SHARED_MODULES,
    appRouting,
    PipeModule,
    CommonModule
  ],
  providers: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: [
    ...COMPONENT_DECLARATIONS
  ]
})
export class PrivateModule { }
