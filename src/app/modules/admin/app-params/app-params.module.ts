import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppParamsComponent, FilterPipeNew } from './app-params/app-params.component';
import { AppParamsRoutingModule } from './app-params-routing.module';
import { SharedModule } from '@app/shared';
import { AppParamsFormComponent } from './app-params-form/app-params-form.component';

@NgModule({
  declarations: [AppParamsComponent, FilterPipeNew, AppParamsFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    AppParamsRoutingModule,
  ],
  exports: [
  ],
  entryComponents: [AppParamsFormComponent]
})
export class AppParamsModule { }
