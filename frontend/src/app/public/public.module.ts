import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SHARED_MODULES, COMPONENT_DECLARATIONS } from '@app/app.common';

import { ToastrModule } from 'ngx-toastr';

import { PublicComponent } from '@app/public/public.component';

import { TestComponent } from '@app/public/test/test.component';
import { LoginComponent } from '@app/public/login/login.component';
import { RegisterComponent } from '@app/public/register/register.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    // canActivate: [],
    // data: { roles: ['DEVELOPER', 'PREDEVELOPER'] },
    children: [
      {
        path: 'auth',
        // canActivateChild: [AuthGuard],
        // data: { roles: ['DEVELOPER'] },
        children: [
          { path: 'login', component: LoginComponent },
          { path: 'register', component: RegisterComponent },
        ]
      },
      { path: 'home', component: HomeComponent },
      { path: 'test', component: TestComponent },
      { path: '**', pathMatch: 'full', redirectTo: 'home' }
    ]
  }
];
export const appRouting = RouterModule.forChild(routes);

@NgModule({
  declarations: [
    PublicComponent,
    TestComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    ...SHARED_MODULES,
    ToastrModule.forRoot(),
    CommonModule,
    appRouting
  ],
  providers: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: [
    ...COMPONENT_DECLARATIONS
  ]
})
export class PublicModule { }
