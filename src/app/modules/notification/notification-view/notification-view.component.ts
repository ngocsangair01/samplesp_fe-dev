import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { APP_CONSTANTS } from '@app/core';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'notification-view',
  templateUrl: './notification-view.component.html',
  styleUrls: ['./notification-view.component.css']
})
export class NotificationViewComponent extends BaseComponent implements OnInit {

  formView: FormGroup;
  notificationId: any;
  notifyBranchList: any;
  formConfig = {
    notificationId: [''],
    notifyBranch: [''],
    notifyContent: [''],
    link: [''],
    displayStartDate: [''],
    displayFinishDate: [''],
  }
  constructor(
    private router: Router,
    private notificationService: NotificationService,
    public actr: ActivatedRoute,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.notification"));
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.notificationId = params.id;
          this.setFormValue(this.notificationId);
        }
      }
    });
    this.notifyBranchList = APP_CONSTANTS.NOTIFYBRANCHLIST;
    this.formView = this.buildForm({}, this.formConfig,);
  }
  /**
   * setFormValue
   */
  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.notificationService.findOne(data)
        .subscribe(res => {
          this.buildForms(res.data);
        })
    }
  }
  private buildForms(data?: any): void {
    this.formView = this.buildForm(data, this.formConfig);
  }
  ngOnInit() {
  }
  get f() {
    return this.formView.controls;
  }
  public goBack() {
    this.router.navigate(['/notification']);
  }
}
