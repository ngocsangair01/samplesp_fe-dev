import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { environment } from '@env/environment';

@Component({
  selector: 'emp-info-clone',
  templateUrl: './emp-info-clone.component.html',
  styleUrls: ['./emp-info-clone.component.css']
})
export class EmpInfoCloneComponent extends BaseComponent implements OnInit {
  @Input()
  EmployeeInfo;
  @Input()
  isViewPersonalInfo: boolean = false;

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
              this.router.navigate(['/employee/curriculum-vitae-clone', val, 'overall-info']);
            } else {
              this.router.navigate(['/employee/curriculum-vitae-clone', val, 'edit']);
            }
          });
        }
      }
    );
  
  }

  ngOnInit() {
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
}
