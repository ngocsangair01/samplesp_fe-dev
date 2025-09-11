import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { environment } from '@env/environment';

@Component({
  selector: 'send-warning-emp-file-request',
  templateUrl: './send-warning-emp-file-request.component.html',
})
export class SendWarningEmpFileRequestComponent extends BaseComponent implements OnInit {

  formSave: FormGroup;
  formConfig = {
    organizationId: ['', ValidationService.required]
  };

  public API_URL = environment.serverUrl['political'];
  public listEmployeeNotSelected: any[] = [];
  public listEmployeeSelected: any[] = [];
  public responds: any;
  public lstPositionId: any[] = [];

  constructor(
    private curriculumVitaeService: CurriculumVitaeService,
    private app: AppComponent,
    private appParamService: AppParamService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.buildForms({});
  }

  ngOnInit() {
    this.appParamService.appParams(APP_CONSTANTS.APP_PARAM_TYPE.CEO_GROUP).subscribe(res => {
      const positionIds = res.data[0].parValue;
      if (positionIds) {
        this.lstPositionId = positionIds.split(',');
      }
    })
    this.curriculumVitaeService.getListEmpSendWarning().subscribe(res => {
      if (res && res.type != 'ERROR') {
        this.listEmployeeSelected = res;
        this.clearListEmpSendWarning();
      }
    });
  }

  get f() {
    return this.formSave.controls;
  }

  public buildForms(data?: any) {
    this.formSave = this.buildForm(data, this.formConfig)
  }

  /**
   * Gửi thông báo cập nhật hồ sơ
   */
  public processSendWarning() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    if (this.listEmployeeSelected && this.listEmployeeSelected.length <= 0) {
      return this.app.warningMessage('sendWarningEmpFile.emptyListEmpSendWaring');
    }
    this.app.confirmMessage(null, () => { // on accepted
      const formSave = this.formSave.value;
      formSave['listEmployeeSelected'] = this.listEmployeeSelected;
      this.curriculumVitaeService.sendWarningEmpFile(formSave).subscribe(res => {
        this.responds = res.data;
      });
    }, () => {
      // on rejected
    });
  }

  /**
   * clearListEmpSendWarning
   */
  public clearListEmpSendWarning() {
    if (this.listEmployeeSelected.length > 0 && this.lstPositionId.length > 0) {
      for (let i = 0; i < this.listEmployeeSelected.length; i++) {
        const emp = this.listEmployeeSelected[i];
        if (this.lstPositionId.includes(emp.positionId + "")) {
          this.listEmployeeNotSelected.push(emp);
          this.listEmployeeSelected.splice(i, 1);
          i--;
        }
      }
    }
  }
  
  /**
   * Lấy ra danh sách nhân viên theo đơn vị
   * @param event 
   */
  public onChangeOrgToGetEmp(event) {
    if (event && event.organizationId > 0) {
      this.formSave.controls['organizationId'].setValue(event.organizationId);
      this.curriculumVitaeService.getListEmpSendWarning({ organizationId: event.organizationId }).subscribe(res => {
        if (res && res.type != 'ERROR') {
          this.listEmployeeSelected = res;
          this.clearListEmpSendWarning();
        }
      });
    }
  }
}
