import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { PartyOrganizationService } from '@app/core';
import { APP_CONSTANTS } from '@app/core/app-config';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';
import { TransferPartyMemberService } from '@app/core/services/party-organization/transfer-party-member.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { PartyOrgSelectorComponent } from '@app/shared/components/party-org-selector/party-org-selector.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'transfer-party-member-form',
  templateUrl: './transfer-party-member-form.component.html',
  styleUrls: ['./transfer-party-member-form.component.css']
})
export class TransferPartyMemberFormComponent extends BaseComponent implements OnInit {

  public formTransferPartyMember: FormGroup;
  formTransferPartyMemberConfig = {
    transferPartyMemberId: [null],
    employeeId: [null, [ValidationService.required]],
    transferType: [null, [ValidationService.required]],
    currentOrganization: [null],
    currentPosition: [null],
    partyOrganizationOldName: [null, [ValidationService.maxLength(200)]],
    partyOrganizationOldId: [null],
    partyOrganizationName: [null, [ValidationService.maxLength(200)]],
    partyOrganizationId: [null, [ValidationService.required]],
    partyBasicId: [null],
    partyPositionOldName: [null, [ValidationService.maxLength(200)]],
    partyPositionName: [null, [ValidationService.maxLength(200)]],
    partyPositionId: [null],
    status: [null],
    description: [null, [ValidationService.maxLength(1000)]]
  };

  public transferTypeList = APP_CONSTANTS.TRANSFER_PARTY_MEMBER_TYPE;
  public conditionPartyMember: string = null;
  public transferPartyMemberId: string;
  public selectedType: boolean = false;
  public intoVtFromOut: boolean = false;
  public outOfVt: boolean = false;
  public isView: boolean = false;
  public isUpdate: boolean = false;
  public partyOrgRootId: any;
  public rootId: any;
  public isSearchByPartyDomainData: string = 'false';
  public conditionPartyOrganization: string = null;
  public conditionPartyBasicOrganization: string = null;
  public listIdCB: string = '';
  public mustChoseBasicPatyOrg: boolean = false;
  @ViewChildren('partyOrgSelector')
  public partyOrgSelector;
  @ViewChild('partyBasicOrg')
  public partyBasicOrg;
  isMobileScreen: boolean = false;

  constructor(
    private partyMemebersService: PartyMemebersService,
    public actr: ActivatedRoute,
    private app: AppComponent,
    public sysCatService: SysCatService,
    public curriculumVitaeService: CurriculumVitaeService,
    public transferPartyMemberService: TransferPartyMemberService,
    public partyOrganizationService: PartyOrganizationService,
    public appParamService: AppParamService,
    private router: Router) {
    super(null, CommonUtils.getPermissionCode("resource.transferPartyMember"));
    this.buildTransferPartyMemberForm({});
    const params = this.actr.snapshot.params;
    if (params) {
      this.transferPartyMemberId = params.id;
    }
    if (this.transferPartyMemberId && this.transferPartyMemberId !== null && this.transferPartyMemberId !== ''
      && this.actr.snapshot.paramMap.get('view') !== 'view') {
      this.isUpdate = true;
    } else if (this.transferPartyMemberId && this.transferPartyMemberId !== null && this.transferPartyMemberId !== ''
      && this.actr.snapshot.paramMap.get('view') === 'view') {
      this.isView = true;
    }

    this.listIdCB = APP_CONSTANTS.CATEGORY_ID.CBCS_CBTT;
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    if (this.transferPartyMemberId && this.transferPartyMemberId !== null && this.transferPartyMemberId !== '') {
      this.setFormValue(this.transferPartyMemberId);
    }
    this.appParamService.appParams(APP_CONSTANTS.APP_PARAM_TYPE.PARTY_ORG_ROOT_ID).subscribe(res => {
      this.partyOrgRootId = res.data[0].parValue;
    })
  }

  get f() {
    return this.formTransferPartyMember.controls;
  }

