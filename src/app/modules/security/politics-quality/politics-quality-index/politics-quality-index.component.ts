import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'politics-quality-index',
  templateUrl: './politics-quality-index.component.html',
})
export class PoliticsQualityIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.politicsQuality"))
  }

  ngOnInit() {
  }

}
