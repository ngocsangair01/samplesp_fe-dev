import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import {FormArray, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {ACTION_FORM, APP_CONSTANTS, EmployeeInfoService, OrganizationService, RESPONSE_TYPE} from '@app/core';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import { RewardProposeSignService } from '@app/core/services/reward-propose-sign/reward-propose-sign.service';
import { AppComponent } from '@app/app.component';
import { DialogService } from 'primeng/api';
import { RewardProposeSignErrorComponent } from '../reward-propose-sign-error/reward-propose-sign-error';
import {VfsInvoiceService} from "@app/core/services/vfs-invoice/vfs-invoice.service";
import * as moment from "moment/moment";
import _ from 'lodash';
import { HelperService } from '@app/shared/services/helper.service';

@Component({
  selector: 'reward-propose-sign-search.component',
  templateUrl: './update-status-reward-propose-sign.html',
  styleUrls: ['./update-status-reward-propose-sign.css']
})
export class UpdateStatusRewardProposeSign extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  // @Input() closingDate;
  lstReason: any;
  formRewardEmployee: FormArray;
  selectedRows: [];
  lstStatus = [   {id: 1, name: "Dự thảo"},
    {id: 2, name: "Chờ ký duyệt"},
    {id: 3, name: "Đã ký duyệt"},
    {id: 4, name: "Từ chối ký duyệt"},
    {id: 5, name: "Đã tạo tờ trình"},
    {id: 6, name: "Đóng quyết định"},
  ];
  formConfig = {
    decisionNumber: [null, [ValidationService.required]],
    promulgateDate: [null, [ValidationService.required]],
    promulgateBy: [null, [ValidationService.required]],
    updateReasonDescription: [null, [ValidationService.required]],
    status: [null, [ValidationService.required]]
  };
  formCachedSearch = {
    objectDate: null,
    lstEmployee: null,
    rewardType: null
  }
  formTable: { data: null, recordsTotal: 0 };
  employeeFilterCondition: string;
  isSearchByPartyDomainData: string;
  isNotSearchByOrgDomainData: string;
  numIndex = 1;
  updateStatus: null;
  employeeCode: null;
  rewardProposeSign: any;
  rewardProposeSignId: null;
  constructor(
    private rewardProposeSignService: RewardProposeSignService,
    private employeeService: EmployeeInfoService,
    public activeModal: NgbActiveModal,
    public actr: ActivatedRoute,
    private app: AppComponent,
    private router: Router,
    public dialogService: DialogService,
    public helperService: HelperService
  ) {
    super(null, 'REQUEST_RESOLUTION_QUARTER_YEAR');
    this.formSearch = this.buildForm({}, this.formConfig);
    this.buildFormRewardEmployee();
  }
  ngOnInit(): void {
      console.log(this.rewardProposeSign)
      if(this.rewardProposeSign) {
        this.rewardProposeSignId = this.rewardProposeSign['rewardProposeSignId']
        this.formSearch = this.buildForm(this.rewardProposeSign, this.formConfig);
      }
  }


  get f() {
    return this.formSearch.controls;
  }

  // private makeDefaultForm(): FormGroup {
  //   const group = {
  //     decisionNumber: [null, [ValidationService.required]],
  //     promulgateDate: [null, [ValidationService.required]],
  //     promulgateBy: [null, [ValidationService.required]],
  //   };
  //   return this.buildForm({}, group);
  // }

  public setFormValue(propertyConfigs: any, data?: any) {

    this.propertyConfigs = propertyConfigs;
    this.formSearch = this.buildForm(data.formSearch, this.formConfig, ACTION_FORM.INSERT, [])
  }
  async onSelectEmployee(event) {
    const { selectField: employeeId, codeField: employeeCode, nameField: employeeName } = event;
    this.employeeCode = employeeCode
    const lstEmployeePosition = this.formRewardEmployee.value || [];
    if (lstEmployeePosition.length) {
      const lstEmployee = this.formCachedSearch['lstEmployee'] || [];
      const tempEmployee = lstEmployee.find(ele => ele.employeeId == employeeId);
      if (!tempEmployee) {
        lstEmployee.push({
          employeeId,
          employeeCode,
          employeeName
        });
      }
      this.formCachedSearch['lstEmployee'] = lstEmployee;
    }
    // await this.getWorkUnit(event);
  }



  public buildFormRewardEmployee(listData?: any) {
    const controls = new FormArray([]);
    if (!listData || listData.length === 0) {
      // const group = this.makeDefaultForm();
      // controls.push(group);
    } else {
      const groupConfig = this.makeDefaultForm();
      for (const i in listData) {
        const group: FormGroup = _.cloneDeep(groupConfig);
        const param = listData[i];
        group.patchValue(param);
        controls.push(group);
        this.numIndex++;
      }
    }
    controls.setValidators([
      ValidationService.duplicateArray(['employeeId', 'rewardTitleId'], 'rewardTitleId', 'rewardGeneral.rewardTitle'),
      this.checkMultipleMaxlength('rewardGeneral.rewardTitle')//"Đơn vị và chức danh dài nhất ${maxlength} ký tự"
    ]);
    this.formRewardEmployee = controls;
  }
  private makeDefaultForm(): FormGroup {
    const group = {
      rewardTitleId: [null, [ValidationService.required]], // id danh hieu/hinh thuc khen thuong
      objectIdsangnnMember: [null], // objectId
      employeeId: [null, ValidationService.required],
      employeeCode: [null],
      employeeName: [null],
      organizationName: [null],
      organizationId: [null],
      mapOrganizationId: [null], // id map
      rewardProposeId: [null], // parent id
      rewardProposeDetailId: [null], // id
      objectNameGuest: [null], // ho va ten hoac ten to chuc
      amountOfMoney: [null, [ValidationService.positiveInteger, ValidationService.maxLength(15)]], // tien thuong
      description: [null, [ValidationService.maxLength(2000)]], // noi dung khen thuong
      personalIdNumber: [null], // so cmnd, ho chieu
      includedStatement: ["Y"], // Có nằm trong tờ trình hay không
      personalIdIssuedDate: [null], // ngay cap cmnd, ho chieu
      personalIdIssuedPlace: [null], // noi cap cmnd, ho chieu
      nationId: [null], // quoc gia
      residencyStatus: [null], // tinh trang cu tru
      addressOrPhone: [null], // address or phone number
      rewardCategory: [""],
      rewardTitleIdList: [],
      keyword: [''],
      rewardTitleName: [''],
      isHidden: true,
      positionName: [null],
      soldierLevel: [null],
      isChoose: [null],
      isPreview: [null],
      receiveBonusOrgId: [null],
      isEnableReceiveBonusOrg : [true],
      partnerDrCode: [null]
    };
    return this.buildForm({}, group);
  }

  public checkMultipleMaxlength(messageKey?: string): ValidatorFn {
    return (array: FormArray) => {
      for (const group of array.controls) {
        const rewardTitleId = group.value.rewardTitleId;
        const rewardTitleIdList = group.value.rewardTitleIdList;
        const controlOrgName = group.get("organizationName") as FormControl;
        const controlPositionName = group.get("positionName") as FormControl;
        if (rewardTitleId != null && rewardTitleIdList != null && controlOrgName != null && controlPositionName != null) {
          const maxLength = rewardTitleIdList.find(e => e.rewardCategoryId == rewardTitleId).maxLength;
          if (!maxLength) {
            if (controlOrgName.hasError('multipleMaxlength')) {
              controlOrgName.setErrors(null);
              controlOrgName.markAsUntouched();
            }
            continue;
          }
          const orgName = controlOrgName.value || '';
          const postionName = controlPositionName.value || '';
          const orgNameLength = orgName.trim();
          const postionNameLength = postionName.trim();
          if (orgNameLength.length + postionNameLength.length > maxLength) {
            controlOrgName.setErrors({ multipleMaxlength: { multipleMaxlength: maxLength} });
          } else {
            // fix bug khi xoa row dau khi bi duplicate
            if (controlOrgName.hasError('multipleMaxlength')) {
              controlOrgName.setErrors(null);
              controlOrgName.markAsUntouched();
            }
          }
        }
      }
      return null;
    };
  }

  updateStatusRewardProposeSign() {
    if(this.formSearch.value['updateReasonDescription'] == null || this.formSearch.value['status'] == null){
      this.helperService.APP_TOAST_MESSAGE.next({ type: "ERROR", code: "rewardProposeSign.notEmpty" });
      console.log(this.rewardProposeSignId)
    }else {
      const rewardProposeSignForm =
          {'rewardProposeSignId':this.rewardProposeSignId,
            'decisionNumber':this.formSearch.value['decisionNumber'],
            'promulgateDate':this.formSearch.value['promulgateDate'],
            'promulgateId':this.formSearch.value['promulgateBy'],
            'updateReasonDescription': this.formSearch.value['updateReasonDescription'],
            'status': this.formSearch.value['status']
          }
       this.rewardProposeSignService.updateStatusRewardProposeSign(rewardProposeSignForm).subscribe(  res => {
        if(res.data != null) {
          this.helperService.setWaitDisplayLoading(true);
          this.activeModal.close()
          window.location.reload();
          this.helperService.setWaitDisplayLoading(false);
        }else {
          this.helperService.APP_TOAST_MESSAGE.next({ type: "ERROR", code: "haveError" });
            // this.app.errorMessage('reimbursement.error', res.data);
          }
      });
    }
  }

  public setRewardProposeSign(rewardProposeSign) {
    console.log("rewardProposeSign",rewardProposeSign)
    this.rewardProposeSign = rewardProposeSign
    this.rewardProposeSign['promulgateBy'] = rewardProposeSign['promulgateId']
  }

  processSearch(event?) {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    let param = { ...this.formSearch.value };
    this.rewardProposeSignService.search(param, event).subscribe(res => {
      this.resultList = res;
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }
}
