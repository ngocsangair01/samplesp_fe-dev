import { Component, OnInit } from '@angular/core';
import { BaseControl } from '@app/core/models/base.control';
import { DynamicDialogConfig } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/api';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { ReportManagerService } from '@app/core/services/report/report-manager.service';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { DynamicApiService } from '@app/core';
import { ReportDynamicService } from '@app/modules/reports/report-dynamic/report-dynamic.service';

@Component({
    templateUrl: './export-dialog.component.html',
})
export class ExportComponent extends BaseComponent implements OnInit {

    formExport: FormGroup

    formConfig = {
        orgSubmit: [null, ValidationService.required],
        requestReporting: [null, ValidationService.required],
        reportingPeriod: [null, ValidationService.required]
    }

    requestReportingSuggestions
    reportingPeriodSuggestions

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private dynamicApiService: DynamicApiService,
        private reportDynamicService: ReportDynamicService
    ) {
        super();
     }

    ngOnInit() {
        this.formExport = this.buildForm('', this.formConfig);
    }

    exportReport() {
       if (CommonUtils.isValidForm(this.formExport)){
           let param = {
               orgId : this.formExport.value.orgSubmit,
               reportingPeriod: this.formExport.value.reportingPeriod.reportingPeriod,
               requestReportingId: this.formExport.value.requestReporting.requestReportingId
           }
           //Todo
           //this.reportDynamicService.export()
       }
    }

    getReportTitle(event){
        this.dynamicApiService.getByCode('get-request-reporting', {title: event.query})
        .subscribe( res => {
            this.requestReportingSuggestions = res
        })
    }

    getReportingPeriod(event){
        let param = {
            reportingPeriod: event.query,
            requestReportingId: this.formExport.controls.requestReporting.value.requestReportingId
        }
        this.dynamicApiService.getByCode('get-report-period', param)
        .subscribe( res => {
            this.reportingPeriodSuggestions = res
        })
    }

    onClearReport(){
        this.formExport.controls.requestReporting.setValue(null);
        this.formExport.controls.reportingPeriod.setValue(null)
    }

    onClearReportingPeriod(){
        this.formExport.controls.reportingPeriod.setValue(null)
    }
}
