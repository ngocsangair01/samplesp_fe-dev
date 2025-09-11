import { Component } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { FileControl } from '@app/core/models/file.control';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { InspectionPlanService } from '@app/core/services/monitoring/inspection-plan.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { ValidationService } from '@app/shared/services/validation.service';

@Component({
    selector: 'inspection-plan-form',
    templateUrl: './inspection-plan-form.component.html',
})
export class InspectionPlanFormComponent extends BaseComponent {

    formSave: FormGroup;
    formDetails: FormArray;
    taskGroupIds = [];
    employeeFilterCondition: String;
    isView = false;
    isUpdate = false;
    isInsert = false;
    dataError: any; //Danh sach loi khi import

    formConfig = {
        inspectionPlanId: [''],
        inspectionPlanCode: ['', [ValidationService.required, Validators.maxLength(50)]],
        inspectionPlanName: ['', [ValidationService.required, Validators.maxLength(200)]],
        partyOrganizationId: [null, [ValidationService.required]],
        promulgateName: ['', [ValidationService.required, ValidationService.maxLength(200)]],
        documentNumber: ['', [ValidationService.required, ValidationService.maxLength(50)]],
        promulgateDate: ['', [ValidationService.required, ValidationService.beforeCurrentDate]]
    };

    constructor(
        private inspectionPlanService: InspectionPlanService,
        private categoryService: CategoryService,
        private appParamService: AppParamService,
        private router: Router,
        private app: AppComponent) {
        super(null, CommonUtils.getPermissionCode("resource.inspectionPlan"));

        const subPaths = this.router.url.split('/');
        if (subPaths.length > 3) {
            this.isView = subPaths[3] === 'view';
            this.isUpdate = subPaths[3] === 'edit';
            this.isInsert = subPaths[3] === 'add';

            if (subPaths.length > 4) {
                if (CommonUtils.isValidId(subPaths[4])) {
                    this.setFormValue(subPaths[4]);
                }
            } else {
                this.setFormValue();
            }
        }

        this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.INSPECTION_PLAN_TASK_GROUP).subscribe(
            res => this.taskGroupIds = res.data
        );

