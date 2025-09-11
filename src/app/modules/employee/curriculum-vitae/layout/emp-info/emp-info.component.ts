import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { environment } from '@env/environment';

@Component({
  selector: 'emp-info',
  templateUrl: './emp-info.component.html',
  styleUrls: ['./emp-info.component.css']
})
export class EmpInfoComponent extends BaseComponent implements OnInit {
  @Input()
  EmployeeInfo;
  @Input()
  isViewPersonalInfo: boolean = false;
  isView: boolean = false;
  isUpdate: boolean = false;
  isEmployeeInformation: boolean = false;

  employeeId = new FormControl();
  public API_URL = environment.serverUrl['political'];
  urlAvatar: any;
  constructor(
    private curriculumVitaeService: CurriculumVitaeService,
    private employeeResolver: EmployeeResolver,
    private router: Router
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    // Load thong tin chung
    this.employeeResolver.COMMON_INFO.subscribe(
      data => {
        if (data) {
          this.curriculumVitaeService.getEmployeeInfo(data).subscribe(
            res => {
              this.EmployeeInfo = res.data;
            }
          );
        }
      }
    );
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.employeeId = new FormControl(data);
          this.employeeId.valueChanges.subscribe(val => {
            if (this.isViewPersonalInfo) {
              this.router.navigate(['/employee/curriculum-vitae', val, 'overall-info']);
            } else {
              this.router.navigate(['/employee/curriculum-vitae', val, 'edit']);
            }
          });
        }
      }
    );
  
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 4) {
      this.isView = subPaths[4] === 'view';
      this.isUpdate = subPaths[4] === 'edit';
      this.isEmployeeInformation = subPaths[4] === 'employee-T63-infomation';
    }
    this.curriculumVitaeService.changeTab.subscribe(res => {
      if (res && res === 'view') {
        this.isView = true;
        this.isUpdate = false;
        this.isEmployeeInformation = false;
      } else if (res && res === 'edit') {
        this.isView = false;
        this.isUpdate = true;
        this.isEmployeeInformation = false;
      } else if (res && res === 'employee-T63-infomation') {
        this.isView = false;
        this.isUpdate = false;
        this.isEmployeeInformation = true;
      } else {
        this.isView = false;
        this.isUpdate = false;
        this.isEmployeeInformation = false;
      }
    })
  }
  get f() {
    return this.EmployeeInfo.controls;
  }

  exportCurriculumVitae() {
    if (this.employeeId.value && this.employeeId.value > 0) {
      this.curriculumVitaeService.exportCurriculumVitae(this.employeeId.value).subscribe(res => {
        saveAs(res, 'So_yeu_ly_lich.docx');
      });
    }
  }

  save() {
    if (this.isUpdate) {
      this.curriculumVitaeService.saveCurriculumVitae.next();
      this.router.navigate(['/employee/curriculum-vitae', this.employeeId.value, 'view']);
      this.isView = true;
      this.isUpdate = false;
      this.isEmployeeInformation = false;
    } else {
      this.curriculumVitaeService.saveEmployeeInformation.next();
    }
  }

  export() {
    this.curriculumVitaeService.exportEmployeeInformation.next();
  }

  close() {
    if(document.referrer){
      window.location.href = document.referrer
    }else{
      this.router.navigate(['/employee/curriculum-vitae', this.employeeId.value,'view']);
    }
  }

  navigate() {
    this.router.navigate(['/employee/curriculum-vitae', this.employeeId.value, 'edit']);
    this.isView = false;
    this.isUpdate = true;
  }
}
