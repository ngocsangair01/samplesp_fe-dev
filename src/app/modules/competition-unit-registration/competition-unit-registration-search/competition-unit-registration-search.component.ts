import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {CommonUtils, ValidationService} from "@app/shared/services";
import {Router} from "@angular/router";

import {HttpParams} from "@angular/common/http";
import {EmpArmyProposedAddComponent} from "@app/modules/employee/emp-army-proposed/emp-army-proposed-add/emp-army-proposed-add.component";
import {ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS} from "@app/core";
import {UnitRegistrationUpdateResultComponent} from "@app/modules/competition-unit-registration/competition-unit-registration-update-result/competition-unit-registration-update-result.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AppParamService} from "@app/core/services/app-param/app-param.service";
import {AppComponent} from "@app/app.component";
import {UnitRegistrationService} from "@app/core/services/unit-registration/unit-registration.service";
import {FormArray} from "@angular/forms";
import {RewardProposeService} from "@app/core/services/reward-propose/reward-propose.service";
import {
  ImportResponsePolicyProgramImportComponent
} from "@app/modules/policy-program/import-response-policy-program/import-response-policy-program-import/import-response-policy-program-import.component";
import {
  CompetitionUnitRegistrationImportComponent
} from "@app/modules/competition-unit-registration/competition-unit-registration-search/competition-unit-registration-import/competition-unit-registration-import.component";

@Component({
  selector: 'competition-unit-registration-search',
  templateUrl: './competition-unit-registration-search.component.html',
  styleUrls: ['./competition-unit-registration-search.component.css']
})
export class UnitRegistrationSearchComponent extends BaseComponent implements OnInit {
  rewardTypeListByUser: any;
  rewardTypeList: any;
  appellationList: any;
  competitionType: any;
  competitionRegistrationStatusOptions: any;
  competitionProgramCriteria: any;
  organizationName: any;
  signFast : boolean = false;
  formConfig = {
    unitCode: [""],
    unit: [""],
    competitionType: [""],
    titleCode: [""],
    competitionRegistrationStatus: [""],
    rewardCategoryId: [""],
    startTime: [""],
    endTime: [""],
    organizationName: [""],
    competitionName:[""],
    isUnitCode: [false],
    isUnit: [false],
    isCompetitionType: [false],
    isTitleCode: [false],
    isCompetitionRegistrationStatus: [false],
    isRewardCategoryId: [false],
    isStartTime: [false],
    isEndTime: [false],
    isOrganizationName: [false],
    isCompetitionName:[false],
    isRewardType: [false],
    rewardType: [""],
    publisherUnitCode: [""],
    isOrganizationChild: [false],
    isPublisherUnitCode: [false],
  };

