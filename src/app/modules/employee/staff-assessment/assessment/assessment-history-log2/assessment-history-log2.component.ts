import { MenuItem } from 'primeng/api';
import { AssessmentPeriodService } from '../../../../../core/services/assessmentPeriod/assessment-period.service';
import { AssessmentCriteriaGroup } from '../assessment-interface';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { CONFIG } from '@app/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { environment } from '@env/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ASSESSMENT_FIELD_TYPE } from '../assessment-interface';
import { FormControl, FormGroup } from '@angular/forms';
import { AssessmentResultService } from '@app/core/services/employee/assessment-result.service';
import {el} from "@angular/platform-browser/testing/src/browser_util";
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'assessment-history-log2',
  templateUrl: './assessment-history-log2.component.html',
  styleUrls: ['./assessment-history-log2.component.css']
})
export class AssessmentHistoryLogComponent2 extends BaseComponent implements OnInit {
  data: [];
  recordsTotal: any;
  resultList: any;
  parseInt = parseInt;
  @ViewChild('ptable') dataTable: any;
  @Input() public assessmentPeriodId;
  assessmentList = []
  formSearch: FormGroup;
  formConfig = {
    assessmentPeriodId: [''],
    employeeId: [''],
  };
  credentials: any = {};
  isMobileScreen: boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
    private assessmentPeriodService: AssessmentPeriodService
  ) {
    super(null)
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    // this.processSearchHis();
  }

  public processSearchHis(event?) {
    this.credentials = Object.assign({}, null)
    if (!event) { // nếu mà bấm nút tìm kiếm trên form
      if (this.dataTable) {
        this.dataTable.first = 0
      }
    }

    const searchData = CommonUtils.convertData(this.credentials)
    if (event) {
      searchData._search = event
    }
    const buildParams = CommonUtils.buildParams(searchData);
    this.assessmentPeriodService.getAssessmentHistory(buildParams ,this.assessmentPeriodId, this.formSearch.value.employeeId).subscribe(res => {
      this.resultList = res.data;
      this.data = res.data;
      
      this.recordsTotal = res.recordsTotal;
    });
    if (this.dataTable) {
      this.dataTable.first = 0;
    }
  }
  public setFormValue(data?: any) {
    this.assessmentList = data.assessmentList
    const formData = {
      assessmentPeriodId: data.assessmentPeriodId,
      employeeId: data.employeeId
    }
    this.buildFormEmployee(formData)
  }
  get f() {
    return this.formSearch.controls;
  }
  private buildFormEmployee(data: any): void {
    this.formSearch = this.buildForm(data, this.formConfig);
    
  }
}
