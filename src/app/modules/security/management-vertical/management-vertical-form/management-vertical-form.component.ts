import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { EmpManagementVerticalService } from '@app/core/services/security/emp-management-vertical.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { ValidationService } from '@app/shared/services/validation.service';

@Component({
    selector: 'management-vertical-form',
    templateUrl: './management-vertical-form.component.html',
})
export class ManagementVerticalFormComponent extends BaseComponent {

    formSave: FormGroup;
    navigationSubscription;
    isInsert = true;
    isUpdate = false;
    years;
    employeeFilter = "";
    isNotSearchByOrgDomainData = false;
    labourContractTypeIds = "-1";
    documentTypeIds = "-1";
    empTypeIds = "-1";
    currentYear = new Date().getFullYear();

    formConfig = {
        empManagementVerticalId: [''],
        organizationId: ['', ValidationService.required],
        employeeId: ['', ValidationService.required],
        isCommittee: [''],
        isSolider: [''],
        year: [new Date().getFullYear() , ValidationService.required],
        note: ['', ValidationService.maxLength(1000)]
    };

    constructor(
        private empManagementVerticalService: EmpManagementVerticalService,
        private appParamService: AppParamService,
        private router: Router,
        public actr: ActivatedRoute,
        private app: AppComponent) {
        super(null, CommonUtils.getPermissionCode("resource.empManagementVertical"));

        this.formSave = this.buildForm({}, this.formConfig, ACTION_FORM.UPDATE, ValidationService.requiredIfHaveNone(['isCommittee', 'isSolider']));

        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                const params = this.actr.snapshot.params;

                if (params.id) {
                    this.isInsert = false;
                    this.isUpdate = true;
                    this.buildForms(params.id);
                }
            }
        });

        this.years = CommonUtils.getYearList(10, 0).sort(function (a, b) { return b.year - a.year });
        
    }

    ngOnInit() {
        this.appParamService.appParams(APP_CONSTANTS.APP_PARAM_TYPE.LEAVE_PROCESS_TYPE).subscribe(res => {
            if (res.data != null && res.data.length > 0) {
                this.documentTypeIds = res.data[0].parValue;
            }

            this.appParamService.appParams(APP_CONSTANTS.APP_PARAM_TYPE.LABOUR_CONTRACT_TYPE_REGULAR).subscribe(resp => {
                if (resp.data != null && resp.data.length > 0) {
                    this.labourContractTypeIds = resp.data[0].parValue;
                }

                this.appParamService.getValueByCode(APP_CONSTANTS.APP_PARAM_CODE.EMP_TYPE_REGULAR_1).subscribe(response => {
                    if (response.data != null && response.data.length > 0) {
                        this.empTypeIds = response.data;
                    }

                    this.employeeFilter = " AND obj.employee_id IN (SELECT e.employee_id"
                                        + "                         FROM employee e"
                                        + "                          INNER JOIN work_process wp ON wp.employee_id = e.employee_id"
                                        + "                           AND " + this.currentYear + " BETWEEN YEAR(wp.effective_start_date) AND YEAR(COALESCE(wp.effective_end_date, CURDATE()))"
                                        + "                          INNER JOIN organization o ON o.organization_id = e.organization_id"
                                        + "                          INNER JOIN emp_type_process etp ON etp.employee_id = e.employee_id"
                                        + "                           AND " + this.currentYear + " BETWEEN YEAR(etp.effective_date) AND YEAR(COALESCE(etp.expired_date, CURDATE()))"
                                        + "                         WHERE wp.document_type_id NOT IN (" +  this.documentTypeIds + ")"
                                        + "                          AND ((etp.labour_contract_type_id IN (" + this.labourContractTypeIds + ") AND etp.emp_type_id = 486)"
                                        + "                             OR etp.emp_type_id IN (" + this.empTypeIds + ")))";
                });
            });
        });
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    get f() {
        return this.formSave.controls;
    }

    buildForms(id): void {
        this.empManagementVerticalService.findOne(id).subscribe(res => {
            this.formSave = this.buildForm(res.data, this.formConfig, ACTION_FORM.UPDATE, ValidationService.requiredIfHaveNone(['isCommittee', 'isSolider']));
        });
    }

    processSaveOrUpdate() {
        if (!CommonUtils.isValidForm(this.formSave)) {
            return;
        }

        this.app.confirmMessage(null, () => { // on accepted
            this.empManagementVerticalService.saveOrUpdate(this.formSave.value)
                .subscribe(res => {
                    if (this.empManagementVerticalService.requestIsSuccess(res)) {
                        this.goBack();
                    }
                });
        }, () => {

        });
    }

    goBack() {
        this.router.navigate(['/security-guard/management-vertical']);
    }

    onChangeEmployeeFilter() {
        this.f['employeeId'].setValue('');

        let year = this.currentYear;
        if (this.f['year'].value) {
            year = this.f['year'].value;
        }

        this.employeeFilter = " AND obj.employee_id IN (SELECT e.employee_id"
                            + "                         FROM employee e"
                            + "                          INNER JOIN work_process wp ON wp.employee_id = e.employee_id"
                            + "                           AND " + year + " BETWEEN YEAR(wp.effective_start_date) AND YEAR(COALESCE(wp.effective_end_date, CURDATE()))"
                            + "                          INNER JOIN organization o ON o.organization_id = e.organization_id"
                            + "                          INNER JOIN emp_type_process etp ON etp.employee_id = e.employee_id"
                            + "                           AND " + year + " BETWEEN YEAR(etp.effective_date) AND YEAR(COALESCE(etp.expired_date, CURDATE()))"
                            + "                         WHERE wp.document_type_id NOT IN (" +  this.documentTypeIds + ")"
                            + "                          AND ((etp.labour_contract_type_id IN (" + this.labourContractTypeIds + ") AND etp.emp_type_id = 486)"
                            + "                             OR etp.emp_type_id IN (" + this.empTypeIds + "))";

        if (this.f['organizationId'].value) {
            this.isNotSearchByOrgDomainData = true;
            this.employeeFilter += "AND o.path LIKE '%/" + this.f['organizationId'].value + "/%'";
        } else {
            this.isNotSearchByOrgDomainData = false;
        }

        this.employeeFilter += ")";
    }

}