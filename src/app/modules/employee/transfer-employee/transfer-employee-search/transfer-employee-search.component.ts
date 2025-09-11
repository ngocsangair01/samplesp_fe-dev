import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core/app-config';
import { TransferEmployeeService } from '@app/core/services/employee/transfer-employee.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ValidationService } from '@app/shared/services';
import { CommonUtils } from './../../../../shared/services/common-utils.service';


@Component({
  selector: 'transfer-employee-search',
  templateUrl: './transfer-employee-search.component.html',
})
export class TransferEmployeeSearchComponent extends BaseComponent implements OnInit {

  transferTypeList = APP_CONSTANTS.TRANSFER_TYPE_LIST;
  formConfig = {
    code: ['', [ValidationService.maxLength(100)]],
    name: ['', [ValidationService.maxLength(200)]],
    organizationId: [''],
    employeeId: [''],
    positionId: [''],
    documentName: [''],
    currentPositionId: [''],
    transferType: [''],
    transferDate: ['']
  };
  constructor(
    private transferEmployeeService: TransferEmployeeService,
    private router: Router,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.transferEmployee"));
    this.setMainService(transferEmployeeService);
    this.formSearch = this.buildForm({}, this.formConfig);
    this.processSearch();

  }

  ngOnInit() {

  }

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.transferEmployeeId > 0) {
      this.transferEmployeeService.findOne(item.transferEmployeeId).subscribe(res => {
        if (this.transferEmployeeService.requestIsSuccess(res)) {
          if (res.data.status == 0) {
            this.router.navigate(['/employee/transfer-employee-edit', item.transferEmployeeId]);
          } else {
            this.app.warningMessage('questionHasAnswered');
          }
        }
      });
    } else {
      this.router.navigate(['/employee/transfer-employee-add']);
    }
  }

  public prepareView(item?: any) {
    if (item && item.transferEmployeeId > 0) {
      this.transferEmployeeService.findOne(item.transferEmployeeId).subscribe(res => {
        if (this.transferEmployeeService.requestIsSuccess(res)) {
          this.router.navigate(['/employee/transfer-employee-view', item.transferEmployeeId]);
        }
      });
    }
  }

  public evaluate(item?: any) {
    if (item && item.transferEmployeeId > 0) {
      this.transferEmployeeService.findOne(item.transferEmployeeId).subscribe(res => {
        if (this.transferEmployeeService.requestIsSuccess(res)) {
          this.router.navigate(['/employee/transfer-employee-evaluate', item.transferEmployeeId]);
        }
      });
    }
  }

  processDelete(item) {
    if (item && item.transferEmployeeId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.transferEmployeeService.deleteById(item.transferEmployeeId)
          .subscribe(res => {
            if (this.transferEmployeeService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected
      });
    }
  }

  processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const formData = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(formData);
    const params = CommonUtils.buildParams(searchData);
    this.transferEmployeeService.processExport(params)
      .subscribe(res => {
        saveAs(res, 'Danh_sach_dieu_dong_can_bo.xlsx');
      });
  }

  actionApproved(item) {
    const transferEmployeeId = item.transferEmployeeId;
    if (transferEmployeeId > 0) {
      this.app.confirmMessage('confirm.transferEmployee.approved', () => {// on accepted
        this.transferEmployeeService.approval({ transferEmployeeId: transferEmployeeId })
          .subscribe(res => {
            if (this.transferEmployeeService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected
      });
    }
  }

  actionUnApproved(item) {
    const transferEmployeeId = item.transferEmployeeId;
    if (transferEmployeeId > 0) {
      this.app.confirmMessage('confirm.transferEmployee.decline', () => {// on accepted
        this.transferEmployeeService.unApproval({ transferEmployeeId: transferEmployeeId })
          .subscribe(res => {
            if (this.transferEmployeeService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected
      });
    }
  }
}