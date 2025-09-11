import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { CreateOrUpdateComponent } from './create-update/create-update.component';
import { IndexComponent } from './index/index.component';
import { ThoroughContentRoutingModule } from './thorough-content-routing.module';
import {
  PreviewFileThoroughContentModalComponent
} from "@app/modules/employee/thorough-content/preview-modal/preview-file-thorough-content-modal.component";


@NgModule({
  declarations: [CreateOrUpdateComponent, IndexComponent, PreviewFileThoroughContentModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    ThoroughContentRoutingModule,
  ],
  entryComponents: [PreviewFileThoroughContentModalComponent]
})
export class ThoroughContentModule { }
