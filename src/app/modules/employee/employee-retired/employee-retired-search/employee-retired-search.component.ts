import { FormGroup } from '@angular/forms';
import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { EmpTypesService } from '@app/core/services/emp-type.service';
import { ACTION_FORM } from '@app/core';
import { RetiredContactService } from '@app/core/services/employee/retired-contact.service';

@Component({
    selector: 'employee-retired-search',
    templateUrl: './employee-retired-search.component.html',
    styleUrls: ['./employee-retired-search.component.css']
})
export class EmployeeRetiredSearchComponent extends BaseComponent implements OnInit, OnChanges {
    formSearch: FormGroup;
    status: any;
    empTypeList: any;
    @Input() warningType;
    private listManagementWarningType = ['officerManagement', 'maleOfficerManagement', 'femaleOfficerManagement', 'totalKeyPosition'];
    formConfig = {
        employeeCode: [''],
        employeeName: [''],
        organizationId: [''],
        status: ['0'],
        mobileNumber: [''],
        email: [''],
        personalIdNumber: [''],
        passportNumber: [''],
        positionId: [''],
        empTypeId: [''],
        dateOfRetiredFrom: [null],
        dateOfRetiredTo: [null],
        gender: ['0'],
        managementTypeId: ['0'],
        isKeyPosition: [null],
        isEmployeeCode: [false],
        isEmployeeName: [false],
        isOrganizationId: [false],
        isStatus: [false],
        isMobileNumber: [false],
        isEmail: [false],
        isPersonalIdNumber: [false],
        isPassportNumber: [false],
        isPositionId: [false],
        isEmpTypeId: [false],
        isDateOfRetiredFrom: [false],
        isDateOfRetiredTo: [false],
        isGender: [false],
        isManagementTypeId: [false],
        isShowKeyPosition: [false],
    };

    constructor(
        private retiredContactService: RetiredContactService,
        private empTypeService: EmpTypesService,
        private router: Router,
        public actr: ActivatedRoute,
    ) {
        super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
        this.setMainService(retiredContactService);
        this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW, 
            [ValidationService.notAffter('dateOfRetiredFrom', 'dateOfRetiredTo', 'generalInformation.label.retiredDateTo')]);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.warningType.currentValue) {
            this.warningType = changes.warningType.currentValue;
        }
    }

    ngOnInit() {
        this.setFormSearchValue(this.warningType);
        this.processSearch();
        this.empTypeService.getNoneStaffAreaEmpType().subscribe(res => {
            this.empTypeList = res.data;
        })
    }

    // get form
    get f() {
        return this.formSearch.controls;
    }

    processView(item) {
        this.router.navigate(['/employee/retired/', item.employeeId, 'view']);
    }

    processViewAllInformation(item) {
        this.router.navigate(['/employee/curriculum-vitae/', item.employeeId, 'overall-info']);
    }

    prepareSaveOrUpdate(item) {
        this.router.navigate(['/employee/retired/', item.employeeId, 'edit']);
    }

    public processExport() {
        if (!CommonUtils.isValidForm(this.formSearch)) {
            return;
        }

        const credentials = Object.assign({}, this.formSearch.value);
        const searchData = CommonUtils.convertData(credentials);
        const params = CommonUtils.buildParams(searchData);
        this.retiredContactService.export(params).subscribe(res => {
            saveAs(res, 'retired_contact.xlsx');
        });
    }

    setFormSearchValue(warningType) {
        if (warningType === this.listManagementWarningType[0]) {
            this.formSearch.controls['managementTypeId'].setValue('1');
        } else if (warningType === this.listManagementWarningType[1]) {
            this.formSearch.controls['gender'].setValue('1');
            this.formSearch.controls['managementTypeId'].setValue('1');
        } else if (warningType === this.listManagementWarningType[2]) {
            this.formSearch.controls['gender'].setValue('2');
            this.formSearch.controls['managementTypeId'].setValue('1');
        } else if (warningType === this.listManagementWarningType[3]) {
            this.formSearch.controls['isKeyPosition'].setValue(1);
        }
    }
}