        this.employeeFilterCondition = " AND obj.status = 1";
        this.appParamService.appParams(APP_CONSTANTS.APP_PARAM_TYPE.MANAGEMENT_POSITION_TYPE).subscribe(res => {
            if (res.data != null && res.data.length > 0) {
                this.employeeFilterCondition += " AND EXISTS (SELECT 1 FROM position p WHERE p.position_id = obj.position_id AND p.type IN (";
                const lstManagementPositionType = res.data[0].parValue.split(",");
                lstManagementPositionType.forEach(element => {
                    this.employeeFilterCondition += "'" + element + "',";
                });
                this.employeeFilterCondition += "'0'))";
            }
        });
    }

    get f() {
        return this.formSave.controls;
    }

    buildForms(data?: any): void {
        this.formSave = this.buildForm(data ? data : {}, this.formConfig, ACTION_FORM.INSERT);

        const filesControl = new FileControl(null);
        if (data && data.fileAttachment && data.fileAttachment.inspectionPlanFile) {
            filesControl.setFileAttachment(data.fileAttachment.inspectionPlanFile);
        }

        this.formSave.addControl('files', filesControl);
        this.formSave.addControl('fileImport', new FileControl(null));
    }

    setFormValue(inspectionPlanId?: any) {
        this.buildForms();
        this.buildFormDetails();

        if (inspectionPlanId && inspectionPlanId > 0) {
            this.inspectionPlanService.findOne(inspectionPlanId).subscribe(res => {
                this.buildForms(res.data);
                this.buildFormDetails(res.data.listDetails);
            });
        }
    }

    processSaveOrUpdate() {
        if (!CommonUtils.isValidForm(this.formSave) || !CommonUtils.isValidForm(this.formDetails)) {
            return;
        }

        let data = {
            listDetails: []
        };
        data = this.formSave.value;
        data.listDetails = this.formDetails.value;

        this.app.confirmMessage(null, () => { // on accepted
            this.inspectionPlanService.saveOrUpdateFormFile(data)
                .subscribe(res => {
                    if (this.inspectionPlanService.requestIsSuccess(res)) {
                        this.goBack();
                    }
                });
        }, () => {

        });
    }

    goBack() {
        this.router.navigate(['/monitoring-inspection/inspection-plan']);
    }

    generateCode() {
        this.f["inspectionPlanCode"].setValue("");

        if (this.f['partyOrganizationId'].value && this.f["promulgateDate"].value) {
            this.inspectionPlanService.generateInspectionPlanCode(this.f['partyOrganizationId'].value,
                new Date(this.f["promulgateDate"].value).getFullYear())
                .subscribe(res => {
                    this.f["inspectionPlanCode"].setValue(res);
                });
        }
    }

    buildFormDetails(listDetails?: any) {
        const controls = new FormArray([]);
        if (!listDetails || listDetails.length === 0) {
            const group = this.makeDefaultDetailsForm();
            controls.push(group);
        } else {
            for (const emp of listDetails) {
                const group = this.makeDefaultDetailsForm();
                group.patchValue(emp);
                controls.push(group);
            }
        }
        controls.setValidators([
            ValidationService.duplicateArray(['taskGroupId', 'partyOrganizationId'], 'taskGroupId', 'inspectionPlanDetails.duplicateTaskGroupAndPartyOrganization'),
            ValidationService.duplicateArray(['partyOrganizationId', 'taskGroupId'], 'partyOrganizationId', 'inspectionPlanDetails.duplicateTaskGroupAndPartyOrganization')
        ]);
        this.formDetails = controls;
    }

    makeDefaultDetailsForm(): FormGroup {
        const group = {
            taskGroupId: [null, Validators.compose([Validators.required])],
            employeeId: [null, Validators.compose([Validators.required])],
            partyOrganizationId: [null, Validators.compose([Validators.required])],
            note: [null, Validators.compose([Validators.maxLength(500)])],
            workScheduleYear: [null],
            workScheduleJan: [null],
            workScheduleFeb: [null],
            workScheduleMar: [null],
            workScheduleApr: [null],
            workScheduleMay: [null],
            workScheduleJun: [null],
            workScheduleJul: [null],
            workScheduleAug: [null],
            workScheduleSep: [null],
            workScheduleOct: [null],
            workScheduleNov: [null],
            workScheduleDec: [null],
            isDuplicated: [false]
        };

        return this.buildForm({}, group, null, [ValidationService.requiredIfHaveNone(['workScheduleJan', 'workScheduleFeb', 'workScheduleMar', 'workScheduleApr', 'workScheduleMay', 'workScheduleJun', 'workScheduleJul', 'workScheduleAug', 'workScheduleSep', 'workScheduleOct', 'workScheduleNov', 'workScheduleDec'])]);
    }

    public addRow(index: number) {
        const controls = this.formDetails as FormArray;
        controls.insert(index + 1, this.makeDefaultDetailsForm());
    }

    public removeRow(index: number) {
        const controls = this.formDetails as FormArray;
        if (controls.length === 1) {
            this.formDetails.reset();
            const group = this.makeDefaultDetailsForm();
            const control = new FormArray([]);
            control.push(group);
            this.formDetails = control;
            return;
        }
        controls.removeAt(index);
        this.checkDuplicated();
    }

    //Tai bieu mau import
    processDownloadTemplate() {
        this.inspectionPlanService.downloadTemplateImport().subscribe(res => {
            saveAs(res, 'inspection_plan_details_template.xls');
        });
    }

    //doc bieu mau import
    readFileImport() {
        if (this.formSave.get('fileImport').value == null) {
            return;
        }

        this.inspectionPlanService.readFileImport(this.formSave.value).subscribe(
            res => {
                if (this.inspectionPlanService.requestIsSuccess(res)) {
                    this.formDetails = new FormArray([]);
                    this.buildFormDetails(res.data);
                    this.dataError = null;
                    this.checkDuplicated();
                } else {
                    this.dataError = res.data;
                }
            }
        );
    }

    checkDuplicated(item?: any) {
        if (item) {
            if (!item.controls.taskGroupId.value || !item.controls.partyOrganizationId.value) {
                return;
            }
        }

        this.formDetails.controls.forEach(c => {
            c.get('isDuplicated').setValue(false);
        });

        for (let i = 0; i < this.formDetails.controls.length - 1; i++) {
            for (let j = i + 1; j < this.formDetails.controls.length; j++) {
                if (this.formDetails.controls[i].get('taskGroupId').value === this.formDetails.controls[j].get('taskGroupId').value &&
                    this.formDetails.controls[i].get('partyOrganizationId').value === this.formDetails.controls[j].get('partyOrganizationId').value) {
                    this.formDetails.controls[i].get('isDuplicated').setValue(true);
                    this.formDetails.controls[j].get('isDuplicated').setValue(true);
                }
            }
        }
    }

}