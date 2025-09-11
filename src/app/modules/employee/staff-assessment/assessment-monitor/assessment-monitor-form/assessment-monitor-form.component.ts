import { Component} from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute} from "@angular/router";
import { AssessmentEmployeeLevelService } from "@app/core/services/assessment-employee-level/assessment-employee-level.service";
import { AssessmentPeriodService } from "@app/core/services/assessmentPeriod/assessment-period.service";
import { BaseComponent } from "@app/shared/components/base-component/base-component.component";
import { CommonUtils } from "@app/shared/services";
import { HelperService } from "@app/shared/services/helper.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DialogService } from "primeng/api";
import { AssessmentMonitorReminderComponent } from "../assessment-monitor-reminder/assessment-monitor-reminder.component";
import { AssessmentMonitorSlackingComponent } from "../assessment-monitor-slacking/assessment-monitor-slacking.component";
import { AppComponent } from '@app/app.component';
import { AssessmentSignSyntheticModal } from './assessment-sign-synthetic-modal.component';
@Component({
    selector: 'assessment-monitor-form',
    templateUrl: './assessment-monitor-form.component.html'
})
export class AssessmentMonitorFormComponent extends BaseComponent  {
  formSearch: FormGroup;
  formConfig={
    assessmentPeriodId: ['',[Validators.required]],
    partyOrganizationId: [''],
    assessmentOrder: [''],
    status: [''],
    completeStatus: ['']
  }
  assessmentPeriodId: any;
  optionAssessmentStatus: any;
  optionAssessmentSignStatus: any;
  assessmentList: any;
  assessmentLevelList: any = {};
  partyOrganizationId: any;
  isMobileScreen: boolean = false;
  constructor(
    private assessmentPeriodService: AssessmentPeriodService,
    private assessmentEmployeeLevelService: AssessmentEmployeeLevelService,
    private modalService: NgbModal,
    public dialogService: DialogService,
    private route: ActivatedRoute,
    private helperService: HelperService,
    private app: AppComponent
  ) {
    super(null, 'ASSESSMENT_PERIOD');
    this.setMainService(assessmentEmployeeLevelService);
    this.formSearch = this.buildForm({}, this.formConfig);
    this.optionAssessmentStatus = [
      {label:"Chưa thực hiện", value: 1},
      {label:"Đang thực hiện", value: 2},
      {label:"Đã hoàn thành", value: 3}
    ];

    this.optionAssessmentSignStatus = [
      {label:"Đúng hạn", value: 1},
      {label:"Quá hạn", value: 2},
    ]

    this.assessmentPeriodService.getAssessmentPeriodList().subscribe(res => {
      this.assessmentList = res;
      if (this.assessmentList.length) {
        const assessmentPeriodId = this.assessmentList[0].assessmentPeriodId
        this.formSearch.controls['assessmentPeriodId'].setValue(assessmentPeriodId)
        this.onChangeAssessmentPeriod(assessmentPeriodId)
        setTimeout(() => {
          this.processSearch();
        }, 200);
      }
    });
    this.helperService.ASSESSMENT_MONITOR.subscribe(event => {
      if (event && event.node) {
        const node = event.node;
        this.formSearch.controls['partyOrganizationId'].setValue(node.nodeId);
        this.processSearch();
      }
    })
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  get f() {
    return this.formSearch.controls;
  }

  public onChangeAssessmentPeriod(data) {
    let paramSearch = { assessmentPeriodId: data}
    this.assessmentPeriodService.getAssessmentLevelList(paramSearch).subscribe(res=>{
      this.assessmentLevelList = res;
    });
  }

  processExport(rowData) {
    const formData = {
      assessmentPeriodId: rowData.assessmentPeriodId,
      partyOrganizationId: rowData.assessmentPartyOrganizationId,
      assessmentOrder: rowData.assessmentOrder
    }
    this.assessmentEmployeeLevelService.processExportEmployeeAssessment(formData).subscribe(res => {
      saveAs(res, 'Ds_Chua_hoan_thanh.xlsx');
    });
  }

  processExportSynthesis() {
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.assessmentEmployeeLevelService.processExportEmployeeAssessmentSynthesis(params).subscribe(res => {
      saveAs(res, 'Bao_cao_tong_hop.xlsx');
    });
  }

  public actionSlacking(rowData) {
    const modalRef = this.modalService.open(AssessmentMonitorSlackingComponent,{size: 'lg',backdrop: 'static',windowClass: 'modal-xl list-unfinished',keyboard: false});
    modalRef.componentInstance.assessmentPeriodId = rowData.assessmentPeriodId;
    modalRef.componentInstance.assessmentPartyOrganizationId = rowData.assessmentPartyOrganizationId;
    modalRef.componentInstance.assessmentOrder = rowData.assessmentOrder;
  }

  openSendReminder(){
    const ref = this.dialogService.open(AssessmentMonitorReminderComponent, {
      header: 'Gửi tin nhắn nhắc nhở',
      width: '50%',
      baseZIndex: 100,
      contentStyle: {"padding": "0"},
    });
  }

  exportSignSynthetic() {
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const formData = CommonUtils.buildParams(searchData);
    this.assessmentEmployeeLevelService.exportSignSynthetic(formData).subscribe(resp => {
      if (!resp.body || !resp.body.size) {
        this.app.warningMessage('assessmentResult.notFoundSignatureImage');
        return;
      }
      const modalRefSignSynthetic = this.modalService.open(AssessmentSignSyntheticModal, { size: 'lg',backdrop: 'static',windowClass: 'modal-xl', keyboard: false });
      modalRefSignSynthetic.componentInstance.dataSignSynthetic = resp;
    });
  }

  processExportSumUp(item) {
    const formValue = {
      assessmentPeriodId: item.assessmentPeriodId,
      partyOrganizationId: item.assessmentPartyOrganizationId,
      assessmentOrder: item.assessmentOrder
    }
    this.assessmentEmployeeLevelService.processExportSumUp(formValue).subscribe(res => {
      saveAs(res, 'Tổng hợp xếp loại Đảng viên.xlsx');
    })
  }

}