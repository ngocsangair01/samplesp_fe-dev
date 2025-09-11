import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'study-abroad-index',
  templateUrl: './study-abroad-index.component.html',
  styleUrls: ['./study-abroad-index.component.css']
})
export class StudyAbroadIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.securityProtection"));
  }

  ngOnInit() {
  }

}
