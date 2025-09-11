import { Component, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { PartyMemberConcurrentProcessService } from '@app/core/services/party-organization/party-member-concurrent-process.service';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';
import { ACTION_FORM, APP_CONSTANTS, UserMenu } from '@app/core';
import { CategoryService } from '@app/core/services/setting/category.service';
import { HrStorage } from '@app/core/services/HrStorage';

@Component({
  selector: 'party-member-concurrent-process-form',
  templateUrl: './party-member-concurrent-process-form.component.html',
  styleUrls: ['./party-member-concurrent-process-form.component.css']
})
export class PartyMemberConcurrentProcessFormComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  tenureList = [];
  @ViewChildren('partyOrgSelector')
  public partyOrgSelector;
  isMobileScreen: boolean = false;
  formConfig = {
    partyMemberConcurrentProcessId: [null],
    employeeId: [null],
    partyMemberProcessId: [null],
    partyOrganizationId: [null, [Validators.required]],
    partyPositionId: [null, [Validators.required]],
    effectiveDate: [null, [Validators.required, ValidationService.beforeCurrentDate]],
    expiredDate: [null],
    isHighestPosition: [0],
    tenureId: [null],
    isLast: [null],
    isPartyMemberProcess: [null],
  }
  isDisabled: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private partyMemberConcurrentProcessService: PartyMemberConcurrentProcessService,
    private app: AppComponent,
    private partyMemebersService: PartyMemebersService,
    private categoryService: CategoryService
  ) {
    super();
    this.buildForms({});
    categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.TENURE).subscribe(
      res => this.tenureList = res.data
    );
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    this.checkDisabled();
  }

  setFormValue(data) {
    if (data && data.partyMemberConcurrentProcessId > 0) {
      this.buildForms(data);
    } else {
      this.buildForms(data);
    }
  }

  buildForms(data) {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT,
      [ValidationService.notAffter('effectiveDate', 'expiredDate', 'app.emp.tabMenu.partyMemberConcurrentProcess.expiredDate')]);
    if (!this.formSave.value.isPartyMemberProcess) {
      this.f['partyPositionId'].setValidators(ValidationService.required);
    } else {
      this.f['partyPositionId'].clearValidators();
    }
      this.f['partyPositionId'].updateValueAndValidity();
  }

  get f() {
    return this.formSave.controls;
  }

  processUpdate() {
    if (!this.formSave.value.isPartyMemberProcess) {
      this.f['partyPositionId'].setValidators(ValidationService.required);
    } else {
      this.f['partyPositionId'].clearValidators();
    }
      this.f['partyPositionId'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => {
      if (!this.formSave.value.isPartyMemberProcess) {
        this.partyMemberConcurrentProcessService.saveOrUpdate(this.formSave.value)
          .subscribe(res => {
            if (this.partyMemberConcurrentProcessService.requestIsSuccess(res)) {
              this.activeModal.close(res);
            }
          });
      } else if (this.formSave.value.isPartyMemberProcess) {
        this.partyMemebersService.saveOrUpdateProcess(this.formSave.value)
          .subscribe(res => {
            if (this.partyMemebersService.requestIsSuccess(res)) {
              this.activeModal.close(res);
            }
          });
      }
    }, () => { });
  }

  /**
   * onChangeUnit
   */
  onChangeUnit(event, partyOrgSelector) {
    if (event.partyOrganizationId) {
      if (this.f.partyMemberProcessId.value) {
        if (event.type !== APP_CONSTANTS.PARTY_ORG_TYPE.CBCS && event.type !== APP_CONSTANTS.PARTY_ORG_TYPE.CBTT) {
          this.app.errorMessage('partyOrgnization.notLeafPartyOrg');
          partyOrgSelector.delete();
        }
      }
      const currentDate = new Date();
      if (event.expiredDate === null) {
        const effectiveDate = new Date(event.effectiveDate);
        if (effectiveDate > currentDate) {
          this.app.errorMessage('partymember.partyOrganizationNotEffectYet');
          partyOrgSelector.delete();
        }
      } else {
        const expiredDate = new Date(event.expiredDate);
        if (expiredDate < currentDate) {
          this.app.errorMessage('partymember.partyOrganizationExpired');
          partyOrgSelector.delete();
        }
      }
    }
  }

  /**
   * Kiểm tra roles để disable input quá trình tham gia cấp Ủy
   */
   checkDisabled() {
    const isAdmin = HrStorage.getUserToken().userPermissionList.find(item => item.resourceCode == "PARTY-MEMBER-CONCURRENT-PROCESS");

    let isDetail = false;
    if (
      this.formSave.value.partyOrganizationId != null &&
      this.formSave.value.partyPositionId != null &&
      this.formSave.value.effectiveDate != null
    ) {
      isDetail = true
    } else {
      isDetail = false
    }

    if(isDetail && !this.formSave.get('isPartyMemberProcess').value){
      if(!isAdmin){
        this.isDisabled = false
      } else {
        this.isDisabled = true
        const cotrol = this.formSave.get('isHighestPosition');
        cotrol.disable()
      }
    } else {
      this.isDisabled = false
    }
  }

}