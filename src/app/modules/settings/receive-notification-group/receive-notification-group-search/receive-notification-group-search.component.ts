import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReceiveNotificationGroupService } from '@app/core/services/setting/recieve-notification-group.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'receive-notification-group-search',
  templateUrl: './receive-notification-group-search.component.html',
  styleUrls: ['./receive-notification-group-search.component.css']
})
export class ReceiveNotificationGroupSearchComponent extends BaseComponent implements OnInit {

  formSearch: FormGroup;
  formConfig = {
    name: [''],
    isBlackList : [0],
    isName: [false],
    isCheckBlackList: [false],
  }
  constructor(private receiveNotificationGroup: ReceiveNotificationGroupService,
    private router: Router) {
    super(null, CommonUtils.getPermissionCode("resource.receiveNotificationGroup"));
    this.setMainService(receiveNotificationGroup);
    this.formSearch = this.buildForm({}, this.formConfig);
    this.processSearch();
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.receiveNotificationGroupId > 0) {
      return this.router.navigate(['/settings/receive-notification-group-edit/', item.receiveNotificationGroupId]);
    }
    return this.router.navigate(['/settings/receive-notification-group-add']);
  }

  public prepareImport() {
    return this.router.navigate(['/settings/receive-notification-group-import']);
  }

}
