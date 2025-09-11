import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';

@Component({
  selector: 'setting-icon-index',
  templateUrl: './setting-icon-index.component.html'
})
export class SettingIconIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null,'SETTING_ICON');
   }

  ngOnInit() {
  }

}
