import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'email-sms-history-bk-index',
  templateUrl: './email-sms-history-bk-index.component.html',

})
export class EmailSmsHistoryBkIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
