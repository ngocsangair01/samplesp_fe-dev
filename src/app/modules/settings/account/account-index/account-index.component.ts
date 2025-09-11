import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';

@Component({
  selector: 'account-index',
  templateUrl: './account-index.component.html'
})
export class AccountIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null,'SETTING_ICON');
   }

  ngOnInit() {
  }

}