  /**
   * buildPartyMembersProcessForm
   * @param event
   */
  private buildTransferPartyMemberForm(data?: any, validate?: boolean): void {
    if (validate) {
      this.formTransferPartyMember = this.buildForm(data || {}, this.formTransferPartyMemberConfig);
      this.formTransferPartyMember.removeControl('partyOrganizationId');
      this.formTransferPartyMember.addControl('partyOrganizationId', new FormControl(null));
      this.formTransferPartyMember.removeControl('partyPositionId');
      this.formTransferPartyMember.addControl('partyPositionId', new FormControl(null));
    } else {
      this.formTransferPartyMember = this.buildForm(data || {}, this.formTransferPartyMemberConfig);
      this.formTransferPartyMember.removeControl('partyOrganizationId');
      this.formTransferPartyMember.addControl('partyOrganizationId', new FormControl(data.partyOrganizationId || null, [Validators.required]));
      this.formTransferPartyMember.removeControl('partyPositionId');
      this.formTransferPartyMember.addControl('partyPositionId', new FormControl(data.partyPositionId || null));
    }
    if (data.partyBasicId > 0) {
      this.conditionPartyBasicOrganization = '(type IN (' + this.listIdCB + ')  OR party_organization_id = ' + this.f['partyOrganizationId'].value + ')';
      this.mustChoseBasicPatyOrg = true;
    }
  }

  /**
   * goBack
   */
  public goBack() {
    this.router.navigate(['/party-organization/transfer-party-member']);
  }

  public goView(transferPartyMemberId: any) {
    this.router.navigate([`/party-organization/transfer-party-member-view/${transferPartyMemberId}/view`]);
  }

  /**
   * Thay đổi câu điều kiện theo hình thức điều chuyển
   * @param data
   */
  public onChangeStringCondition(data) {
    this.selectedType = true;
    if (data === 1) {//Chuyen sinh hoat noi bo
      this.isSearchByPartyDomainData = 'true';
      this.intoVtFromOut = false;
      this.outOfVt = false;
      this.conditionPartyMember = ' AND obj.status = 1';
      this.conditionPartyOrganization = ' type NOT IN (' + this.listIdCB + ') ';
    } else if (data === 2) {//Chuyen sinh hoat nghi viec
      this.isSearchByPartyDomainData = 'true';
      this.intoVtFromOut = false;
      this.outOfVt = true;
      this.conditionPartyMember = ' AND obj.status = 2'
    } else if (data === 3) {//Chuyen sinh hoat tu ngoai vao
      this.isSearchByPartyDomainData = 'false';
      this.intoVtFromOut = true;
      this.outOfVt = false;
      this.conditionPartyMember = ' AND obj.status = 1';
      this.conditionPartyOrganization = ' type NOT IN (' + this.listIdCB + ') ';
    } else if (!data) {
      this.intoVtFromOut = false;
      this.selectedType = false;
    }
    this.buildTransferPartyMemberForm({}, this.outOfVt);
    this.formTransferPartyMember.get('transferType').setValue(data);
  }

  public onChangeStringConditionPartyOrg(data) {
    this.selectedType = true;
    if (data === 1) {
      this.isSearchByPartyDomainData = '';
      this.intoVtFromOut = false;
      this.outOfVt = false;
      this.conditionPartyMember = ' AND obj.status = 1'
    } else if (data === 2) {
      this.isSearchByPartyDomainData = 'true';
      this.intoVtFromOut = false;
      this.outOfVt = true;
      this.conditionPartyMember = ' AND obj.status = 2'
    } else if (data === 3) {
      this.isSearchByPartyDomainData = 'false';
      this.intoVtFromOut = true;
      this.outOfVt = false;
      this.conditionPartyMember = ' AND obj.status = 1'
    } else if (!data) {
      this.intoVtFromOut = false;
      this.selectedType = false;
    }
    this.buildTransferPartyMemberForm({}, this.outOfVt);
    this.formTransferPartyMember.get('transferType').setValue(data);
  }
  /**
   * onChangEmployeeCode
   * @param event
   */
  public onChangEmployeeCode(event) {
    if (event) {
      this.transferPartyMemberService.getDataFormValue(event.selectField).subscribe(res => {
        if (res) {
          this.formTransferPartyMember.get('currentOrganization').setValue(res.organizationName);
          this.formTransferPartyMember.get('currentPosition').setValue(res.positionName);
          this.formTransferPartyMember.get('partyOrganizationOldName').setValue(res.partyOrganizationName);
          this.formTransferPartyMember.get('partyOrganizationOldId').setValue(res.partyOrganizationId);
          this.formTransferPartyMember.get('partyPositionOldName').setValue(res.partyPositionName);
        }
      })
    }
  }

