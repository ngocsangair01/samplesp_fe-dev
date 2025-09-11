import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'party-criticize-index',
  templateUrl: './party-criticize-index.component.html'
})
export class PartyCriticizeIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.partyCriticize"));
  }

  ngOnInit() {
  }

}
