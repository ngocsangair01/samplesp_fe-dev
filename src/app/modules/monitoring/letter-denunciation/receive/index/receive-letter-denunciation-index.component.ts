import { Component } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'receive-letter-denunciation-index',
  templateUrl: './receive-letter-denunciation-index.component.html',
})
export class ReceiveLetterDenunciationIndexComponent extends BaseComponent {

  constructor() {
    super(null, CommonUtils.getPermissionCode('resource.receiveLetterDenunciation'));
  }

}