  /**
   * processSaveOrUpdate
   */
  public processSaveOrUpdate() {
    const validateForm = CommonUtils.isValidFormAndValidity(this.formTransferPartyMember);
    if (!validateForm) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accepted
      this.transferPartyMemberService.saveOrUpdate(this.formTransferPartyMember.value)
        .subscribe(res => {
          if (this.partyMemebersService.requestIsSuccess(res) && res.data && res.data.transferPartyMemberId) {
            this.goView(res.data.transferPartyMemberId);
          }
        });
    }, () => {
      // on rejected
    });
  }

  /**
   * Set form khi sửa
   * @param data
   */
  public setFormValue(data?: any) {
    if (data && data > 0) {
      if (this.isView) {
        this.transferPartyMemberService.findOneIsView(data).subscribe(res => {
          if (res.data) {
            if (res.data.transferType === 1) {
              this.intoVtFromOut = false;
              this.outOfVt = false;
            } else if (res.data.transferType === 2) {
              this.intoVtFromOut = false;
              this.outOfVt = true;
            } else if (res.data.transferType === 3) {
              this.intoVtFromOut = true;
              this.outOfVt = false;
            }
            this.buildTransferPartyMemberForm(res.data, this.outOfVt);
            this.transferPartyMemberService.viewDataFormValue(res.data.transferPartyMemberId).subscribe(resp => {
              if (resp) {
                this.formTransferPartyMember.get('currentOrganization').setValue(resp.organizationName);
                this.formTransferPartyMember.get('currentPosition').setValue(resp.positionName);
                this.formTransferPartyMember.get('partyOrganizationOldId').setValue(resp.partyOrganizationId);
                if (res.data.transferType === 1 || res.data.transferType === 2) {
                  this.formTransferPartyMember.get('partyOrganizationOldName').setValue(resp.partyOrganizationName);
                  this.formTransferPartyMember.get('partyPositionOldName').setValue(resp.partyPositionName);
                }
              }
            });
            this.selectedType = true;
            this.isUpdate = false;
          }
        });
      } else if (this.isUpdate) {
        this.transferPartyMemberService.findOne(data)
          .subscribe(res => {
            if (res.data) {
              if (res.data.transferType === 1) {
                this.intoVtFromOut = false;
                this.outOfVt = false;
              } else if (res.data.transferType === 2) {
                this.intoVtFromOut = false;
                this.outOfVt = true;
              } else if (res.data.transferType === 3) {
                this.intoVtFromOut = true;
                this.outOfVt = false;
              }
              this.transferPartyMemberService.viewDataFormValue(res.data.transferPartyMemberId).subscribe(resp => {
                if (resp) {
                  this.formTransferPartyMember.get('currentOrganization').setValue(resp.organizationName);
                  this.formTransferPartyMember.get('currentPosition').setValue(resp.positionName);
                  this.formTransferPartyMember.get('partyOrganizationOldId').setValue(resp.partyOrganizationId);
                  if (res.data.transferType === 1 || res.data.transferType === 2) {
                    this.formTransferPartyMember.get('partyOrganizationOldName').setValue(resp.partyOrganizationName);
                    this.formTransferPartyMember.get('partyPositionOldName').setValue(resp.partyPositionName);
                  }
                }
              });
              this.onChangeStringCondition(res.data.transferType);
              this.buildTransferPartyMemberForm(res.data, this.outOfVt);
              this.selectedType = true;
              this.isUpdate = true;
            }
          });
      }
    }
  }

  navigate() {
    this.router.navigate(['/party-organization/transfer-party-member-edit', this.transferPartyMemberId]);
  }

  onChangeNewPartyOrg(event) {
    if (event && event.partyOrganizationId > 0) {
      this.f['partyBasicId'].setValue(null);
      if (event.type === APP_CONSTANTS.PARTY_ORG_TYPE.TTQUTU || event.type === APP_CONSTANTS.PARTY_ORG_TYPE.DBCTTTCS) {
        this.mustChoseBasicPatyOrg = true;
        this.f['partyBasicId'].setValidators(Validators.required);
        this.conditionPartyBasicOrganization = ' (type IN (' + this.listIdCB + ')  OR party_organization_id = ' + event.partyOrganizationId + ')';
      } else {
        this.f['partyBasicId'].clearValidators();
        this.f['partyBasicId'].updateValueAndValidity();
        this.mustChoseBasicPatyOrg = false;
      }
    }
  }

  onChangeNewPartyBasicOrg(event) {
    if (event && event.partyOrganizationId > 0 && event.type !== APP_CONSTANTS.PARTY_ORG_TYPE.CBCS) {
      (this.partyBasicOrg as PartyOrgSelectorComponent).delete();
      this.app.warningMessage('transferPartyMembers.basicPartyOrgOnly');
    }
  }
}
