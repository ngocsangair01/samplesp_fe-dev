import { AppComponent } from '@app/app.component';
import { ManagementEmployeeService } from '../../../core/services/mass-organization/management-employee.service';
import { BaseComponent } from './../../../shared/components/base-component/base-component.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { ACTION_FORM } from '@app/core';
import { ManagementEmployeeAddPositionComponent } from './form-children/management-employee-add-position.component';

@Component({
  selector: 'management-employee-add',
  templateUrl: './management-employee-add.component.html',
  styleUrls: ['./management-employee-add.component.css']
})
export class ManagementEmployeeAddComponent extends BaseComponent implements OnInit {
  @ViewChild('position')
  public positionForm: ManagementEmployeeAddPositionComponent;
  formSave: FormGroup;
  bo: any;
  branch: any;
  lstEmpType: any;
  lstMassPosition: any;
  employeeId: any;
  view: boolean;
  update: boolean;
  employeeFilterCondition: string;
  numIndex = 1;
  formconfig = {
    branch: [''],
    employeeId: ['', ValidationService.required],
    empTypeName: [''],
    code: [''],
    name: [''],
    mobileNumber: [''],
    cmt: [''],
    status: [''],
    dateOfBirth: ['']
  }
  constructor(
    private router: Router,
    private managementEmployeeService: ManagementEmployeeService,
    private app: AppComponent,
    public actr: ActivatedRoute,
  ) {
    super(actr, CommonUtils.getPermissionCode("resource.massMember"), ACTION_FORM.INSERT);
    // get params
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.employeeId = params.id;
      }
    });
    this.buildForms({});
    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 2) {
      if (subPaths[2] === 'women') {
        this.branch = 1;
      }
      if (subPaths[2] === 'youth') {
        this.branch = 2;
      }
      if (subPaths[2] === 'union') {
        this.branch = 3;
      }
    }
    this.f['branch'].setValue(this.branch);
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 4) {
      if (subPaths[4] == 'view') {
        this.view = true;
        this.update = false;
      } else {
        this.view = false;
        this.update = true;
      }
    }
    this.setFormValue(this.employeeId);
  }

  get f() {
    return this.formSave.controls;
  }

  public goBack() {
    if (this.branch == 1) {
      this.router.navigate(['/mass/women/employee-management']);
    }
    if (this.branch == 2) {
      this.router.navigate(['/mass/youth/employee-management']);
    }
    if (this.branch == 3) {
      this.router.navigate(['/mass/union/employee-management']);
    }
  }

  public getLstEmpType(data: any) { // get list dien doi tuong
    this.managementEmployeeService.getLstEmpType(data).subscribe(res => {
      this.formSave.controls['empTypeName'].setValue(res.empTypeName);
    });
  }

  public processSaveOrUpdate() {
    const formSave = CommonUtils.isValidForm(this.formSave);
    const formPosition = CommonUtils.isValidForm(this.positionForm.formPosition);
    if (formSave && formPosition && this.positionForm.formPosition.controls.length > 0) {
      this.positionForm.formPosition.value[0].employeeId = this.employeeId;
      for (let i = 0; i < this.positionForm.formPosition.value.length; i++) {
        var item = this.positionForm.formPosition.value[i];
        for (let j = i + 1; j < this.positionForm.formPosition.value.length; j++) {
          var itemCmp = this.positionForm.formPosition.value[j];
          if (item.massOrganizationId == itemCmp.massOrganizationId && item.massPositionId == itemCmp.massPositionId) {
            this.app.errorMessage("massmember.duplicateItemInListData");
            return;
          }
        }
      }

      this.app.confirmMessage('', () => { // accept
        this.managementEmployeeService.saveMassMemberList(this.positionForm.formPosition.value)
          .subscribe(res => {
            if (this.managementEmployeeService.requestIsSuccess(res) && res.data && res.data.employeeId) {
              if (this.branch == 1) {
                this.router.navigate([`/mass/women/employee-management/view/${res.data.employeeId}`]);
              }
              if (this.branch == 2) {
                this.router.navigate([`/mass/youth/employee-management/view/${res.data.employeeId}`]);
              }
              if (this.branch == 3) {
                this.router.navigate([`/mass/union/employee-management/view/${res.data.employeeId}`]);
              }
            }
          })
      }, () => { // reject

      });
    }
    // else {
    //   this.app.confirmMessage('', () => { // accept
    //     this.managementEmployeeService.deleteByEmployeeId(this.branch, this.employeeId).subscribe(res => {
    //         if (this.managementEmployeeService.requestIsSuccess(res)) {
    //           if (this.branch == 1) {
    //             this.router.navigate(['/mass/women/employee-management']);
    //           }
    //           if (this.branch == 2) {
    //             this.router.navigate(['/mass/youth/employee-management']);
    //           }
    //           if (this.branch == 3) {
    //             this.router.navigate(['/mass/union/employee-management']);
    //           }
    //         }
    //       })
    //   }, () => { // reject
    //
    //   });
    // }
  }

  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.managementEmployeeService.getEmployee(data)
        .subscribe(res => {
          this.buildForms(res.data);
        });

      this.managementEmployeeService.getDataDetail(this.branch, data)
        .subscribe(res => {
          this.positionForm.initPositionForm(res.data);
        });
    }
  }

  public buildForms(data?: any) {
    this.formSave = this.buildForm(data, this.formconfig);
  }

  navigate() {
    if (this.branch == 1) {
      this.router.navigate(['/mass/women/employee-management/edit', this.employeeId]);
    }
    if (this.branch == 2) {
      this.router.navigate(['/mass/youth/employee-management/edit', this.employeeId]);
    }
    if (this.branch == 3) {
      this.router.navigate(['/mass/union/employee-management/edit', this.employeeId]);
    }
  }
};