import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { AssessmentPeriodService } from '@app/core/services/assessmentPeriod/assessment-period.service';
import { FormGroup, Validators, FormControl , FormArray, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileControl } from '@app/core/models/file.control';
import { CommonUtils, ValidationService } from '@app/shared/services';
import {APP_CONSTANTS} from '../../../../../../core/app-config';
import { HelperService } from '@app/shared/services/helper.service';
@Component({
    selector: 'assessment-period-model',
    templateUrl: './assessment-period-model.component.html',
    styleUrls: ['./assessment-period-model.component.css']
})
export class AssessmentPeriodModelComponent extends BaseComponent implements OnInit {
    formData: FormGroup;
    dataError: any;
    formConfig = {
        assessmentPeriodId: [''],
        assessmentPeriodName: [''],
        assessmentPeriodObjectId: [null],
        employeeId: [null, ValidationService.required]
    };
    assessmentList: [];
    levelRoleList : [];
    updateCB: boolean;
    listAssessmentPeriodEmployee: FormArray;
    isAdd: boolean;
    isEdit: boolean;
    isMobileScreen: boolean = false;
    constructor(
        private router: Router,
        private app: AppComponent,
        private formBuilder: FormBuilder,
        private assessmentPeriodService: AssessmentPeriodService,
        public activeModal: NgbActiveModal,
        public helperService: HelperService,
    ) {
        super(null, 'ASSESSMENT_PERIOD');
        this.setMainService(assessmentPeriodService);
        this.levelRoleList = APP_CONSTANTS.LEVEL_ROLE
        this.buildForms({})
        this.buildFormsListAssessmentPeriodEmployee([])
        this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
    }

    ngOnInit() {
    }

    private buildForms(data?: any) {
        this.formData = this.buildForm(data, this.formConfig);
    }
    get f () {
        return this.formData.controls;
    }
    /**
     * setFormValue
     * param data
     */
    public setFormValue(propertyConfigs: any, data: any) {
        this.propertyConfigs = propertyConfigs;
        this.assessmentList = data.assessmentList
        this.updateCB = data.updateCB
        this.f['assessmentPeriodId'].setValue(data.assessmentPeriodId)
        this.f['employeeId'].setValue(data.employeeId)
        this.isAdd = data.type == "add" ? true : false;
        this.isEdit = data.type == "edit" ? true : false;
        this.assessmentPeriodService.findOne(data.assessmentPeriodId).subscribe((res) => {
            const assessmentObject = APP_CONSTANTS.ASSESSMENT_OBJECT.find((item) => item.id == res.data.assessmentObject)
            this.f['assessmentPeriodName'].setValue(assessmentObject.name)
            this.f['assessmentPeriodObjectId'].setValue(assessmentObject.id)
        })
        if(this.isEdit) {
            this.searchTableData()
        }
    }
    cancel(){
        this.activeModal.close();
    }
    public changeDataEmployee(event) {
        const employeeId = this.f['employeeId'].value;
        if (employeeId) {
            this.searchTableData()
        } else {
            this.buildFormsListAssessmentPeriodEmployee([])
        }
    }
    private searchTableData(){
        const form = {
            assessmentPeriodId: this.f['assessmentPeriodId'].value,
            employeeId: this.f['employeeId'].value,
        }
        this.assessmentPeriodService.getStaffMappingAssessmentLevelList(form).subscribe((res) => {
            this.buildFormsListAssessmentPeriodEmployee(res)
        })
    }
    private makeDefaultAssessmentSQLForm(): FormGroup {
        return this.formBuilder.group({
          assessmentLevelName: [null],
          formTypeList: [null],
          levelRole: [null],
          assessmentOrder: [null],
          employeeId: [null],
          assessmentPartyOrganizationId: [null],
          hasSign: [null],
          assessmentLevelId: [null],
          assessmentEmployeeMappingId: [null],
          isDisabled: [null],
          updateCB: [''],
        });
      }
    private buildFormsListAssessmentPeriodEmployee(data?: any[]) {
        if(data && data.length > 0) {
            data.forEach((item) => {
                if(item.assessmentOrder == 1 && !item.hasSign) {
                    item.hasSign = true;
                } 
            })
        }
        const controls = new FormArray([]);
          for (const item of data) {
            const group = this.makeDefaultAssessmentSQLForm();
            group.patchValue(item);
            controls.push(group);
          }
        this.listAssessmentPeriodEmployee = controls;
    }

    public save() {
        if(!CommonUtils.isValidForm(this.formData)) {
            return;
        }
        const formData = this.formData.value
        formData.isAddNew = this.isAdd ? 1 : 0;
        const levelNameEmployeeList = this.listAssessmentPeriodEmployee.value;
        // validate phải chọn ít nhất 1 người ký với từng cấp đánh giá
        const levelNameEmployeeListFilter = levelNameEmployeeList.filter(item => item.employeeId)
        const listOrder = [];
        for (const i in levelNameEmployeeListFilter) {
            const item = levelNameEmployeeListFilter[i];
            if (listOrder.indexOf(item.assessmentOrder) < 0) {
                listOrder.push(item.assessmentOrder);// lấy ra các order cần validate
            }
        }
        for (const i in listOrder) {
            const order = listOrder[i];// cấp cần validate;
            const hasSignListByOrder = levelNameEmployeeListFilter.filter(item => item.hasSign && item.assessmentOrder == order);
            if (hasSignListByOrder.length <= 0) {
                this.helperService.APP_TOAST_MESSAGE.next({type: "WARNING", code: "assessmentOrderLevel" + order, message: null, data: null});
                return;
            }
        }
        formData['levelNameEmployeeList'] = levelNameEmployeeList
        formData['updateCB'] = this.updateCB
        this.app.confirmMessage(null, () => { // on accept
        this.assessmentPeriodService.updateAssessmentEmployeeMapping2(formData).subscribe((res) => {
            if (this.assessmentPeriodService.requestIsSuccess(res)) {
                this.activeModal.close(res);
            }
            })
        }, () => {
        // on rejected
        });
    }
}
