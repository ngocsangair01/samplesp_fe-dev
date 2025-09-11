import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { WelfarePolicyRequestComponent } from './welfare-policy-request-index/welfare-policy-request-index.component';
import { WelfarePolicyRequestRoutingModule } from './welfare-policy-request-routing.module';
import { WelfarePolicyRequestFormComponent } from './welfare-policy-request-form/welfare-policy-request-form.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WelfarePolicyRequestService } from '@app/core/services/population/welfare-policy-request.service';


@NgModule({
  declarations: [WelfarePolicyRequestComponent, WelfarePolicyRequestFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    WelfarePolicyRequestRoutingModule
  ],
  providers: [NgbActiveModal],
  entryComponents: [WelfarePolicyRequestFormComponent]
})
export class WelfarePolicyRequestModule { }
