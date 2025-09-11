import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { ReceiveNotificationGroupService } from '@app/core/services/setting/recieve-notification-group.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'receive-notification-group-form',
  templateUrl: './receive-notification-group-form.component.html',
  styleUrls: ['./receive-notification-group-form.component.css']
})
export class ReceiveNotificationGroupFormComponent extends BaseComponent implements OnInit {

  formGroup: FormGroup;
  formEmployees: FormArray;
  formSearchEmployee: FormGroup;
  public receiveNotificationGroupId;
  formConfig = {
    receiveNotificationGroupId: [''],
    name: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
    isBlackList : [0]
  }
  formSearchConfig = {
    keyword: [null]
  };
  
  constructor(private formBuilder: FormBuilder
    , private router: Router
    , private receiveNotificationGroup: ReceiveNotificationGroupService
    , private curriculumVitaeService: CurriculumVitaeService
    , private activatedRoute: ActivatedRoute
    , private app: AppComponent) {
    super(null, CommonUtils.getPermissionCode("resource.receiveNotificationGroup"));
    this.buildForms({});
    this.formSearchEmployee = this.buildForm({}, this.formSearchConfig);
    this.buildFormEmps(null);
    this.activatedRoute.params.subscribe(params => {
      if (params && params.id != null) {
        this.receiveNotificationGroupId = params.id;
      }
    });
    if (this.receiveNotificationGroupId > 0) {
      this.receiveNotificationGroup.findOne(this.receiveNotificationGroupId).subscribe(res => {
        this.buildForms(res.data);
        this.buildFormEmps(res.data.listEmp);
      });
    }
  }

  ngOnInit() {
  }

  get f() {
    return this.formGroup.controls;
  }

  /**
   * build form Group
   * @param data 
   */
  private buildForms(data?: any) {
    this.formGroup = this.buildForm(data, this.formConfig);
  }

  /**
   * buildFormEmps
   */
  private buildFormEmps(listEmp?: any) {
    if (!listEmp) {
      listEmp = [{}];
    }
    const controls = new FormArray([]);
    for (const emp of listEmp) {
      const group = this.makeDefaultEmpsForm();
      group.patchValue(emp);
      controls.push(group);
    }
    controls.setValidators(ValidationService.duplicateArray(
      ['employeeId'], 'employeeId', 'recieveNotificationGroup.duplicateEmployee'));
    this.formEmployees = controls;
  }

  /**
   * makeDefaultEmpsForm
   */
  private makeDefaultEmpsForm(): FormGroup {
    return this.formBuilder.group({
      employeeId: [null, Validators.compose([Validators.required])],
      mobileNumber: [null],
      email: [null],
      employeeName: [null],
      isHidden: false,
    });
  }

  /**
   * addEmp
   * param index
   * param item
   */
  public addEmp(index: number, item: FormGroup) {
    const controls = this.formEmployees as FormArray;
    controls.insert(index + 1, this.makeDefaultEmpsForm());
  }

  /**
   * removeEmp
   * param index
   * param item
   */
  public removeEmp(index: number, item: FormGroup) {
    const controls = this.formEmployees as FormArray;
    if (controls.length === 1) {
      this.buildFormEmps(null);
    }
    controls.removeAt(index);
  }

  /**
   * goBack
   */
  public goBack() {
    this.router.navigate(['/settings/receive-notification-group']);
  }

  public processSaveOrUpdate() {
    if (!this.validateBeforeSave()) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      const formSave = this.formGroup.value;
      formSave['listEmployee'] = this.formEmployees.value;
      this.receiveNotificationGroup.saveOrUpdate(formSave)
        .subscribe(res => {
          if (this.receiveNotificationGroup.requestIsSuccess(res)) {
            this.goBack();
          }
        });
    }, () => {
      // on rejected
    });
  }

  /**
   * validateBeforeSave
   */
  private validateBeforeSave(): boolean {
    const f1 = CommonUtils.isValidForm(this.formGroup);
    const f2 = CommonUtils.isValidForm(this.formEmployees);
    return f1 && f2;
  }

  public loadUserInfo(event, item: FormGroup) {
    if (event && event.selectField > 0) {
      this.curriculumVitaeService.getEmployeeInfo(event.selectField).subscribe(res => {
        item.controls['mobileNumber'].setValue(res.data.mobileNumber);
        item.controls['email'].setValue(res.data.email);
        item.controls['employeeName'].setValue(res.data.employeeName);
      })
    } else {
      item.controls['mobileNumber'].setValue(null);
      item.controls['email'].setValue(null);
      item.controls['employeeName'].setValue(null);
    }
  }

  filterFormSubsidizedSuggest() {
    let keyword = this.formSearchEmployee.controls['keyword'].value.toLowerCase();
    this.formEmployees.controls.forEach((item: FormGroup)=> {
      if (keyword === "") {
        item.controls['isHidden'].setValue(false);
      } else {
        const isEmployeeName = item.value.employeeName ? item.value.employeeName.toLowerCase().includes(keyword) : false;
        const isEmail = item.value.email ? item.value.email.toLowerCase().includes(keyword) : false;
        const isMobileNumber = item.value.mobileNumber ? item.value.mobileNumber.includes(keyword) : false;
        if (isEmployeeName || isEmail || isMobileNumber) {
          item.controls['isHidden'].setValue(false);
        } else {
          item.controls['isHidden'].setValue(true);
        }
      }
    });
  }
}
