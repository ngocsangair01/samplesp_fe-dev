import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'party-congress-employee-index',
  templateUrl: './party-congress-employee-index.component.html'
})
export class PartyCongressEmployeeIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.partyCongressEmployee"));
  }

  ngOnInit() {
  }
}
