import { Component, OnInit } from '@angular/core';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup } from '@angular/forms';
import { ReceiveNotificationGroupService } from '@app/core/services/setting/recieve-notification-group.service';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'send-notification',
  templateUrl: './send-notification.component.html',
})
export class SendNotificationComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  formConfig = {
    warningType: ['', ValidationService.required],
    notifyContent: ['', ValidationService.required],
    groupReceiveNotification: [[], [ValidationService.required]]
  }
  public groupList: any;
  constructor(private receiveNotificationGroupService: ReceiveNotificationGroupService
    , private notificationService: NotificationService
    , private app: AppComponent) {
    super(null, CommonUtils.getPermissionCode("resource.notification"));
    this.formSave = this.buildForm({}, this.formConfig);
    this.receiveNotificationGroupService.getListGroup().subscribe(res => {
      this.groupList = res;
      this.groupList.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    });
  }

  ngOnInit() {
  }


  get f() {
    return this.formSave.controls;
  }

  /**
   * request
   */
  public request() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage('sendNotifition.confirm', () => { // on accepted
      this.notificationService.sendNotification(this.formSave.value).subscribe(res => {
        if (this.notificationService.requestIsSuccess(res)) {
          this.formSave = this.buildForm({}, this.formConfig);
        }
      });
    }, () => {
      // on rejected   
    }
    );
  }
}