import { AppComponent } from './../../../app.component';
import { NotificationService } from './../../../core/services/notification/notification.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { HelperService } from '@app/shared/services/helper.service';
import { HeaderNotificationComponent } from '@app/shared/layout/header/header-notification/header-notification.component';

@Component({
  selector: 'notification-add',
  templateUrl: './notification-add.component.html',
  styleUrls: ['./notification-add.component.css']
})
export class NotificationAddComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  notificationId: any;
  notifyBranchList: any;
  isUpdate: boolean = false;
  isInsert: boolean = false;
  formConfig = {
    notificationId: [''],
    displayStartDate: ['', ValidationService.required],
    displayFinishDate: ['', ValidationService.required],
    link: ['', [ValidationService.maxLength(200), ValidationService.isUrl]],
    notifyContent: ['', [ValidationService.required, ValidationService.maxLength(4000)]],
    notifyBranch: ['', ValidationService.required],
  }
  @ViewChild('headerNotification')
  headerNotificationComponent: HeaderNotificationComponent;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    public actr: ActivatedRoute,
    public app: AppComponent,
    private helperService: HelperService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.notification"));
    this.buildForms({});
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.notificationId = params.id;
        }
      }
    });
    this.setMainService(notificationService);
    this.notifyBranchList = APP_CONSTANTS.NOTIFYBRANCHLIST;
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 2) {
      this.isUpdate = subPaths[2] === 'notification-edit';
      this.isInsert = subPaths[2] === 'notification-add';
    }
    this.setFormValue(this.notificationId);
  }

  // quay lai
  public goBack() {
    this.router.navigate(['/notification']);
  }

  // them moi or sua
  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accept
      if (!CommonUtils.isValidForm(this.formSave)) {
        return;
      } else {
        this.notificationService.saveOrUpdate(this.formSave.value)
          .subscribe(res => {
            if (this.notificationService.requestIsSuccess(res)) {
              this.helperService.reloadHeaderNotification('complete');
              this.goBack();
            }
          });
      } () => {

      }
    }, () => {
      // on rejected
    });
  }

  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT,
      [ValidationService.notAffter('displayStartDate', 'displayFinishDate', 'notification.displayFinishDate')]);
  }

  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.notificationService.findOne(data)
        .subscribe(res => {
          this.buildForms(res.data);
        });
    }
  }

  get f() {
    return this.formSave.controls;
  }
}