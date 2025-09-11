import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'document-type-index',
  templateUrl: './document-type-index.component.html',

})
export class DocumentTypeIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.document"));

  }

  ngOnInit() {
  }

}
