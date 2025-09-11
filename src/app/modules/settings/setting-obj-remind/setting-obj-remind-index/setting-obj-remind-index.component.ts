import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';

@Component({
  selector: 'setting-obj-remind-index',
  templateUrl: './setting-obj-remind-index.component.html'
})
export class SettingObjRemindIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null,'SETTING_ICON');
   }

  ngOnInit() {
  }

}
