import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import {CommonUtils} from "@app/shared/services";

@Component({
  selector: 'version-index',
  templateUrl: './version-index.component.html',
})
export class VersionControlIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null,CommonUtils.getPermissionCode("resource.versionControl"));
   }

  ngOnInit() {
  }

}
