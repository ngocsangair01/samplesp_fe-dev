import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM } from '@app/core/app-config';
import { InspectionPlanService } from '@app/core/services/monitoring/inspection-plan.service';
import { ReportDynamicService } from '@app/modules/reports/report-dynamic/report-dynamic.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { ValidationService } from '@app/shared/services/validation.service';

@Component({
    selector: 'inspection-plan-search',
    templateUrl: './inspection-plan-search.component.html',
})
export class InspectionPlanSearchComponent extends BaseComponent {

    formConfig = {
        inspectionPlanCode: ['', [ValidationService.maxLength(50)]],
        inspectionPlanName: ['', [ValidationService.maxLength(200)]],
        partyOrganizationId: [''],
        promulgateName: ['', [ValidationService.maxLength(200)]],
        promulgateDateFrom: [''],
        promulgateDateTo: [''],
        code: [CommonUtils.getPermissionCode("resource.inspectionPlanList")]
    };

    constructor(
        private inspectionPlanService: InspectionPlanService,
        private reportDynamicService: ReportDynamicService,
        private router: Router,
        private app: AppComponent
    ) {
        super(null, CommonUtils.getPermissionCode("resource.inspectionPlan"));
        this.setMainService(inspectionPlanService);
        this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
            [ValidationService.notAffter("promulgateDateFrom", "promulgateDateTo", "common.label.toDate")]);
        this.processSearch();
    }

    get f() {
        return this.formSearch.controls;
    }

    prepareSaveOrUpdate(inspectionPlanId?: any) {
        if (inspectionPlanId) {
            this.router.navigate(['/monitoring-inspection/inspection-plan/edit/', inspectionPlanId]);
        } else {
            this.router.navigate(['/monitoring-inspection/inspection-plan/add']);
        }
    }

    prepareView(inspectionPlanId) {
        this.router.navigate(['/monitoring-inspection/inspection-plan/view/', inspectionPlanId]);
    }

    processDelete(inspectionPlanId) {
        this.app.confirmDelete(null, () => {// on accepted
            this.inspectionPlanService.deleteById(inspectionPlanId)
                .subscribe(res => {
                    if (this.inspectionPlanService.requestIsSuccess(res)) {
                        this.processSearch();
                    }
                });
        }, () => {// on rejected

        });
    }

    processExportList() {
        if (!CommonUtils.isValidForm(this.formSearch)) {
            return;
        }
        const credentials = Object.assign({}, this.formSearch.value);
        const searchData = CommonUtils.convertData(credentials);
        this.reportDynamicService.export(searchData).subscribe(res => {
            saveAs(res, 'DS_KH_KTGS.xlsx');
        });
    }

    processExportReport(inspectionPlanId) {
        this.reportDynamicService.export({ code: CommonUtils.getPermissionCode('resource.inspectionPlanReport'), inspectionPlanId: inspectionPlanId })
            .subscribe(res => {
                saveAs(res, 'BC_KH_KTGS.xlsx');
            });
    }

}