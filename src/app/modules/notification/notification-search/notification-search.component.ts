import { Router } from '@angular/router';
import { BaseComponent } from './../../../shared/components/base-component/base-component.component';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS } from '@app/core/app-config';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { HelperService } from '@app/shared/services/helper.service';
import { NotificationRequestComponent } from '../notification-request/notification-request.component';

@Component({
  selector: 'notification-search',
  templateUrl: './notification-search.component.html'
})
export class NotificationSearchComponent extends BaseComponent implements OnInit {
  now: any;
  formSearch: FormGroup;
  notifyBranchList: any;
  link: any;
  formConfig = {
    notificationId: [''],
    displayStartDate: [''],
    toDisplayStartDate: [''],
    displayFinishDate: [''],
    toDisplayFinishDate: [''],
    notifyContent: ['', ValidationService.maxLength(4000)],
    notifyBranchList: [''],
  }

  constructor(
    private helperService: HelperService,
    private notificationService: NotificationService,
    private router: Router,
    private app: AppComponent,
    public modalService: NgbModal,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.notification"));
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('displayStartDate', 'toDisplayStartDate', 'notification.check.toStartDate'),
      ValidationService.notAffter('displayFinishDate', 'toDisplayFinishDate', 'notification.check.toFinishDate')]);
    this.setMainService(notificationService);
    this.processSearch();
    this.notifyBranchList = APP_CONSTANTS.NOTIFYBRANCHLIST;
    this.now = new Date().getTime();
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }

  /**
   * processView item
   */
  public processView(item) {
    if (item && item.notificationId > 0) {
      this.router.navigate(['/notification/notification-view/', item.notificationId]);
    }
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.notificationId > 0) {
      this.router.navigate(['/notification/notification-edit/', item.notificationId]);
    } else {
      this.router.navigate(['/notification/notification-add']);
    }
  }

  public processDelete(item) {
    if (item && item.notificationId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.notificationService.deleteById(item.notificationId)
          .subscribe(res => {
            if (this.notificationService.requestIsSuccess(res)) {
              this.helperService.reloadHeaderNotification('complete');
              this.processSearch(null);
            }
          });
      }, () => {// on rejected

      });
    }
  }

  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.notificationService.export(params).subscribe(res => {
      saveAs(res, 'danh_muc_thong_bao');
    });
  }

  /**
   * prepareRequestNotification
   * @param item 
   */
  public prepareRequestNotification(item) {
    if (item && item.notificationId > 0) {
      this.notificationService.findOne(item.notificationId)
        .subscribe(res => {
          this.activeModal(res.data);
        });
    } else {
      this.activeModal();
    }
  }

  /**
   * show model
   * data
   */
  private activeModal(data?: any) {
    const modalRef = this.modalService.open(NotificationRequestComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.notificationService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }
}