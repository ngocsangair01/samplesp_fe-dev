import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { DistrictService } from '@app/core/services/district/District.service';
import { EmpTypesService } from '@app/core/services/emp-type.service';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { RetiredContactService } from '@app/core/services/employee/retired-contact.service';
import { NationService } from '@app/core/services/nation/nation.service';
import { ProvinceService } from '@app/core/services/province/province.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { TranslationService } from 'angular-l10n';
import { ValidationService } from '@app/shared/services/validation.service';

@Component({
    selector: 'retired-information-form',
    templateUrl: './retired-information-form.component.html',
    styleUrls: ['./retired-information-form.component.css']
})
export class RetiredInformationFormComponent extends BaseComponent implements OnInit {
    formView: FormGroup;
    formSavePartyMember: FormGroup;
    nationList: any = {};
    empTypeList: any = {};
    degreeList: any = {};
    empTypeFileList: any = {};
    ethnicList: any = {};
    religionList: any = {};
    permanentProvinceList: any = {};
    currentProvinceList: any = {};
    recuitList: any = {};
    employeeStatusList: any = {};
    officerTypeList: any = {};
    highestRankList: any = {};
    trainingResultList: any = {};
    noteTypeList: any = {};
    expressionViolationList: any = [];
    isInnerParty: boolean = true;
    employeeId: number;
    isView: boolean = false;
    isUpdate: boolean = false;
    isFirstIntroduceIn: boolean = true;
    isSecondIntroduceIn: boolean = true;
    linkGotoVHR: any;
    permanentDistrictList: any = {};
    permanentWardList: any = {};
    currentDistrictList: any = {};
    currentWardList: any = {};
    provinceId: any;
    currentProvinceId: any;
    currentDistrictId: any;
    permanentProvinceId: any;
    permanentDistrictId: any;
    districtWardId: any = ['']
    isDeath: any;
    isAlwaysDisable: any;
    dateOfRetired: any;
    provinceList: any;
    settings = {
        singleSelection: false,
        text: this.translation.translate('common.label.cboSelect'),
        selectAllText: this.translation.translate('common.label.choseAll'),
        unSelectAllText: 'Bỏ chọn tất cả',
        searchPlaceholderText: this.translation.translate('common.label.cboSelect'),
        enableSearchFilter: true,
        groupBy: 'groupName',
        labelKey: 'name',
        primaryKey: 'sysCatId',
        noDataLabel: this.translation.translate('common.label.noData'),
        disabled: false
    };

    formConfig = {
        employeeId: [null],
        employeeCode: [null],
        employeeName: [{ value: null, disabled: true }],
        gender: [{ value: null, disabled: true }],
        formatedSoldierNumber: [{ value: null, disabled: true }], // So hieu sy quan
        dateOfBirth: [null],
        nationId: [],
        currentPosition: [{ value: null, disabled: true }],
        orgFullName: [{ value: null, disabled: true }],
        empTypeId: [null],
        personalIdNumber: [{ value: null, disabled: true }],
        personalIdIssuedDate: [null],
        personalIdIssuedPlace: [{ value: null, disabled: true }],
        passportNumber: [{ value: null, disabled: true }],
        passportIssueDate: [null],
        ethnicId: [null],
        religionId: [null],
        placeOfBirth: [{ value: null, disabled: true }],
        provinceOfBirthId: [null],
        origin: [{ value: null, disabled: true }],
        provinceOfOriginId: [null],
        dateOfRetired: [null],
        mobileNumber: [{ value: null, disabled: true }],
        phoneNumber: [{ value: null, disabled: true }],
        fax: [{ value: null, disabled: true }],
        isRetired: [{ value: null, disabled: true }],
    };

