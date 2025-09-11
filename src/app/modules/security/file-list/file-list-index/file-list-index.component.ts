import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'file-list-index',
  templateUrl: './file-list-index.component.html',
})
export class FileListIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.securityProtection"));
  }
  ngOnInit() {
  }

}
