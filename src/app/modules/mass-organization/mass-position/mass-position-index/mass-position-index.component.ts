import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'mass-position-index',
  templateUrl: './mass-position-index.component.html'
})
export class MassPositionIndexComponent extends BaseComponent implements OnInit {
  constructor(
  ) { 
    super(null, CommonUtils.getPermissionCode("resource.massPosition"));
  }

  ngOnInit() {
  }
 
}