    formSavePartyMemberConfig = {
        currentAddress: [null],
        permanentAddress: [null],
        permanentDistrictId: [null],
        permanentWardId: [null],
        permanentProvinceId: [null],
        currentDistrictId: [null],
        currentProvinceId: [null],
        currentWardId: [null],
        mobileNumber: [null, [ValidationService.maxLength(50)]],
        phoneNumber: [null,[ValidationService.maxLength(50)]],
        fax: [null, [ValidationService.maxLength(50)]],
        isDeath: [{ value: null, disabled: true }],
        dateOfDeath: [null, [ValidationService.beforeCurrentDate]],
        note: [null, [ValidationService.maxLength(4000)]],
        dateOfRetired: [null],
    };


    constructor(
        private retiredContactService: RetiredContactService,
        private curriculumVitaeService: CurriculumVitaeService,
        private employeeResolver: EmployeeResolver,
        private nationService: NationService,
        private provinceService: ProvinceService,
        private empTypeService: EmpTypesService,
        private sysCatService: SysCatService,
        private app: AppComponent,
        private router: Router,
        public translation: TranslationService,
        public districtService: DistrictService,
    ) {
        super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
        this.formView = this.buildForm({}, this.formConfig);
        this.buildformSavePartyMember({});

        this.employeeResolver.EMPLOYEE.subscribe(
            data => {
                if (data) {
                    this.retiredContactService.getRetiredContactDetail(data).subscribe(res => {
                        if (res.data.isDeath) {
                            this.isDeath = false;
                        }
                        else {
                            this.isDeath = true;
                        }
                        this.dateOfRetired = res.data.dateOfRetired;
                        this.permanentProvinceId = res.data.permanentProvinceId;
                        this.permanentDistrictId = res.data.permanentDistrictId;
                        this.currentProvinceId = res.data.currentProvinceId;
                        this.currentDistrictId = res.data.currentDistrictId;
                        this.districtService.getDistrictByProvinceId(this.permanentProvinceId).subscribe(res => this.permanentDistrictList = res.data);
                        this.districtService.getDistrictByProvinceId(this.currentProvinceId).subscribe(res => this.currentDistrictList = res.data);
                        this.districtService.getDistrictByParentId(this.permanentDistrictId).subscribe(res => this.permanentWardList = res.data);
                        this.districtService.getDistrictByParentId(this.currentDistrictId).subscribe(res => this.currentWardList = res.data);
                        this.buildformSavePartyMember(res.data);
                    });
                    this.curriculumVitaeService.findOne(data).subscribe(res => {
                        // Load thong tin chung cua nhan vien
                        this.formView = this.buildForm(res.data, this.formConfig);
                        this.linkGotoVHR = APP_CONSTANTS.VHR.URL_VIEW_EMPLOYEE + res.data.employeeCode;
                        this.formView.patchValue({
                            dateOfRetired: this.dateOfRetired
                        })
                    });
                    this.employeeId = data;
                }

            }
        );
    }

    ngOnInit() {
        this.isAlwaysDisable = true;
        const subPaths = this.router.url.split('/');
        if (subPaths.length > 4) {
            this.isView = subPaths[4] === 'view';
            this.isUpdate = subPaths[4] === 'edit'
        }
        // Quốc tịch
        this.nationService.getNationList().subscribe(res => this.nationList = res.data);

        // Danh sách diện đối tượng
        this.empTypeService.getListEmpType().subscribe(res => this.empTypeList = res);

        // Danh sach dan toc
        this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.ETHNIC).subscribe(res => this.ethnicList = res.data);

        // Danh sach tinh thanh
        this.provinceService.getProvinceList().subscribe(res => this.permanentProvinceList = res.data);

        // Danh sach tinh thanh
        this.provinceService.getProvinceList().subscribe(res => this.currentProvinceList = res.data);

