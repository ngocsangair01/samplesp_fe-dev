import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { ReceiveNotificationGroupService } from '@app/core/services/setting/recieve-notification-group.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'notification-request',
  templateUrl: './notification-request.component.html'
})
export class NotificationRequestComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  formConfig = {
    notificationId: [''],
    warningType: ['', ValidationService.required],
    notifyContent: ['', ValidationService.required],
    groupReceiveNotification: ['', [ValidationService.required]]
  }
  public groupList: any;
  constructor(private receiveNotificationGroupService: ReceiveNotificationGroupService
    , private notificationService: NotificationService
    , public activeModal: NgbActiveModal
    , private app: AppComponent) {
    super(null, CommonUtils.getPermissionCode("resource.notification"));
    this.buildForms({});
    this.receiveNotificationGroupService.getListGroup().subscribe(res => {
      this.groupList = res;
      this.groupList.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    });
  }

  ngOnInit() {
  }

  public buildForms(data?: any) {
    this.formSave = this.buildForm(data, this.formConfig);
  }

  get f() {
    return this.formSave.controls;
  }

  /**
   * Set form value after pop-up
   * @param data 
   */
  private setFormValue(data) {
    if (data && data.notificationId > 0) {
      this.buildForms(data);
    }
  }

  /**
   * request
   */
  public request() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accepted
      this.notificationService.request(this.formSave.value).subscribe(res => {
        if (this.notificationService.requestIsSuccess(res)) {
          this.activeModal.close(res);
        }
      });
    }, () => {
      // on rejected   
    }
    );
  }

}
