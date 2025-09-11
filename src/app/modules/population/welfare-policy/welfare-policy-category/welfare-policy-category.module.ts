import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { WelfarePolicyCategoryComponent } from './welfare-policy-category-index/welfare-policy-category-index.component';
import { WelfarePolicyCategoryRoutingModule } from './welfare-policy-category-routing.module';
import { WelfarePolicyFormComponent } from './welfare-policy-category-form/welfare-policy-category-form.component';


@NgModule({
  declarations: [WelfarePolicyCategoryComponent, WelfarePolicyFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    WelfarePolicyCategoryRoutingModule
  ],
  entryComponents: []
})
export class WelfarePolicyCategoryModule { }
