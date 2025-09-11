import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthSsoIndexComponent } from './auth-sso-index/auth-sso-index.component';
import { AuthSsoLoginComponent } from './auth-sso-login/auth-sso-login.component';

const routes: Routes = [
  {
    path: '',
    component: AuthSsoIndexComponent
  },
  {
    path: 'login/:url',
    component: AuthSsoLoginComponent,
  } ,
  {
    path: 'login',
    component: AuthSsoLoginComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthSsoRoutingModule { }
