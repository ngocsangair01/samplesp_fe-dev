import { Component, Input, OnInit } from '@angular/core';
import { BaseControl } from '@app/core/models/base.control';
import { DynamicDialogConfig } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/api';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { ReportSubmissionService } from '@app/core/services/report/report-submission.service';
@Component({
    templateUrl: './emp-submit-dialog.component.html',
    styleUrls: ['./emp-submit-dialog.component.css']
})
export class EmpSubmitComponent implements OnInit {
    empSubmit: BaseControl;
    data: any;
    resultList: any = {};
    list: any = {};
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private service: ReportSubmissionService
    ) { }

    ngOnInit() {
        this.empSubmit = new BaseControl();
        this.empSubmit.setValidators(ValidationService.required);
        this.processSearch();
    }

    save() {
        if (this.list && this.list.employeeCode) {
            this.service.updateEmpSubmit({
                reportSubmissionId: this.config.data.reportSubmissionId,
                empSubmit: this.list.employeeCode
            }).subscribe(res => {
                if (res.type == "SUCCESS") {
                    this.ref.close(true);
                }
            })
        }
    }

    /**
     * search employee
     */
     processSearch() {
        const organizationId = this.config.data.organizationId;
        this.service.getListEmployeeReport(organizationId).subscribe(res => {
            if(res.type == "SUCCESS") {
                this.resultList = res;  
            }
        })
     }

      /*
      * close dialog
      */
      close(){
        this.ref.close(true);
      }

      /**
       * change select
       * @param event 
       * @param item 
       */
      change(event, item) {
        if (event.currentTarget.checked) {
          this.list = item
        } 
      }
}
