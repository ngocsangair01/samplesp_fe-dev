
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { TemplateNotifyRoutingModule } from './template-notify-routing.module';
import { TemplateNotifySearchComponent } from './template-notify-search/template-notify-search.component';
import { TemplateNotifyIndexComponent } from './template-notify-index/template-notify-index.component';
import { TemplateNotifyFormComponent } from './template-notify-form/template-notify-form.component';


@NgModule({
  declarations: [
    TemplateNotifySearchComponent,
    TemplateNotifyIndexComponent,
    TemplateNotifyFormComponent,
     ],    
  imports: [
    CommonModule,
    SharedModule,
    TemplateNotifyRoutingModule,
  ],
  exports: [
  ],
  entryComponents: [TemplateNotifyFormComponent]
})
export class TemplateNotifyModule {
}
