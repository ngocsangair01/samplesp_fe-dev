import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Component, OnInit } from '@angular/core';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'mass-organization-index',
  templateUrl: './mass-organization-index.component.html'
})
export class MassOrganizationIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.massOrganization"));
   }

  ngOnInit() {
  }

}
