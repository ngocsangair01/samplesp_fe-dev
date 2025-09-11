import { CommonUtils } from '@app/shared/services';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mass-group-index',
  templateUrl: './mass-group-index.component.html'
})
export class MassGroupIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.massGroup"))
   }

  ngOnInit() {
  }

}
