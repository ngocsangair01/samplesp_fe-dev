import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';
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
    private partyMemebersService: PartyMemebersService,
    private employeeResolver: EmployeeResolver,
    private router: Router
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyMember"));
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
            const subPaths = this.router.url.split('/');
            if (subPaths.length > 5 && subPaths[5] === 'edit') {
              this.router.navigate(['/party-organization/party-member/curriculum-vitae', val, 'edit']);
            } else {
              this.router.navigate(['/party-organization/party-member/curriculum-vitae', val, 'view']);
            }
          });
        }
      }
    );
  
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 5) {
      this.isView = subPaths[5] === 'view';
      this.isUpdate = subPaths[5] === 'edit';
      this.isEmployeeInformation = subPaths[5] === 'employee-T63-infomation';
    }
    this.partyMemebersService.changeTab.subscribe(res => {
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

  exportPartyMemberInfo() {
    if (this.employeeId.value && this.employeeId.value > 0) {
      this.partyMemebersService.exportPartyMemberInfo(this.employeeId.value).subscribe(res => {
        saveAs(res, 'Phieu_dang_vien.docx');
      });
    }
  }

  save() {
    if (this.isUpdate) {
      this.partyMemebersService.savePartyMember.next();
    } else {
      this.partyMemebersService.saveEmployeeInformation.next();
    }
  }

  close() {
    this.router.navigate(['/party-organization/party-member/curriculum-vitae', this.employeeId.value, 'view']);
    this.isView = true;
    this.isUpdate = false;
  }

  navigate() {
    this.router.navigate(['/party-organization/party-member/curriculum-vitae', this.employeeId.value, 'edit']);
    this.isView = false;
    this.isUpdate = true;
  }
}
