import { AssessmentPeriodService } from './../../../../../core/services/assessmentPeriod/assessment-period.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentResultService } from '@app/core/services/employee/assessment-result.service';
import * as moment from 'moment';
@Component({
  selector: 'assessment-history-log-v2',
  templateUrl: './assessment-history-log-v2.component.html',
  styleUrls: ['./assessment-history-log-v2.css']
})
export class AssessmentHistoryLogV2Component extends BaseComponent implements OnInit {
  // width screen
  scrWidth: any
  listLog = []
  constructor(
    public activeModal: NgbActiveModal,
    private assessmentPeriodService: AssessmentPeriodService
  ) {
    super(null)

  }

  setParamsRequest(data) {
    const formData = {
      assessmentPeriodId: data.assessmentPeriodId,
      employeeId: data.employeeId
    }
    this.assessmentPeriodService.getAssessmentHistoryByAssessmentPeriodIdAndEmployeeId(formData).subscribe((res) => {
      this.listLog = res.data
      this.listLog.forEach((item) => {
        item.createdAt = this.convertDateToString(item.createdAt)
      })
    })
  }
  private convertDateToString(date: any): string {
    if (date) {
      return moment(new Date(date)).format('DD/MM/YYYY hh:mm:ss');
    }
    return '';
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.scrWidth = window.innerWidth
  }
  ngOnInit() {

  }
}
