import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { LetterDenunciationRoutingModule } from './letter-denunciation-routing.module';
import { ReceiveLetterDenunciationIndexComponent } from './receive/index/receive-letter-denunciation-index.component';
import { ReceiveLetterDenunciationSearchComponent } from './receive/search/receive-letter-denunciation-search.component';
import { ReceiveLetterDenunciationFormComponent } from './receive/form/receive-letter-denunciation-form.component';
import { HandlePartyLetterDenunciationIndexComponent } from './handle-party/index/handle-party-letter-denunciation-index.component';
import { HandlePartyLetterDenunciationSearchComponent } from './handle-party/search/handle-party-letter-denunciation-search.component';
import { HandlePartyLetterDenunciationFormComponent } from './handle-party/form/handle-party-letter-denunciation-form.component';
import { DeclineLetterDenunciationModalComponent } from './handle-party/modal/decline-letter-denunciation-modal.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown'

@NgModule({
  declarations: [
    ReceiveLetterDenunciationIndexComponent,
    ReceiveLetterDenunciationSearchComponent,
    ReceiveLetterDenunciationFormComponent,
    HandlePartyLetterDenunciationIndexComponent,
    HandlePartyLetterDenunciationSearchComponent,
    HandlePartyLetterDenunciationFormComponent,
    DeclineLetterDenunciationModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LetterDenunciationRoutingModule,
    AngularMultiSelectModule
  ],
  entryComponents: [
    DeclineLetterDenunciationModalComponent
  ]
})
export class LetterDenunciationModule { }