  constructor(
      private router: Router,
      private unitRegistrationService: UnitRegistrationService,
      private appParamService: AppParamService,
      private app: AppComponent,
      private modalService: NgbModal,
      private rewardProposeService: RewardProposeService,
  ) {
    // Check quyền cho component
    super(null, CommonUtils.getPermissionCode("COMPETITION_UNIT_REGISTRATION"));

    this.formSearch = this.buildForm({}, this.formConfig);
    this.setMainService(unitRegistrationService);

    this.appellationList = []

    // get loại chương trình thi đua
    this.appParamService.appParams('COMPETITION_TYPE').subscribe(res => {
      this.competitionType = res.data
    })

    // Trạng thái đăng ký
    this.appParamService.appParams('COMPETITION_REGISTRATION_STATUS').subscribe(res => {
      delete res.data[5]
      this.competitionRegistrationStatusOptions = res.data
    })

    // get danh sách hình thức khen thưởng
    this.unitRegistrationService.geRewards().subscribe(res => {
      this.competitionProgramCriteria = res
    })

    // get tên đơn vị từ mã nhân viên
    // this.unitRegistrationService.getUserOrganization().subscribe(res => {
    //   this.formSearch.get('organizationName').setValue(res.name)
    // })

    //lấy danh sách lĩnh vực khen thưởng
    this.rewardTypeList = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;

    // lĩnh vực thi đua
    this.rewardProposeService.getRewardTypeListForCompetition().subscribe(res => {
      this.rewardTypeListByUser = this.rewardTypeList.filter((item) => {
        return res.includes(item.id)
      })
    })

    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
        [ValidationService.notAffter('startTime', 'endTime', 'transferEmployee.workProcess.etpExpiredDate')]);
  }

  ngOnInit() {
    this.formSearch.controls['organizationName'] = new FormArray([]);
    this.preProcessSearch();
  }

  preProcessSearch(event?: any) {
    this.formSearch.value['organizationName'] = this.formSearch.get('organizationName').value;
    if(this.formSearch.get('competitionRegistrationStatus').value.length === 1 &&
        this.formSearch.get('competitionRegistrationStatus').value[0] === 'NEW'){
      this.signFast = true
    }else{
      this.signFast = false
    }
    this.processSearch(event);
  }

  get f() {
    return this.formSearch.controls;
  }

  handleGetValueForUnitList() {

  }

  handleGetValueForAppellationList() {

  }

  onChangeSubjectType(){
    if(this.formSearch.get('rewardType').value){
      this.unitRegistrationService.getTitles({
        rewardObjectType: "ORGANIZATION",
        rewardType: this.formSearch.get('rewardType').value
      }).subscribe(res => {
        this.appellationList = res.data
      })
    }else{
      this.appellationList = []
    }
  }

  /**
   * routing to create screen
   */
  addNew() {
    this.router.navigate(['/competition-unit-registration', 'create'])
  }

  addNewWithId(item: any) {
    const [curDay, curMonth, curYear] = item.currentDate.split('/')
    const [startDay, startMonth, startYear] = item.startTime.split('/')
    const [endDay, endMonth, endYear] = item.endTime.split('/')
    const curDate = new Date(+curYear, +curMonth - 1, +curDay);
    const startDate = new Date(+startYear, +startMonth - 1, +startDay);
    const endDate = new Date(+endYear, +endMonth - 1, +endDay);
    let check = this.betweenDate(curDate, startDate, endDate);
    if (item.competitionRegistrationStatusName == 'Chưa đăng ký' && !check) {
      this.app.warningMessage('competitionRegistration.checkStartTimeEndTime','Chương trình không trong thời gian đăng ký!');
    }else{
      this.router.navigate(['/competition-unit-registration', 'create', item.competitionRegistrationId])
    }
  }

  /**
   * routing to edit screen
   */
  edit(item: any) {
    this.router.navigate(['/competition-unit-registration', 'edit', item.competitionRegistrationId])
  }

  /**
   * Xóa bản ghi đăng ký đơn vị theo id
   */
  processDelete(item) {
    if (item && item.competitionRegistrationId > 0) {
      this.app.confirmDelete(null, () => {
        this.unitRegistrationService.deleteById(item.competitionRegistrationId)
            .subscribe(res => {
              if (this.unitRegistrationService.requestIsSuccess(res)) {
                this.processSearch(null);
              }
            });
      })};
  }

  /**
   * routing to view screen
   */
  viewDetail(item: any) {
    this.router.navigate(['/competition-unit-registration', 'view', item.competitionRegistrationId])
  }

  /**
   * routing to view screen
   */
  viewDetailCompetitionProgram(item: any) {
    this.router.navigate(['/competition-program','view','competition-registration', item.competitionId])
  }

  /**
   * routing to view-act screen
   */
  viewAct() {
    this.router.navigate(['/competition-unit-registration/view-act'])
  }

  /**
   * Trình ký đăng ký đơn vị
   * @param item
   */
  prepareSign(item) {
    if (item && item.signDocumentId > 0) {
      this.router.navigate(['/voffice-signing/competition-registration/', item.signDocumentId]);
    }
  }

  /**
   * Trình ký kết quả thi đua
   * @param item
   */
  prepareResultSign(item) {
    if (item && item.signDocumentResultId > 0) {
      this.router.navigate(['/voffice-signing/competition-result/', item.signDocumentResultId]);
    }
  }

  changePageToThiDua() {
    this.router.navigate(['/competition-unit-registration/view-compe'])
  }
  /**
   * prepareUpdate
   * @param item
   */
  public prepareUpdate(item) {
    // this.unitRegistrationService.findOne(item.competitionRegistrationId)
    //     .subscribe(res => {
    this.unitRegistrationService.checkRegister({'competitionRegistrationCode': item.competitionRegistrationCode}).subscribe(res => {
      if(res == 0){
        this.activeModalUpdate(item);
      }else{
        this.app.warningMessage('','Đăng ký thi đua đã có kết quả !');
      }
    })

    // });
  }


  /**
   * show model
   * data
   */
  private activeModalUpdate(data?: any) {
    localStorage.setItem('dataCompetitionName', data.competitionName)
    localStorage.setItem('dataCompetitionRegistrationCode', data.competitionRegistrationCode)
    localStorage.setItem('dataCompetitionCode', data.competitionCode)
    const modalRef = this.modalService.open(UnitRegistrationUpdateResultComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.unitRegistrationService.requestIsSuccess(result)) {
        this.processSearch();
        // if (this.dataTable) {
        //   this.dataTable.first = 0;
        // }
      }
    });
  }


  // searchRegistration() {
  //   const params = new HttpParams()
  //       .set('offset', "0")
  //       .set('limit', "100");
  //
  //   this.individualRegistrationService.search(params).subscribe(data => {
  //     this.resultList = data.data;
  //   })
  // }


  checkShowRegistration(item): boolean {
    let currentDate = item.currentDate
    const [curDay, curMonth, curYear] = item.currentDate.split('/')
    const [startDay, startMonth, startYear] = item.startTime.split('/')
    const [endDay, endMonth, endYear] = item.endTime.split('/')
    const curDate = new Date(+curYear, +curMonth - 1, +curDay);
    const startDate = new Date(+startYear, +startMonth - 1, +startDay);
    const endDate = new Date(+endYear, +endMonth - 1, +endDay);
    let check = this.betweenDate(curDate, startDate, endDate);

    if ((item.competitionRegistrationStatus == 'REJECT' || item.competitionRegistrationStatusName == 'Chưa đăng ký')
        && (check)) {
      return true;
    }
    return false;
  }

  public tctCompareDates(date1, date2): number {
    const diff = date1 - date2;
    return (diff <= 0) ? -1 : (diff === 0) ? 0 : 1;
  }

  public betweenDate(check, startDate, endDate): boolean {
    return (this.tctCompareDates(startDate, check) < 0) && (this.tctCompareDates(check, endDate) < 0);
  }

  public activeImportModal() {
    const modalRef = this.modalService.open(CompetitionUnitRegistrationImportComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.setFormValue(this.propertyConfigs, {});
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.unitRegistrationService.requestIsSuccess(result)) {
        this.preProcessSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

  public signDocumentFast(){
    let param = {
      competitionType: this.formSearch.get('competitionType').value?this.formSearch.get('competitionType').value: null,
      titleCode: this.formSearch.get('titleCode').value? this.formSearch.get('titleCode').value: null,
      competitionRegistrationStatus: this.formSearch.get('competitionRegistrationStatus').value? this.formSearch.get('competitionRegistrationStatus').value: null,
      rewardCategoryId: this.formSearch.get('rewardCategoryId').value? this.formSearch.get('rewardCategoryId').value: null,
      startTime: this.formSearch.get('startTime').value? this.formSearch.get('startTime').value: null,
      endTime: this.formSearch.get('endTime').value? this.formSearch.get('endTime').value: null,
      organizationName: this.formSearch.get('organizationName').value? this.formSearch.get('organizationName').value: null,
      competitionName: this.formSearch.get('competitionName').value? this.formSearch.get('competitionName').value: null,
      rewardType: this.formSearch.get('rewardType').value? this.formSearch.get('rewardType').value: null,
      publisherUnitCode: this.formSearch.get('publisherUnitCode').value? this.formSearch.get('publisherUnitCode').value: null,
      isOrganizationChild: this.formSearch.get('isOrganizationChild').value === true ? 1: 0,
    }
    this.unitRegistrationService.processSearchSign(param).subscribe(res => {
      this.preProcessSearch();
    })
  }
}
