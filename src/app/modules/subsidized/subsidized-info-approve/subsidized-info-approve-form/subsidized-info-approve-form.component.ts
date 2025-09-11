import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS } from '@app/core';
import { CatAllowanceService } from '@app/core/services/subsidized/cat-allowance.service';
import { SubsidizedInfoService } from '@app/core/services/subsidized/subsidized-info.service';
import { SubsidizedPeriodService } from '@app/core/services/subsidized/subsidized-period.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImportSubsidizedApproveComponent } from '../file-import-subsidized-approve/import-subsidized-approve.component';

@Component({
  selector: 'subsidized-info-approve-form',
  templateUrl: './subsidized-info-approve-form.component.html',
  styleUrls: ['./subsidized-info-approve-form.component.css']
})
export class SubsidizedInfoApproveFormComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  formSubsidizedSuggest: FormArray;
  formSearchNguoiHuong: FormGroup;
  subsidizedInfoId: any;
  isView: boolean = false;
  isApprove: boolean = false;
  listYear: any;
  periodList: any;
  beneficiaryTypeList: any;
  operationKey = 'action.view';
  adResourceKey = 'resource.subsidized';
  subsidizedTypeList: any;
  subsidizedPeriodId: any;
  listDataFamilyMember = [];
  listSubsidizedBeneficialOgrId = [];
  beneficiaryType: any;
  mapOfRelativeIdRelativeAdress: any;
  listFilteredSubsidizedSuggest: any;
  firstRowIndex = 0;
  pageSize = 10;
  decisionOrgId: any;
  moneyValidateArr = [];
  lyDoValidateArr = [];
  moneyDisableArr = [];
  lyDoDisableArr = [];
  subsidizedBeneficialOgrIdList: any;
  formConfig = {
    subsidizedPeriodId: [null],
    decisionOrgId: [null],
    beneficiaryType: [null],
    listSubsidizedBeneficialOgrId: [null],
    decisionYear: [null],
    proposeOrgId: [null],
    subsidizedType: [null],
    subsidizedInfoId: [null]
  };
  formSearchConfig = {
    keyword: [null]
  };
  tuChoi = 3;
  dongY = 2;
  soanThao = 1;

  constructor(
    private subsidizedInfoService: SubsidizedInfoService,
    private subsidizedPeriodService: SubsidizedPeriodService,
    public actr: ActivatedRoute,
    private router: Router,
    private app: AppComponent,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private catAllowanceService: CatAllowanceService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.subsidized"));
    this.subsidizedPeriodService.getListSubsidizedPeriod({}).subscribe(res => {
      this.periodList = res;
    });
    this.formSubsidizedSuggest = new FormArray([]);
    this.listFilteredSubsidizedSuggest = [];
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.subsidizedInfoId = params.id;
        } else {
          this.setFormValue({});
        }
      }
    });
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isView = subPaths[3] === 'view';
      this.isApprove = subPaths[3] === 'approve';
    }
    this.setFormValue(this.subsidizedInfoId);
    this.listYear = this.getYearList();
    this.catAllowanceService.getDataForDropdownCatAllowance({}).subscribe(res => {
      this.subsidizedTypeList = res;
    });
    this.beneficiaryTypeList = APP_CONSTANTS.BENEFCIARY_TYPE_LIST;
  }

  get f() {
    return this.formSave.controls;
  }

  private getYearList() {
    this.listYear = [];
    const currentYear = new Date().getFullYear();
    for (let i = (currentYear - 20); i <= (currentYear); i++) {
      const obj = {
        year: i
      };
      this.listYear.push(obj);
    }
    return this.listYear;
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
    this.formSearchNguoiHuong = this.buildForm(data, this.formSearchConfig, null, []);
    this.formSave.controls['listSubsidizedBeneficialOgrId'] = new FormArray([]);
  }

  /**
   * setFormValue
   * param data
   */
  public setFormValue(data?: any, keyword?: string) {
    this.buildForms({});
    if (data && data > 0) {
      this.subsidizedInfoService.findDetailByIdAndKeyword(data, keyword)
        .subscribe(res => {
          this.buildForms(res.data);
          this.beneficiaryType = res.data.beneficiaryType;
          this.loadDataPeriod();
          this.setDataToForm(res.data.listItem);
        })
    } else {
      let controls = new FormArray([]);
      const group = this.makeDefaultForm();;
      controls.push(group);
      this.setFormSubsidizedSuggest(controls);
    }
  }

   /**
   * tao ham nay de search local được
   * param controls
  */
    setFormSubsidizedSuggest(controls: FormArray) {
      this.formSubsidizedSuggest = controls;
      let keyword = this.formSearchNguoiHuong.controls['keyword'].value;
      this.listFilteredSubsidizedSuggest = [];
      for (let i = 0; i < this.formSubsidizedSuggest.controls.length; i++) {
        const item = this.formSubsidizedSuggest.controls[i];
        if (CommonUtils.isNullOrEmpty(keyword) || !item.value.employeeId) {
          this.listFilteredSubsidizedSuggest.push(i);
          continue;
        }
        var mapOfRelativeIdRelativeAdress = new Map(item['listDataFamilyMember'].map(option => [option.familyRelationshipId, option.name]));
        let relativeName = mapOfRelativeIdRelativeAdress.get(item.value.objectId) + "";
        if (item.value.employeeName.includes(keyword)
          || relativeName.includes(keyword)
          || item.value.employeeCode.includes(keyword)
        ) {
          this.listFilteredSubsidizedSuggest.push(i);
        }
      };
    }

  public checkValidSuggestForm() {
    const controls = this.formSubsidizedSuggest as FormArray;
    CommonUtils.isValidForm(this.formSubsidizedSuggest);
    let returnValue = true;
    for (let i = 0; i < controls.length; i++) {
      let currentApproveCheckValue = controls.controls[i].value.approve;
      let currentDeclineCheckValue = controls.controls[i].value.decline;
      if (currentApproveCheckValue == true) {
        if (!controls.controls[i].get('subsidizedMoney').value || controls.controls[i].get('subsidizedMoney').value === "" || controls.controls[i].get('subsidizedMoney').value*1 < 1) {
          this.moneyValidateArr[i] = true
          returnValue = false;
        } else {
          this.moneyValidateArr[i] = false
        }
      } else if (currentDeclineCheckValue == true) {
        if (!controls.controls[i].get('refuseReason').value || controls.controls[i].get('refuseReason').value === "") {
          this.lyDoValidateArr[i] = true
          returnValue = false;
        } else {
          this.lyDoValidateArr[i] = false;
        }
      } else {
        this.lyDoValidateArr[i] = false;
        this.moneyValidateArr[i] = false;
      }
    }
    return returnValue;
  }

  public processSaveOrUpdate(status: any) {
    let isValidForm = false;
    if (this.checkValidSuggestForm()) {
      isValidForm = true;
    }
    if (!isValidForm) {
      return;
    } else {
      this.moneyValidateArr.forEach(e => e = false);
      this.lyDoValidateArr.forEach(e => e = false);
    }
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    let subsidizedForm = {};
    subsidizedForm = this.formSave.value;
    subsidizedForm['status'] = status;
    subsidizedForm['subsidizedPeriodId'] = this.formSave.value['subsidizedPeriodId'];
    subsidizedForm['proposeOrgId'] = this.formSave.value['proposeOrgId'];
    subsidizedForm['subsidizedInfoId'] = this.subsidizedInfoId;
    let listItem = [];
    this.formSubsidizedSuggest.value.forEach(item => {
      let status;
      let refuseReason;
      let subsidizedMoney;
      if (item.decline == true) {
        status = this.tuChoi;
        refuseReason = item.refuseReason;
      } else if (item.approve == true) {
        status = this.dongY;
        subsidizedMoney = item.subsidizedMoney;
      } else {
        status = this.soanThao;
      }
      listItem.push({
        status: status,
        objectId: item.objectId,
        subsidizedBeneficiaryId: item.subsidizedBeneficiaryId,
        subsidizedMoney: subsidizedMoney,
        refuseReason: refuseReason,
        reason: item.reason
      });
    });
    subsidizedForm['listItem'] = listItem;
    this.app.confirmMessage(null, () => { // on accepted
      this.subsidizedInfoService.updateStatusMultiple(subsidizedForm)
        .subscribe(res => {
          if (this.subsidizedInfoService.requestIsSuccess(res)) {
            this.goBack();
          }
        });
    }, () => {
      // on rejected
    });
  }

  /**
   * Build phan tu khen thuong tap the
   * makeDefaultEmpsForm
   */
  private makeDefaultForm(): FormGroup {
    return this.formBuilder.group({
      subsidizedType: [null], // Loai tro cap
      objectId: [null], // objectId (id than nhan)
      employeeId: [null],
      employeeName: [null],
      decisionYear: [new Date().getFullYear()], // nam
      subsidizedInfoId: [null], // id
      subsidizedMoney: [null],// so tien
      reason: [null], // ly do
      createdDate: [null], // ngay phe duyet
      noteUpApprove: [null],
      isAgree: [false],
      isNotAgree: [null],
      subsidizedBeneficiaryId: [null],
      approve: [''],
      decline: [''],
      refuseReason: [null],
      approvedDate: [null],
      currentResidence: [null],
      listDataFamilyMember: [null]
    });
  }

  public goBack() {
    this.router.navigate(['/subsidized/subsidized-approve']);
  }

  public openFormImport() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    const modalRef = this.modalService.open(ImportSubsidizedApproveComponent, DEFAULT_MODAL_OPTIONS);
    const data = { subsidizedInfoId: this.subsidizedInfoId };
    modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      this.patchValueIntoForm(result.data);
    });
  }

  public patchValueIntoForm(data: any) {
    if(data && data.length > 0) {
      this.formSubsidizedSuggest.controls.forEach((item , index) => {
        const employeeId = item.get("employeeId").value;
        const objectId = item.get("objectId").value;
        data.forEach((itemResult , indexResult) => {
          if(itemResult.employeeId == employeeId && itemResult.objectId == objectId) {
            let decline = null;
            let approve = null;
            if (data[indexResult].status == 3) {
              decline = true;
              this.moneyDisableArr[index] = true;
              this.lyDoDisableArr[index] = false;
            } else if (data[indexResult].status == 2) {
              this.moneyDisableArr[index] = false;
              this.lyDoDisableArr[index] = true;
              approve = true;
            }
            item.patchValue({
              subsidizedMoney: data[indexResult].subsidizedMoney != null ? data[indexResult].subsidizedMoney : null,
              refuseReason: data[indexResult].refuseReason !== null ? data[indexResult].refuseReason : "",
              approvedDate: data[indexResult].approvedDate,
              decline: decline != null ? decline : "",
              approve: approve != null ? approve : ""
            });
            this.lyDoDisableArr[index] = decline != null ? false: true;
            this.moneyDisableArr[index] = approve != null ? false : true;
          }
        })
      })
    }
  }

  public setDataToForm(listItem) {
    let control = new FormArray([]);
    listItem.forEach(item => {
      const group = this.makeDefaultForm();
      this.loadDataRelationship(item.employeeId, group);
      let decline = null;
      let approve = null;
      if (item.status == 3) {
        decline = true;
      } else if (item.status == 2) {
        approve = true;
      }
      group.patchValue({
        objectId: item.objectId,
        employeeId: item.employeeId,
        employeeName: item.employeeName != null ? item.employeeName : "",
        reason: item.reason != null ? item.reason : "",
        subsidizedBeneficiaryId: item.subsidizedBeneficiaryId,
        approvedDate: item.approvedDate,
        refuseReason: item.refuseReason != null ? item.refuseReason : "",
        currentResidence: item.currentResidence != null ? item.currentResidence : item.employeeAdress,
        subsidizedMoney: item.subsidizedMoney != null ? item.subsidizedMoney : null,
        decline: decline != null ? decline : "",
        approve: approve != null ? approve : ""
      });
      control.push(group);
    });
    control.controls.forEach((element, index) => {
      if (element.value && element.value.decline == true) {
        this.moneyDisableArr[index] = true;
        this.lyDoDisableArr[index] = false;
      } else if (element.value && element.value.approve == true) {
        this.moneyDisableArr[index] = false;
        this.lyDoDisableArr[index] = true;
      }
    });
    this.setFormSubsidizedSuggest(control);
    this.formSubsidizedSuggest = control;
  }


  loadDataRelationship(employeeId: any, item) {
    const mapOfRelativeIdRelativeAdress = new Map<number, string>();
    let itemDataFamilyMember = [];
    if (this.beneficiaryType == 2 || this.beneficiaryType == 3) {
      this.subsidizedInfoService.getListRelationship(employeeId).subscribe(res => {
        if (res != null) {
          res.forEach(familyMember => {
            if (familyMember.permanentResidence != null) {
              mapOfRelativeIdRelativeAdress.set(familyMember.familyRelationshipId, familyMember.permanentResidence);
            }
            itemDataFamilyMember.push({
              familyRelationshipId: familyMember.familyRelationshipId,
              information: `${familyMember.relationTypeName} - ${familyMember.fullname} `
            });
          });
          if (this.beneficiaryType == 3) {
            itemDataFamilyMember.unshift({ familyRelationshipId: item.value.employeeId, information: `Bản thân - ${item.value.employeeName}` });
          }
          item.listDataFamilyMember = itemDataFamilyMember;
        } else {
          item.listDataFamilyMember = [];
        }
      });
      this.mapOfRelativeIdRelativeAdress = mapOfRelativeIdRelativeAdress;
    } else {
      // neu doi tuong khen thuong la ban than
      itemDataFamilyMember.push({ familyRelationshipId: item.value.employeeId, information: `Bản thân - ${item.value.employeeName}` });
      item.listDataFamilyMember = itemDataFamilyMember;
    }
  }

  public loadDataPeriod() {
    let periodType = this.formSave.value['subsidizedPeriodId'];
    this.subsidizedPeriodId = periodType;
    this.subsidizedPeriodService.findOne(periodType).subscribe(period => {
      this.beneficiaryType = period.data.beneficiaryType;
      this.subsidizedBeneficialOgrIdList = period.data.lstOrg;
    });
  }

  public onPeriodChange() {
    let periodType = this.formSave.value['subsidizedPeriodId'];
    this.subsidizedPeriodId = periodType;
    this.buildForms({});
    this.subsidizedPeriodService.findOne(periodType).subscribe(period => {
      this.buildForms({});
      this.beneficiaryType = period.data.beneficiaryType;
      this.subsidizedBeneficialOgrIdList = period.data.lstOrg;
      this.formSave.patchValue({
        decisionOrgId: period.data.decisionOrgId,
        beneficiaryType: period.data.beneficiaryType,
        subsidizedPeriodId: period.data.subsidizedPeriodId,
        decisionYear: period.data.decisionYear,
        subsidizedType: period.data.subsidizedType,
        proposeOrgId: period.data.proposeOrgId
      });
    });
    this.resetForm();
  }

  onClickedApprove(isApprove: boolean, index: number) {
    const controls = this.formSubsidizedSuggest as FormArray;
    for (let i = 0; i < controls.length; i++) {
      if (index === i) {
        if (isApprove) {
          let currentApproveCheckValue = controls.controls[i].value.approve;
          if (currentApproveCheckValue == true) { // uncheck approve
            controls.controls[i].get('approve').setValue("");
            this.moneyDisableArr[index] = true;
          } else { // check approve
            controls.controls[i].get('approve').setValue(!currentApproveCheckValue);
            controls.controls[i].get('decline').setValue(currentApproveCheckValue);
            this.moneyDisableArr[index] = false;
            this.lyDoDisableArr[index] = true;
          }
        } else {
          let currentDeclineCheckValue = controls.controls[i].value.decline;
          if (currentDeclineCheckValue == true) { // uncheck decline
            controls.controls[i].get('decline').setValue("");
            this.lyDoDisableArr[index] = true;
          } else { // check decine
            this.moneyDisableArr[index] = true;
            this.lyDoDisableArr[index] = false;
            controls.controls[i].get('decline').setValue(!currentDeclineCheckValue);
            controls.controls[i].get('approve').setValue(currentDeclineCheckValue);
          }
        }
      }
    }
  }

  public resetForm() {
    let control = new FormArray([]);
    control.push(this.makeDefaultForm());
    this.setFormSubsidizedSuggest(control);
    this.formSubsidizedSuggest = control;
  }

  filterFormSubsidizedSuggest() {
    const controls = this.formSubsidizedSuggest as FormArray;
    this.setFormSubsidizedSuggest(controls);
    const maxPage = Math.ceil(this.listFilteredSubsidizedSuggest.length / this.pageSize);
    this.firstRowIndex = (maxPage - 1) * this.pageSize;
    setTimeout(() => {
      this.firstRowIndex = 0;
    }, 100)
    // this.setFormValue(this.subsidizedInfoId, this.formSearchNguoiHuong.controls['keyword'].value);
  }
}
