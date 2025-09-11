import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import {CommonUtils} from "@app/shared/services";

@Component({
  selector: 'worked-abroad-index',
  templateUrl: './worked-abroad-index.component.html',
  styleUrls: ['./worked-abroad-index.component.css']
})
export class WorkedAbroadIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.securityProtection"));
  }

  ngOnInit() {
  }

}
