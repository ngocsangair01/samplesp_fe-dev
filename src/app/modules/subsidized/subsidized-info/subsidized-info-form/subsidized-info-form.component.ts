import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, SUBSIDIZED_STATUS } from '@app/core';
import { CatAllowanceService } from '@app/core/services/subsidized/cat-allowance.service';
import { SubsidizedInfoService } from '@app/core/services/subsidized/subsidized-info.service';
import { SubsidizedPeriodService } from '@app/core/services/subsidized/subsidized-period.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SortEvent } from 'primeng/api';
import { ImportSubsidizedComponent } from './file-import-subsidized-management/import-subsidized.component';

@Component({
  selector: 'subsidized-info-form',
  templateUrl: './subsidized-info-form.component.html',
  styleUrls: ['./subsidized-info-form.component.css']
})
export class SubsidizedInfoFormComponent extends BaseComponent implements OnInit {
  search = '';
  formSave: FormGroup;
  formSearchNguoiHuong: FormGroup;
  formSubsidizedSuggest: FormArray;
  numIndex = 1;
  subsidizedInfoId: any;
  isUpdate: boolean = false;
  isInsert: boolean = false;
  isView: boolean = false;
  listYear: any;
  firstRowIndex = 0;
  pageSize = 10;
  beneficiaryTypeList: any;
  periodList: any;
  listDataFamilyMember = [];
  listSubsidizedBeneficialOgrId = [];
  subsidizedType: any;
  subsidizedPeriodId: any;
  proposeOrgId: any;
  employeeFilterCondition: String;
  employeeId: any;
  decisionOrgId: any;
  mapOfRelativeIdRelativeAdress: any;
  objectId: any
  subsidizedTypeList: any;
  beneficiaryType: any;
  subsidizedBeneficialOgrIdList: any;
  proposeOgrId: any;
  operationKey = 'action.view';
  adResourceKey = 'resource.subsidized';
  formConfig = {
    subsidizedPeriodId: [null, [ValidationService.required]],
    decisionOrgId: [null, [ValidationService.required]],
    beneficiaryType: [null, [ValidationService.required]],
    listSubsidizedBeneficialOgrId: [null, [ValidationService.required]],
    decisionYear: [null, [ValidationService.required]],
    proposeOrgId: [null, [ValidationService.required]],
    subsidizedType: [null, [ValidationService.required]],
    listItem: [null],
    status: [null],
    lstOgrId: [null]
  };
  formSearchConfig = {
    keyword: [null]
  };

