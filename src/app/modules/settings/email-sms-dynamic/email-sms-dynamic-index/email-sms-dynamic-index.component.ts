import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';

@Component({
  selector: 'email-sms-dynamic-index',
  templateUrl: './email-sms-dynamic-index.component.html',
})
export class EmailSmsDynamicIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
   }

  ngOnInit() {
  }

}