        this.provinceService.getProvinceList().subscribe(res => this.provinceList = res.data);
    }

    get f() {
        return this.formView.controls;
    }

    get fPartyMember() {
        return this.formSavePartyMember.controls;
    }

    private buildformSavePartyMember(data?: any): void {
        this.formSavePartyMember = this.buildForm(data, this.formSavePartyMemberConfig, ACTION_FORM.INSERT,
            [ValidationService.requiredControlInGroup(['isDeath', 'dateOfDeath']),
        ]
            );
    }

    /**
     * processSaveOrUpdate
     */
    public doSaveOrUpdate() {
        if (!CommonUtils.isValidForm(this.formSavePartyMember)) {
            return;
        }
        this.app.confirmMessage(null, () => { // on accepted

            const formSave = {};
            formSave['permanentAddress'] = this.formSavePartyMember.value.permanentAddress;
            formSave['currentAddress'] = this.formSavePartyMember.value.currentAddress;
            formSave['permanentDistrictId'] = this.formSavePartyMember.value.permanentDistrictId;
            formSave['permanentWardId'] = this.formSavePartyMember.value.permanentWardId;
            formSave['permanentProvinceId'] = this.formSavePartyMember.value.permanentProvinceId;
            formSave['currentDistrictId'] = this.formSavePartyMember.value.currentDistrictId;
            formSave['currentProvinceId'] = this.formSavePartyMember.value.currentProvinceId;
            formSave['currentWardId'] = this.formSavePartyMember.value.currentWardId;
            formSave['mobileNumber'] = this.formSavePartyMember.value.mobileNumber;
            formSave['phoneNumber'] = this.formSavePartyMember.value.phoneNumber;
            formSave['fax'] = this.formSavePartyMember.value.fax;
            formSave['dateOfDeath'] = this.formSavePartyMember.value.dateOfDeath;
            formSave['isDeath'] = this.formSavePartyMember.value.isDeath;
            formSave['note'] = this.formSavePartyMember.value.note;
            formSave['employeeId'] = this.employeeId;
            this.retiredContactService.saveOrUpdate(formSave).subscribe(res => {
                if (this.retiredContactService.requestIsSuccess(res)) {
                    if (formSave['isDeath'] === 1) {
                        formSave['dateOfDeath'] = this.formSavePartyMember.value.dateOfDeath;
                    }
                    this.buildformSavePartyMember(res.data);
                    this.goBack();
                }
            });
        }, () => {
            // on rejected
        });
    }

    public goBack() {
        this.router.navigate(['/employee/retired']);
    }

    public onLoadDistrict(event: any) {
        // Load danh sach quan huyen thuong tru
        if (this.formSavePartyMember.value.permanentProvinceId != null) {
            this.districtService.getDistrictByProvinceId(event).subscribe(res => this.permanentDistrictList = res.data);
        }
        else {
            this.permanentDistrictList = {};
            this.permanentWardList = {};
            this.formSavePartyMember.patchValue({
                permanentProvinceId: null,
                permanentDistrictId: null,
                permanentWardId: null,
                permanentAddress: null,
            })
        }
    }

    // Danh sach lang xa thuong tru
    public onLoadVillage(event: any) {
        this.districtService.getDistrictByParentId(event).subscribe(res => this.permanentWardList = res.data);

    }

    public onLoadCurrentDistrict(event: any) {
        // Load danh sach quan huyen hien tai
        if (this.formSavePartyMember.value.currentProvinceId != null) {
            this.districtService.getDistrictByProvinceId(event).subscribe(res => this.currentDistrictList = res.data);
        } else {
            this.currentDistrictList = {};
            this.currentWardList = {};
            this.formSavePartyMember.patchValue({
                currentProvinceId: null,
                currentDistrictId: null,
                currentWardId: null,
                currentAddress: null,
            })
        }
    }

    public onLoadCurrentVillage(event: any) {
        // Danh sach lang xa hien tai
        this.districtService.getDistrictByParentId(event).subscribe(res => this.currentWardList = res.data);
    }
    public onChangeIsDeath(event) {
        if (event.checked) {
            this.isDeath = false;
        } else {
            this.isDeath = true;
        }
    }

    navigate() {
        this.router.navigate(['/employee/retired/', this.employeeId, 'edit']);
    }

}