import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { AssessmentEmployeeLevelService } from '@app/core/services/assessment-employee-level/assessment-employee-level.service';
import { HrStorage } from '@app/core/services/HrStorage';
import { DialogService } from 'primeng/api';
import { AssessmentMonitorReminderComponent } from '../assessment-monitor-reminder/assessment-monitor-reminder.component';

@Component({
  selector: 'assessment-monitor-slacking',
  templateUrl: './assessment-monitor-slacking.component.html',
  styleUrls: ['./assessment-monitor-slacking.component.css']
})
export class AssessmentMonitorSlackingComponent extends BaseComponent implements OnInit{
  data: [];
  recordsTotal: any;
  resultList: any;
  assessmentEmployeeList: any = {};
  parseInt = parseInt;
  @ViewChild('ptable') dataTable: any;
  @Input() public assessmentPeriodId;
  @Input() public assessmentPartyOrganizationId;
  @Input() public assessmentOrder;


  formSearch: FormGroup;
  formConfig = {
    assessmentPeriodId: [''],
    partyOrganizationId: [''],
    assessmentOrder: [''],
  };

  constructor(
    public activeModal: NgbActiveModal,
    private assessmentEmployeeLevelService: AssessmentEmployeeLevelService,
    public dialogService: DialogService,

  ) {
    super();
  }

  ngOnInit() {
    this.formConfig.assessmentPeriodId = this.assessmentPeriodId;
    this.formConfig.partyOrganizationId = this.assessmentPartyOrganizationId;
    this.formConfig.assessmentOrder = this.assessmentOrder;
    this.formSearch = this.buildForm(this.formConfig, { assessmentPeriodId: [''], partyOrganizationId: [''], assessmentOrder: [''] });
    this.processSearchHis();
  }

  public processSearchHis(event?) {
    const params = this.formSearch ? this.formSearch.value : null;
    this.assessmentEmployeeLevelService.searchIncomplete(params, event).subscribe(res => {
      this.assessmentEmployeeList = this.canYouHavePermission(res);
      this.resultList = res;
      this.data = res.data;
      this.recordsTotal = res.recordsTotal;
    });
    if (this.dataTable) {
      this.dataTable.first = 0;
    }
  }

  private canYouHavePermission(res: any) {
    const data = res.data;
    if (!data || data.length <= 0) {
      return res;
    }
    const userLoginId = HrStorage.getUserToken().userInfo.employeeId;
    data.forEach(item => {
      this.preBuildData(item, userLoginId);
    })
    return res;
  }

  private preBuildData(data, userLoginId) {
    const levelNameEmployeeList = data.levelNameEmployeeList || [];
    if (!levelNameEmployeeList.length) {
      return;
    }
    let maxEvaluatingLevel = data.maxEvaluatingLevel;
    if (levelNameEmployeeList.length === 1) {
      maxEvaluatingLevel = levelNameEmployeeList[0].assessmentOrder;
    } else {
      maxEvaluatingLevel = levelNameEmployeeList.reduce((accumulator, currentValue) => {
        const maxTemp = accumulator.assessmentOrder;
        return maxTemp > currentValue.assessmentOrder ? maxTemp : currentValue.assessmentOrder;
      });
    }
    const evaluateDoneLevel = data.evaluateDoneLevel > 0 ? data.evaluateDoneLevel : -1;
    const isDonePeriodEvaluated = maxEvaluatingLevel === data.evaluateDoneLevel;
    const nextEvaluateLevel = levelNameEmployeeList.find(ele => ele.assessmentOrder > evaluateDoneLevel);
    levelNameEmployeeList.forEach(ele => {
      if (isDonePeriodEvaluated || (evaluateDoneLevel !== -1 && ele.assessmentOrder <= evaluateDoneLevel)) {
        ele['statusEvaluate'] = "DONE";
      } else if (nextEvaluateLevel && ele.assessmentOrder === nextEvaluateLevel.assessmentOrder) {
        ele['statusEvaluate'] = "PROCESSING";
      } else {
        ele['statusEvaluate'] = "PENDING";
      }
    });
    if (data.assessmentResultStatus === 0) {
      data.canYouHavePermission = levelNameEmployeeList.some(el => el.employeeId === userLoginId && (nextEvaluateLevel && el.assessmentOrder === nextEvaluateLevel.assessmentOrder));
    } else {
      data.canYouHavePermission = false;
    }
  }

  openSendReminder(item){
    const ref = this.dialogService.open(AssessmentMonitorReminderComponent, {
      header: 'Gửi tin nhắn nhắc nhở',
      width: '50%',
      baseZIndex: 1052,
      contentStyle: {"padding": "0"},
      data: item
    });
  }
}
