import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { RetiredContactService } from '@app/core/services/employee/retired-contact.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { environment } from '@env/environment';

@Component({
  selector: 'emp-info-retired',
  templateUrl: './emp-info.component.html',
  styleUrls: ['./emp-info.component.css']
})
export class EmpInfoRetiredComponent extends BaseComponent implements OnInit {
  @Input()
  EmployeeInfo;
  @Input()
  isViewPersonalInfo: boolean = false;

  employeeId = new FormControl();
  public API_URL = environment.serverUrl['political'];
  urlAvatar: any;
  constructor(
    private curriculumVitaeService: CurriculumVitaeService,
    private retiredContactService: RetiredContactService,
    private employeeResolver: EmployeeResolver,
    private router: Router
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    // Load thong tin chung
    this.employeeResolver.COMMON_INFO.subscribe(
      data => {
        if (data) {
          this.retiredContactService.findById(data).subscribe(
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
              this.router.navigate(['/employee/retired', val, 'view']);
            } else {
              this.router.navigate(['/employee/retired', val, 'edit']);
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
}
