import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core';
import { FileControl } from '@app/core/models/file.control';
import { EmpTypesService } from '@app/core/services/emp-type.service';
import { PersonalPunishmentService } from '@app/core/services/punishment/personal-punishment.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'personal-punishment-form',
  templateUrl: './personal-punishment-form.component.html',
  styleUrls: ['./personal-punishment-form.component.css']
})
export class PersonalPunishmentFormComponent extends BaseComponent implements OnInit {
  employeeId: number;
  punishmentTypeList: any;
  punishmentFormList: any;
  partyPunishmentFormList: any;
  decissionLevelList: any;
  empTypeList: any;
  formSave: FormGroup;
  punishmentId: any;
  isParty: Boolean;
  isEdit: Boolean;
  empId: any;
  formConfig = {
    punishmentId: [''],
    employeeId: ['', [ValidationService.required]],
    organizationId: [''],
    gender: [''],
    birthYear: [''],
    isPartyMember: [''],
    signContractDate: [''],
    empTypeId: [''],
    joinCompanyDate: [''],
    positionName: [''],
    positionDate: [''],
    enlistDate: [''],
    joinPartyDate: [''],
    officialJoinPartyDate: [''],
    decissionNumber: ['', [ValidationService.required, ValidationService.maxLength(100)]],
    signedDate: ['', [ValidationService.required, ValidationService.beforeCurrentDate]],
    decissionLevelId: ['', [ValidationService.required]],
    punishmentTypeId: ['', [ValidationService.required]],
    signer: ['', [ValidationService.maxLength(100)]],
    punishmentFormId: [''],
    partyPunishmentFormId: [''],
    physicalResponsibility: [''],
    reason: ['', [ValidationService.required]],
    note: [''],
  };

  constructor(
    private router: Router,
    private empTypeService: EmpTypesService,
    private sysCatService: SysCatService,
    public actr: ActivatedRoute,
    private app: AppComponent,
    private personalPunishmentService: PersonalPunishmentService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.punishment"));
    this.sysCatService.getSysCatListBySysCatTypeIdSortOrderOrName(APP_CONSTANTS.PERSONAL_PUNISHMENT.CQD).subscribe(res => {
      this.decissionLevelList = res.data;
    });
    this.sysCatService.getSysCatListBySysCatTypeIdSortOrderOrName(APP_CONSTANTS.PERSONAL_PUNISHMENT.LP).subscribe(res => {
      this.punishmentTypeList = res.data;
    });
    this.sysCatService.getSysCatListBySysCatTypeIdSortOrderOrName(APP_CONSTANTS.PERSONAL_PUNISHMENT.KLCQ).subscribe(res => {
      this.punishmentFormList = res.data;
    });
    this.sysCatService.getSysCatListBySysCatTypeIdSortOrderOrName(APP_CONSTANTS.PERSONAL_PUNISHMENT.KLD).subscribe(res => {
      this.partyPunishmentFormList = res.data;
    });
    // Danh sách diện đối tượng
    this.empTypeService.getListEmpType().subscribe(res => {
      this.empTypeList = res
    });

    const params = this.actr.snapshot.params;
    if (params) {
      this.punishmentId = params.id;
    }
    this.buildForms({});
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 3) {
      if (subPaths[3] === 'add') {
        this.isEdit = false;
      } else if (subPaths[3] === 'edit') {
        this.isEdit = true;
      }
    }
    this.setFormValue();
  }

  public buildForms(data) {
    this.formSave = this.buildForm(data, this.formConfig);
    const filesControl = new FileControl(null);
    if (data) {
      if (data.fileAttachment && data.fileAttachment.personalPunishmentFiles) {
        filesControl.setFileAttachment(data.fileAttachment.personalPunishmentFiles);
      }
    }
    this.formSave.addControl('files', filesControl);
  }

  public setFormValue() {
    if (this.punishmentId && this.punishmentId > 0) {
      this.personalPunishmentService.findOne(this.punishmentId).subscribe(
        res => {
          this.empId = res.data.employeeId;
          if (this.personalPunishmentService.requestIsSuccess(res)) {
            if (res.data.isPartyMember === 1) {
              this.isParty = true;
            } else {
              this.isParty = false;
            }
            this.buildForms(res.data);
            this.formSave.removeControl('empTypeId');
            this.formSave.addControl('empTypeId', new FormControl(res.data.staffTypeId));
          }
        }
      );
    }
  }
  public goBack() {
    // Neu di tu menu quan ly ky luat thi load lai man tim kiem quan ly ki luat
    if (this.personalPunishmentService.isEmployee) {
      this.personalPunishmentService.isEmployee = false;
      this.router.navigate(['/employee/curriculum-vitae/', this.empId, 'punishment']);
    } else {
      this.router.navigate(['/monitoring-inspection/personal-punishment-managerment']);
    }
  }

  public goView(punishmentId: any) {
    // Neu di tu menu quan ly ky luat thi load lai man tim kiem quan ly ki luat
    if (this.personalPunishmentService.isEmployee) {
      this.personalPunishmentService.isEmployee = false;
      this.router.navigate(['/employee/curriculum-vitae/', this.empId, 'punishment']);
    } else {
      this.router.navigate([`/monitoring-inspection/personal-punishment-managerment/edit/${punishmentId}`]);
    }
  }

  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    if (this.formSave.controls['punishmentFormId'].value === null && this.formSave.controls['partyPunishmentFormId'].value === null) {
      this.app.warningMessage("personalPunishment.punishmentFormEitherPartyPunishmentForm");
      return;
    }
    this.app.confirmMessage(null, () => {
      this.personalPunishmentService.saveOrUpdateFormFile(this.formSave.value)
        .subscribe(res => {
          if (this.personalPunishmentService.requestIsSuccess(res) && res.data && res.data.punishmentId) {
            this.goView(res.data.punishmentId);
          }
        });
    }, () => { });
  }

  get f() {
    return this.formSave.controls;
  }

  public genData(event: any) {
    this.buildFormEmp(event.selectField);
  }

  public buildFormEmp(employeeId) {
    this.personalPunishmentService.getInfoOfEmp(employeeId)
      .subscribe(res => {
        if (this.personalPunishmentService.requestIsSuccess(res)) {
          if (CommonUtils.nvl(res.data.isPartyMember) > 0) {
            this.isParty = true;
          } else {
            this.isParty = false;
          }
          this.buildForms(res.data);
          this.formSave.removeControl('gender');
          this.formSave.addControl('gender', new FormControl(res.data.gender - 1));
        }
      });
  }
}
