import { Component } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'handle-party-letter-denunciation-index',
  templateUrl: './handle-party-letter-denunciation-index.component.html',
})
export class HandlePartyLetterDenunciationIndexComponent extends BaseComponent {

  constructor() {
    super(null, CommonUtils.getPermissionCode('resource.handlePartyLetterDenunciation'));
  }

}
