import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'officer-profile-search',
  templateUrl: './officer-profile-search.component.html',
})
export class OfficerProfileSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  constructor(

  ) {
    super(null, CommonUtils.getPermissionCode("resource.empFile"));
    this.formSearch = this.buildForm({}, { select: [null] });
  }

  ngOnInit() {
  }

  prepareSaveOrUpdate() {

  }
}
