import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SHARED_MODULES, COMPONENT_DECLARATIONS } from '@app/app.common';

import { ToastrModule } from 'ngx-toastr';

import { PublicComponent } from '@app/public/public.component';

import { TestComponent } from '@app/public/test/test.component';


const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    children: [
      { path: 'test', component: TestComponent },
      { path: '**', pathMatch: 'full', redirectTo: 'test' }
    ]
  }
];
export const appRouting = RouterModule.forChild(routes);

@NgModule({
  declarations: [
    PublicComponent,
    TestComponent
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
