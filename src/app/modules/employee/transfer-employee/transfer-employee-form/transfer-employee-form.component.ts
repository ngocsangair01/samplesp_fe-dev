import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { EmployeeProfileService } from '@app/core/services/employee/employee_profile.service';
import { TransferEmployeeService } from '@app/core/services/employee/transfer-employee.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { ValidationService } from '@app/shared/services/validation.service';

@Component({
  selector: 'transfer-employee-form',
  templateUrl: './transfer-employee-form.component.html'
})
export class TransferEmployeeFormComponent extends BaseComponent implements OnInit {
  lstPosition: any;
  formSave: FormGroup;
  transferEmployeeId: any;
  transferTypeList = APP_CONSTANTS.TRANSFER_TYPE_LIST;
  isUpdate: boolean = false;
  isInsert: boolean = false;
  isAnswer: boolean = false;
  isView: boolean = false;
  enablePosition: boolean = false;

  formConfig = {
    transferEmployeeId: [''],
    name: ['', [ValidationService.required, ValidationService.maxLength(200)]],
    code: [''],
    organizationId: ['', [ValidationService.required]],
    employeeId: ['', [ValidationService.required]],
    oldPositionId: [''],
    positionId: ['', [ValidationService.required]],
    transferType: ['', [ValidationService.required]],
    transferDate: ['', [ValidationService.required]],
    documentId: ['', [ValidationService.required]],
    description: [null, [ValidationService.maxLength(1000)]]
  };

  constructor(
    private transferEmployeeService: TransferEmployeeService,
    private employeeProfileService: EmployeeProfileService,
    public actr: ActivatedRoute,
    private router: Router,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.transferEmployee"));
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.transferEmployeeId = params.id;
        }
      }
    });
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 2) {
      this.isUpdate = subPaths[2] === 'transfer-employee-edit';
      this.isInsert = subPaths[2] === 'transfer-employee-add';
      this.isView = subPaths[2] === 'question-and-answer-view';
      this.isAnswer = subPaths[2] === 'answer-question';
      if (this.isAnswer) {
        this.formSave.removeControl('answer');
        const answer = new FormControl('', [ValidationService.required, ValidationService.maxLength(10000)]);
        this.formSave.addControl('answer', answer);
      }
    }
    this.setFormValue(this.transferEmployeeId);
    this.autogenousCode();
  }

  get f() {
    return this.formSave.controls;
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
  }

  /**
   * setFormValue
   * param data
   */
  public setFormValue(data?: any) {

    this.buildForms({});
    if (data && data > 0) {
      this.transferEmployeeService.findOne(data).subscribe(
        res => {
          this.buildForms(res.data);
          if (res.data.employeeId != null) {
            this.changeOldPosition(res.data.employeeId);
          }
          const organizationId = this.f['organizationId'].value;
          const transferDate = this.f['transferDate'].value;
          const param = {};
          param['organizationId'] = organizationId;
          param['transferDate'] = transferDate;
          this.enablePosition = true;
          this.transferEmployeeService.findPositionByOrgId(param).subscribe(
            res => {
              this.lstPosition = res.data;
            }
          );
        }
      );
    }
  }

  public autogenousCode() {
    this.f['positionId'].setValue(null);
    const organizationId = this.f['organizationId'].value;
    const transferDate = this.f['transferDate'].value;
    const param = {};
    param['organizationId'] = organizationId;
    param['transferDate'] = transferDate;
    param['transferEmployeeId'] = this.f['transferEmployeeId'].value;
    if (organizationId && organizationId != '' && transferDate != '' && transferDate != null) {
      this.enablePosition = true;
      this.transferEmployeeService.autogenousCode(param)
        .subscribe(res => {
          if (this.transferEmployeeService.requestIsSuccess(res)) {
            this.f['code'].setValue(res.data);
          }
        });
      this.transferEmployeeService.findPositionByOrgId(param)
        .subscribe(res => {
          this.lstPosition = res.data;
        });
    } else {
      this.f['code'].setValue(null);
      this.lstPosition = []
    }
  }

  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    } else {
      this.app.confirmMessage(null, () => { // on accepted
        this.transferEmployeeService.saveOrUpdate(this.formSave.value)
          .subscribe(res => {
            if (this.transferEmployeeService.requestIsSuccess(res)) {
              this.goBack();
            }
          });
      }, () => {
        // on rejected
      });
    }
  }

  public goBack() {
    this.router.navigate(['/employee/transfer-employee']);
  }

  public changeEmployee(event?) {
    if (event != null) {
      const employeeId = event.selectField;
      this.changeOldPosition(employeeId);
    }
  }

  private changeOldPosition(employeeId) {
    this.employeeProfileService.getPositionInfoByEmployeeId(employeeId).subscribe(res => {
      if (this.employeeProfileService.requestIsSuccess(res)) {
        if (res.data != null) {
          this.formSave.removeControl('oldPositionId');
          this.formSave.addControl('oldPositionId', new FormControl(res.data.positionId, []));
        } else {
          this.formSave.removeControl('oldPositionId');
          this.formSave.addControl('oldPositionId', new FormControl(null, []));
        }
      }
    });
  }
}