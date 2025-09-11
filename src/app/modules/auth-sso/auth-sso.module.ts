import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthSsoRoutingModule } from './auth-sso-routing.module';
import { SharedModule } from '@app/shared';
import { AuthSsoIndexComponent } from './auth-sso-index/auth-sso-index.component';
import { AuthSsoLoginComponent } from './auth-sso-login/auth-sso-login.component';

@NgModule({
  declarations: [AuthSsoIndexComponent, AuthSsoLoginComponent],
  imports: [
    CommonModule,
    SharedModule,
    AuthSsoRoutingModule
  ]
})
export class AuthSsoModule { }
