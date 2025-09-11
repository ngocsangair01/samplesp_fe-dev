import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import {CommonUtils} from "@app/shared/services";

@Component({
  selector: 'relative-abroad-index',
  templateUrl: './relative-abroad-index.component.html',
  styleUrls: ['./relative-abroad-index.component.css']
})
export class RelativeAbroadIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.securityProtection"));
  }

  ngOnInit() {
  }

}
