import { Component, OnInit, ViewChild } from "@angular/core"
import { FormArray, FormGroup } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { AppComponent } from "@app/app.component"
import { APP_CONSTANTS } from "@app/core"
import { CurriculumVitaeService } from "@app/core/services/employee/curriculum-vitae.service"
import { PartyMemberDecisionService } from "@app/core/services/party-organization/party-member-decision.service"
import { BaseComponent } from "@app/shared/components/base-component/base-component.component"
import { CommonUtils, ValidationService } from "@app/shared/services"

@Component({
  selector: "party-member-decision-form",
  templateUrl: "./party-member-decision-form.component.html",
  styleUrls: ["./party-member-decision-form.component.css"]
})
export class PartyMemberDecisionFormComponent extends BaseComponent implements OnInit {
  @ViewChild("partyBranchAdmission") partyBranchAdmission
  formSave: FormGroup
  formDecisionMember: FormArray
  decisionType: string
  DECISION_TYPE = APP_CONSTANTS.DECISION_TYPE
  isView = false
  isUpdate = false
  isInsert = false
  partyMemberDecisionId: number
  partyOrgEffectiveCondition = " curdate() BETWEEN effective_date AND IFNULL(exprited_date, curdate()) "
  childOrgCondition: string
  memberNotInDecisionCondition: string
  partyMemberCondition: string = ""
  constructor(
    public attr: ActivatedRoute,
    private app: AppComponent,
    private router: Router,
    private partyMemberDecisionService: PartyMemberDecisionService,
    private curriculumVitaeService: CurriculumVitaeService
  ) {
    super(attr, CommonUtils.getPermissionCode("resource.partyMemberDecision"))
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 2) {
      this.isInsert = subPaths[4] === 'add'
      this.isView = subPaths[4] === 'view'
      this.isUpdate = subPaths[4] === 'edit'
      this.partyMemberDecisionId = Number(subPaths[5])
      this.decisionType = subPaths[3]
    }
  }

  ngOnInit() {
    this.memberNotInDecisionCondition = " AND NOT EXISTS "
      + "(SELECT 1 "
      + "FROM decision_member dm "
      + "INNER JOIN party_member_decision pmd ON dm.party_member_decision_id = pmd.party_member_decision_id "
      + `WHERE dm.employee_id = obj.employee_id AND pmd.decision_type = ${this.DECISION_TYPE[this.decisionType].value}) `
    this.buildForms({})
    this.setFormValue()
  }

  setFormValue() {
    if (this.partyMemberDecisionId && this.partyMemberDecisionId > 0) {
      this.partyMemberDecisionService.findOne(this.partyMemberDecisionId).subscribe(res => this.buildForms(res.data))
    }
  }

  buildForms(data) {
    const validateEffectiveDateList = [ValidationService.required]
    if (this.decisionType != this.DECISION_TYPE.CRKD.code) {
      validateEffectiveDateList.push(ValidationService.afterCurrentDate);
    }
    const formConfig = {
      partyMemberDecisionId: [null],
      partyOrganizationDecisionId: [null, [ValidationService.required]],
      symbol: [this.DECISION_TYPE[this.decisionType].symbol, [ValidationService.required, ValidationService.maxLength(100)]],
      extractingTextContent: [null, [ValidationService.required, ValidationService.maxLength(250)]],
      effectiveDate: [null, validateEffectiveDateList],
      decisionType: [this.DECISION_TYPE[this.decisionType].value, [ValidationService.required]],
      signDocumentId: [null]
    }
    let queryGetAppParamConfigValue = ""
    switch (this.decisionType) {
      case this.DECISION_TYPE.KNDV.code:
        queryGetAppParamConfigValue = " CONVERT((SELECT par_value FROM app_params WHERE par_type = 'PARTY_ADMISSION_DATE_DECISION'), UNSIGNED INTEGER) "
        formConfig["partyBranchAdmissionId"] = [null, [ValidationService.required]]
        formConfig["resolutionNumberPartyBranch"] = [null, [ValidationService.required, ValidationService.maxLength(250)]]
        formConfig["resolutionNumberPartyCommittee"] = [null, [ValidationService.required, ValidationService.maxLength(250)]]
        this.partyMemberCondition = " AND obj.status = 1 "
          + "AND EXISTS (SELECT 1 FROM party_member pm "
          + "WHERE pm.employee_id = obj.employee_id "
          + "AND pm.party_admission_date IS NOT NULL "
          + "AND pm.party_official_admission_date IS NULL "
          + `AND DATEDIFF(curdate(), pm.party_admission_date) <= ${queryGetAppParamConfigValue}) `
          + this.memberNotInDecisionCondition
        break
      case this.DECISION_TYPE.CNDV.code:
        queryGetAppParamConfigValue = " CONVERT((SELECT par_value FROM app_params WHERE par_type = 'PARTY_OFFICIAL_ADMISSION_DATE_DECISION'), UNSIGNED INTEGER) "
        formConfig["resolutionNumberPartyBranch"] = [null, [ValidationService.required]]
        formConfig["resolutionNumberPartyCommittee"] = [null, [ValidationService.required]]
        this.partyMemberCondition = " AND obj.status = 1 AND "
          + "EXISTS (SELECT 1 FROM party_member pm "
          + "WHERE pm.employee_id = obj.employee_id "
          + "AND pm.party_admission_date IS NOT NULL "
          + "AND (pm.party_official_admission_date IS NULL "
          + "OR DATEDIFF(curdate(), pm.party_official_admission_date) <= 90)) "
          + this.memberNotInDecisionCondition
        break
      case this.DECISION_TYPE.XTDV.code:
      case this.DECISION_TYPE.CRKD.code:
        this.partyMemberCondition += " AND NOT EXISTS "
        + "(SELECT 1 "
        + "FROM decision_member dm "
        + "INNER JOIN party_member_decision pmd ON dm.party_member_decision_id = pmd.party_member_decision_id "
        + "WHERE dm.employee_id = obj.employee_id "
        + `AND (pmd.decision_type = ${this.DECISION_TYPE.XTDV.value} OR pmd.decision_type = ${this.DECISION_TYPE.CRKD.value}))`
        break
      case this.DECISION_TYPE.MSHD.code:
        this.partyMemberCondition = " AND NOT EXISTS "
        + "(SELECT 1 "
        + "FROM decision_member dm "
        + "INNER JOIN party_member_decision pmd ON dm.party_member_decision_id = pmd.party_member_decision_id "
        + "WHERE dm.employee_id = obj.employee_id "
        + `AND (pmd.decision_type = ${this.DECISION_TYPE.XTDV.value} OR pmd.decision_type = ${this.DECISION_TYPE.CRKD.value}))`
        formConfig["expiredDate"] = [null, [ValidationService.required]]
        this.formSave = this.buildForm(data, formConfig, null,
          [ValidationService.notAffter("effectiveDate", "expiredDate", "common.label.expiredDate")])
        break
      default:
        this.goBack()
        break
    }
    if (this.decisionType && this.decisionType != this.DECISION_TYPE.MSHD.code) {
      this.formSave = this.buildForm(data, formConfig, null, [])
    }
    this.buildFormArray(data.decisionMemberList)
  }

  buildFormArray(data) {
    this.formDecisionMember = new FormArray([])
    if (!data || data.length === 0) {
      const group = this.makeDefaultFormArray()
      this.formDecisionMember.push(group)
    } else {
      for (const item of data) {
        const group = this.makeDefaultFormArray()
        if (this.DECISION_TYPE.CNDV.code === this.decisionType && item.partyAdmissionDate) {
          var oneYearFromNow = new Date(item.partyAdmissionDate)
          oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
          item.partyOfficialAdmissionDate = oneYearFromNow
        }
        group.patchValue(item)
        this.formDecisionMember.push(group)
      }
    }
    this.formDecisionMember.setValidators([
      ValidationService.duplicateArray(["employeeId"], "employeeId", "common.label.partymembersCode"),
    ])
  }

  makeDefaultFormArray() {
    const formConfig = {
      employeeId: [null, ValidationService.required],
      fullName: [null],
      partyOfficialAdmissionDate: [null],
      partyAdmissionDate: [null],
      partyOrganizationName: [null],
    }
    switch (this.decisionType) {
      case this.DECISION_TYPE.KNDV.code:
      case this.DECISION_TYPE.CNDV.code:
        formConfig["dateOfBirth"] = [null]
        formConfig["origin"] = [null]
        break
      case this.DECISION_TYPE.XTDV.code:
      case this.DECISION_TYPE.CRKD.code:
      case this.DECISION_TYPE.MSHD.code:
        formConfig["reason"] = [null, [ValidationService.required, ValidationService.maxLength(500)]]
        break
      default:
        this.goBack()
        break
    }
    return this.buildForm({}, formConfig)
  }

  public addRow(index: number, item: FormGroup) {
    this.formDecisionMember.insert(index + 1, this.makeDefaultFormArray());
  }

  public removeRow(index: number, item: FormGroup) {
    if (this.formDecisionMember.length === 1) {
      const group = this.makeDefaultFormArray();
      this.formDecisionMember.push(group);
    }
    this.formDecisionMember.removeAt(index);
  }

  get f() {
    return this.formSave.controls
  }

  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave) || !CommonUtils.isValidForm(this.formDecisionMember)) {
      return
    }
    const saveData: any = {}
    Object.assign(saveData, this.formSave.value)
    saveData.decisionMemberList = this.formDecisionMember.value

    this.app.confirmMessage(null, () => { // on accepted
      this.partyMemberDecisionService.saveOrUpdate(saveData)
        .subscribe(res => {
          if (this.partyMemberDecisionService.requestIsSuccess(res)) {
            this.goBack()
          }
        })
    }, () => {

    })
  }

  onChangeEmployee(event, index) {
    const formGroup = this.formDecisionMember.controls[index]
    this.curriculumVitaeService.getEmployeeInfoById(event.selectField).subscribe(res => {
      if (this.curriculumVitaeService.requestIsSuccess) {
        if (this.DECISION_TYPE.CNDV.code === this.decisionType && res.data.partyAdmissionDate) {
          var oneYearFromNow = new Date(res.data.partyAdmissionDate)
          oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
          res.data.partyOfficialAdmissionDate = oneYearFromNow
        }
        formGroup.patchValue(res.data)
      }
    })
  }

  goBack() {
    this.router.navigate(['/party-organization/party-member-decision'])
  }

  exportDecision() {
    this.partyMemberDecisionService.exportDecision(this.f["signDocumentId"].value).subscribe(res => {
      saveAs(res, "File quyết định.zip")
    })
  }

  onchangeOrgBranchAdmission(event) {
    if (event.partyOrganizationId === this.f["partyOrganizationDecisionId"].value) {
      this.f["partyBranchAdmissionId"].setValue(null)
      this.partyBranchAdmission.delete()
      this.app.warningMessage("partyMemberDecision.duplicateOrg")
    }
  }
}
