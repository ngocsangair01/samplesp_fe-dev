import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'education-process-member-index',
  templateUrl: './education-process-member-index.component.html',
})
export class EducationProcessMemberIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.educationProcess"))
  }

  ngOnInit() {
  }

}
