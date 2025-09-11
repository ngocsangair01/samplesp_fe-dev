
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [
  ],    
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ],
  exports: [
  ],
  entryComponents: []
})
export class AdminModule {
}