  constructor(
    private subsidizedInfoService: SubsidizedInfoService,
    public actr: ActivatedRoute,
    private router: Router,
    private app: AppComponent,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private subsidizedPeriodService: SubsidizedPeriodService,
    private catAllowanceService: CatAllowanceService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.subsidized"));
    this.buildFormSubsidizedSuggest();

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
      this.isUpdate = subPaths[3] === 'edit';
      this.isInsert = subPaths[3] === 'add';
    }
    this.setFormValue(this.subsidizedInfoId);
    this.listYear = this.getYearList();
    this.subsidizedPeriodService.getListSubsidizedPeriod(
      { isNeverBeUsed: this.isInsert ? 1 : 0, isSyncedData: this.isInsert ? 0 : null }).subscribe(res => {
      this.periodList = res;
    });
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
    this.onProposeOrgChange();
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
      this.formSubsidizedSuggest = controls;
    }
  }

  public processSaveOrUpdate() {
    let isInvalidForm = false;
    if (!CommonUtils.isValidForm(this.formSubsidizedSuggest)) {
      isInvalidForm = true;
    }
    if (!CommonUtils.isValidForm(this.formSave.controls['subsidizedPeriodId'])) {
      isInvalidForm = true;
    }
    if (!CommonUtils.isValidForm(this.formSave.controls['proposeOrgId'])) {
      isInvalidForm = true;
    }
    if (isInvalidForm) {
      return;
    }
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    if (!this.formSubsidizedSuggest || this.formSubsidizedSuggest.length === 0) {
      this.app.warningMessage('pleaseChooseAtLeastOne');
      return;
    }
    if (!this.checkDuplidateRow()) {
      return;
    }
    const subsidizedForm = {};
    subsidizedForm['subsidizedPeriodId'] = this.formSave.value['subsidizedPeriodId'];
    subsidizedForm['proposeOrgId'] = this.formSave.value['proposeOrgId'];
    subsidizedForm['subsidizedInfoId'] = this.subsidizedInfoId;
    subsidizedForm['status'] = SUBSIDIZED_STATUS.SOAN_THAO;

    let listItem = [];
    this.formSubsidizedSuggest.value.forEach(item => {
      listItem.push({
        status: SUBSIDIZED_STATUS.SOAN_THAO,
        objectId: item.objectId,
        reason: item.reason
      });
    });
    subsidizedForm['listItem'] = listItem;
    this.app.confirmMessage(null, () => { // on accepted
      this.subsidizedInfoService.saveOrUpdate(subsidizedForm)
        .subscribe(res => {
          if (this.subsidizedInfoService.requestIsSuccess(res) && res.data && res.data.subsidizedInfoId) {
            this.goView(res.data.subsidizedInfoId);
          }
        });
    }, () => {
      // on rejected   
    });
  }

  /**
   * them ban ghi khen thuong tap the
   * addEmp
   * param index
   * param item
   */
  public addRow(index: number, item: FormGroup) {
    const controls = this.formSubsidizedSuggest as FormArray;
    controls.insert(controls.length, this.makeDefaultForm());
    const maxPage = Math.ceil(this.formSubsidizedSuggest.controls.length / this.pageSize);
    this.firstRowIndex = (maxPage - 1) * this.pageSize;
  }

  /**
   * xoa ban ghi khen thuong tap the
   * removeEmp
   * param index
   * param item
   */
  public remove(index: number, item: FormGroup) {
    const controls = this.formSubsidizedSuggest as FormArray;
    if (controls.length === 0) {
      this.buildFormSubsidizedSuggest(null);
    }
    controls.removeAt(index);
    this.sortDataTable();
    let listDataFamilyMember = this.listDataFamilyMember;
    listDataFamilyMember.splice(index, 1);
    this.listDataFamilyMember = listDataFamilyMember;
  }

  public initPositionForm(listSubsidized?: any) {
    this.buildFormSubsidizedSuggest(listSubsidized);
  }

  /**
   * build form danh sach nhan vien duoc tro cap
   * @param listSubsidized 
   */
  private buildFormSubsidizedSuggest(listRewardGroup?: any) {
    let isValue = true;
    if (!listRewardGroup) {
      listRewardGroup = [{}];
      isValue = false;
    }
    let controls = new FormArray([]);
    if (this.formSubsidizedSuggest && this.formSubsidizedSuggest.length > 0) {
      controls = this.formSubsidizedSuggest;
    }

    if (isValue) {
      for (const emp of listRewardGroup) {
        const group = this.makeDefaultForm();
        group.patchValue(emp);
        controls.push(emp);
        this.numIndex++;
      }
    }
    this.formSubsidizedSuggest = controls;
  }
  /**
   * Build phan tu khen thuong tap the
   * makeDefaultEmpsForm
   */
  private makeDefaultForm(): FormGroup {
    return this.formBuilder.group({
      objectId: [null, [ValidationService.required]], // objectId (id than nhan)
      employeeId: [null, [ValidationService.required]],
      employeeName: [null],
      subsidizedInfoId: [null], // id
      reason: [null], // ly do
      currentRessidence: [null],
      listDataFamilyMember: [null],
      employeeCode: [null],
      isShow: true,
      isDuplicate: false
    });
  }

  private sortDataTable() {
    const _event = {
      data: this.formSubsidizedSuggest.controls,
      field: 'sortOrder',
      mode: 'single',
      order: 1
    };
    this.customSort(_event);
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const value1 = data1.value[event.field];
      const value2 = data2.value[event.field];
      let result = null;

      if (value1 == null && value2 != null) {
        result = -1;

      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      }
      return (event.order * result);
    });
  }

  public setDataToForm(listItem) {
    let control = new FormArray([]);
    listItem.forEach(item => {
      const group = this.makeDefaultForm();
      group.patchValue({
        objectId: item.objectId,
        employeeId: item.employeeId,
        employeeName: item.employeeName,
        employeeCode: item.employeeCode,
        reason: item.reason != null ? item.reason : '',
        currentRessidence: item.relativeAdress != null ? item.relativeAdress : item.employeeAdress || ' '
      });
      this.loadDataRelationship(item.employeeId, group);
      if (item.objectId == item.employeeId) {
        this.subsidizedInfoService.getEmployeeInfo(item.employeeId).subscribe(employeeInfo => {
          group.patchValue({
            currentRessidence: employeeInfo.data.currentAddress
          });
        });
      }
      control.push(group);
    });
    this.formSubsidizedSuggest = control;
    this.validateDuplicate();
  } 

  public openFormImport() {
    if (!this.isView) {
      if (!CommonUtils.isValidForm(this.formSave)) {
        return;
      }
      const modalRef = this.modalService.open(ImportSubsidizedComponent, DEFAULT_MODAL_OPTIONS);
      const data = { subsidizedPeriodId: this.subsidizedPeriodId, proposeOrgId: this.formSave.value.proposeOrgId };
      modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
      modalRef.result.then((result) => {
        if (!result) {
          return;
        }
        this.setDataToForm(result.data);
      });
    }
  }

  public genData(event: any, item: any) {
    this.formSubsidizedSuggest.controls.forEach(element => {
      if (element.value['employeeId'] == event.selectField) {
        this.employeeId = event.selectField;
        element.patchValue({
          employeeName: event.nameField,
          employeeCode: event.codeField
        });
        if (this.beneficiaryType > 0) {
          this.loadDataRelationship(event.selectField, item);
        }
      }
    });
    this.validateDuplicate();
  }

  loadDataRelationship(employeeId: any, item) {
    const mapOfRelativeIdRelativeAdress = new Map<number, string>();
    let itemDataFamilyMember = [];
    this.subsidizedInfoService.getListRelationship(employeeId).subscribe(res => {
      if (res != null) {
        res.forEach(familyMember => {
          if (familyMember.currentResidence != null) {
            mapOfRelativeIdRelativeAdress.set(familyMember.familyRelationshipId, familyMember.currentResidence);
          }
          itemDataFamilyMember.push({
            familyRelationshipId: familyMember.familyRelationshipId,
            information: `${familyMember.relationTypeName} - ${familyMember.fullname} `,
            name: familyMember.fullname
          });
        });
        if (this.beneficiaryType == 3) {
          itemDataFamilyMember.unshift({ familyRelationshipId: item.value.employeeId, information: `Bản thân - ${item.value.employeeName}` });
        } else if (this.beneficiaryType == 1) {
          itemDataFamilyMember = [];
          itemDataFamilyMember.push({ familyRelationshipId: item.value.employeeId, information: `Bản thân - ${item.value.employeeName}` });
        }
        item.listDataFamilyMember = itemDataFamilyMember;
      } else {
        item.listDataFamilyMember = [];
      }
    });
    this.mapOfRelativeIdRelativeAdress = mapOfRelativeIdRelativeAdress;
  }

  public goBack() {
    this.router.navigate(['/subsidized/subsidized-suggest']);
  }

  public goView(subsidizedInfoId: any) {
    this.router.navigate([`/subsidized/subsidized-suggest/view/${subsidizedInfoId}`]);
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
    let subsidizedPeriodId = this.formSave.value['subsidizedPeriodId'];
    this.subsidizedPeriodId = subsidizedPeriodId;
    this.buildForms({});
    this.subsidizedPeriodService.getDataDropdown({ subsidizedPeriodId: subsidizedPeriodId, status: 0 }).subscribe(period => {
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



  /**
   * onClickRelativeDropdown
   */
  async onClickRelativeDropdown(item: any) {
    if (this.beneficiaryType > 0) {
      this.loadDataRelationship(item.value.employeeId, item);
    }
  }

  public onRelativeDropdownChange(event: any, item: any) {
    if (this.beneficiaryType == 1) {
      this.subsidizedInfoService.getEmployeeInfo(item.value.employeeId).subscribe(employeeInfo => {
        item.patchValue({
          currentRessidence: employeeInfo.data.currentAddress
        });
      });
    } else {
      if (item.value.employeeId != item.value.objectId) {
        item.patchValue({
          currentRessidence: this.mapOfRelativeIdRelativeAdress.get(item.value.objectId)
            ? this.mapOfRelativeIdRelativeAdress.get(item.value.objectId) : ''
        });
      } else {
        this.subsidizedInfoService.getEmployeeInfo(item.value.employeeId).subscribe(employeeInfo => {
          item.patchValue({
            currentRessidence: employeeInfo.data.currentAddress
          });
        });
      }
    }
    this.validateDuplicate();
  }

  public onProposeOrgChange() {
    let proposeOrgId = this.formSave.value['proposeOrgId'];
    this.proposeOrgId = proposeOrgId;
    if (proposeOrgId > 0) {
      let listSubsidizedBeneficialOgrId = [];
      listSubsidizedBeneficialOgrId.push(proposeOrgId);
      if (listSubsidizedBeneficialOgrId != null && listSubsidizedBeneficialOgrId.length > 0) {
        this.employeeFilterCondition = "AND obj.status = 1 "
          + "AND obj.organization_id IN (SELECT org.organization_id "
          + "FROM organization org WHERE org.path LIKE '%/" + listSubsidizedBeneficialOgrId + "/%')";
      }
    }
    this.resetForm();
  }

  seachNguoiHuong() {
      this.setFormValue(this.subsidizedInfoId, this.formSearchNguoiHuong.controls['keyword'].value);
  }

  public resetForm() {
    let control = new FormArray([]);
    control.push(this.makeDefaultForm());
    this.formSubsidizedSuggest = control;
  }

  filterFormSubsidizedSuggest() {
    let keyword = this.formSearchNguoiHuong.controls['keyword'].value;
    this.formSubsidizedSuggest.controls.forEach(item => {
    var mapOfRelativeIdRelativeAdress = new Map(item['listDataFamilyMember'].map(option => [option.familyRelationshipId, option.name]));
      if(keyword === "") {
        item.value.isShow = true;
      } else {
        let relativeName = mapOfRelativeIdRelativeAdress.get(item.value.objectId) + "";
        if (item.value.employeeName.includes(keyword) || relativeName.includes(keyword) || item.value.employeeCode.includes(keyword)) {
          item.value.isShow = true;
        } else {
          item.value.isShow = false;
        }
      }
    });
  }

  public validateDuplicate() {
    this.formSubsidizedSuggest.controls.forEach(element => {
      let rowValue = this.formSubsidizedSuggest.controls.filter(row => row.value.objectId == element.value.objectId && element.value.objectId != null);
      if (rowValue.length > 1) {
        element['isDuplicate'] = true;
      } else {
        element['isDuplicate'] = false;
      }
    });
  }

  public checkDuplidateRow(): boolean {
    let numberOfDuplicateRow = 0;
    this.formSubsidizedSuggest.controls.forEach(element => {
      if (element['isDuplicate'] == true) {
        numberOfDuplicateRow++;
      }
    });
    return numberOfDuplicateRow < 1;
  }
}