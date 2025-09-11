import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from "primeng/table";
import { SharedModule } from "../../shared";
import { VofficeSigningRoutingModule } from './voffice-signing-routing.module';
import { VofficeSigningFormComponent } from './form/voffice-signing-form.component';
import { VofficeSigningPreviewModalComponent } from './preview-modal/voffice-signing-preview-modal.component';
// #209 ban hành tự động start
import { DocumentPickerModalComponent } from './form/document-picker/document-picker-modal/document-picker-modal.component';
import { MultiDocumentPickerComponent } from './form/document-picker/multi-document-picker.component';
import { DocumentPickerComponent } from './form/document-picker/document-picker.component';
import { TransferAutoTabComponent } from './form/transfer-auto-tab/transfer-auto-tab.component';
import { OrganizationTabComponent } from './form/transfer-auto-tab/organization-tab/organization-tab.component';
import { IndividualTabComponent } from './form/transfer-auto-tab/individual-tab/individual-tab.component';
import { GroupTabComponent } from './form/transfer-auto-tab/group-tab/group-tab.component';
import { GroupPickerModalComponent } from './form/transfer-auto-tab/group-tab/group-picker/group-picker-modal/group-picker-modal.component';
import { GroupPickerComponent } from './form/transfer-auto-tab/group-tab/group-picker/group-picker.component';
@NgModule({
  declarations: [VofficeSigningFormComponent
    , TransferAutoTabComponent
    , OrganizationTabComponent
    , IndividualTabComponent
    , GroupTabComponent
    , GroupPickerComponent
    , GroupPickerModalComponent
    , DocumentPickerComponent
    , DocumentPickerModalComponent
    , MultiDocumentPickerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DialogModule,
    TableModule,
    VofficeSigningRoutingModule
  ],
  entryComponents:[
    GroupPickerModalComponent
    , DocumentPickerModalComponent
  ]
})
export class VofficeSigningModule {
}
