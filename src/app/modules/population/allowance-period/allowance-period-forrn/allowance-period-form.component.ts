import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {CommonUtils} from "@app/shared/services";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {APP_CONSTANTS} from "@app/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AppComponent} from "@app/app.component";
import {FileControl} from "@app/core/models/file.control";
import {AllowancePeriodService} from "@app/core/services/population/allowance-period.service";
import {WelfarePolicyCategoryService} from "@app/core/services/population/welfare-policy-category.service";
@Component({
    selector: 'allowance-period-form',
    templateUrl: './allowance-period-form.component.html',
    styleUrls: ['./allowance-period-form.component.css']
})
export class AllowancePeriodFormComponent extends BaseComponent implements OnInit {
    formSave: FormGroup;
    view: boolean;
    update: boolean;
    orgTypeOptions;
    allowanceTypeOptions = [];
    welfarePolicyCategoryList = [];
    operationKey = 'action.view';
    adResourceKey = 'resource.allowancePeriod';
    yearList: Array<any>;
    currentDate = new Date();
    currentYear = this.currentDate.getFullYear();
    isChangeStartDate: boolean = false;
    isInvalidDeadline: boolean = false;
    isAllowancePeriodOrgList: boolean = false;
    isInvalidEmpDeadline: boolean = false;
    isInvalidEmpDeadlineStartDate: boolean = false;
    formConfig = {
        allowancePeriodId: [null],
        name: ['', Validators.required],
        allowanceType: [null, Validators.required],
        orgType: [null, Validators.required],
        welfarePolicyCategoryIdList: [null, Validators.required],
        allowancePeriodOrgList: [null, Validators.required],
        approveOrgId: [null, Validators.required],
        startDate: [new Date(), Validators.required],
        deadline: [null, Validators.required],
        empDeadline: [null, Validators.required],
        year: [null, Validators.required],
        status: [null],
        description: [''],
    }

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private welfarePolicyCategoryService: WelfarePolicyCategoryService,
        private allowancePeriodService : AllowancePeriodService,
        private fb: FormBuilder,
        private app: AppComponent,
    ) {
        super();
        this.setMainService(allowancePeriodService);
        this.allowancePeriodService.checkPermissionAllowance().subscribe(res => {
            if(res){
                this.allowanceTypeOptions = []
                if(res.illnessAllowance === 1){
                    this.allowanceTypeOptions.push({ name: 'Trợ cấp bệnh', value: 3 })
                }
                if(res.infertilityAllowance === 1){
                    this.allowanceTypeOptions.push({ name: 'Trợ cấp hiếm muộn', value: 4 })
                }
                if(res.supportAllowance === 1){
                    this.allowanceTypeOptions.push({ name: 'Hỗ trợ', value: 2 })
                }
            }
        })
        this.yearList = this.getYearList();
        const function1 = this.activatedRoute.snapshot.routeConfig.path.split('/')[0];
        if (function1 == 'edit') {
            this.update = true;
            this.view = false;
        } else if (function1 == 'view') {
            this.view = true;
            this.update = false;
        } else if (function1 == 'create') {
            this.view = false;
            this.update = false;
        }
        this.orgTypeOptions = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;
        if (this.view || this.update) {
            this.allowancePeriodService.findOne(Number(this.activatedRoute.snapshot.paramMap.get('id'))).subscribe(res=> {
                this.welfarePolicyCategoryService.findAllByType(res.data.allowanceType).subscribe(res => {
                    this.welfarePolicyCategoryList = res
                });
                this.buildForms(res.data);
                this.formSave.controls['allowancePeriodOrgList'] = new FormArray([]);
                //load danh sach don vi can nop
                if (res.data.allowancePeriodOrgList && res.data.allowancePeriodOrgList.length > 0) {
                    this.formSave.setControl('allowancePeriodOrgList', this.fb.array(res.data.allowancePeriodOrgList.map(item => item) || []));
                }
            })
        } else {
            this.buildForms({year: this.currentYear});
        }
    }

    ngOnInit() {
    }

    get f() {
        return this.formSave.controls;
    }

    private getYearList() {
        const yearList = [];
        for (let i = (this.currentYear - 20); i <= (this.currentYear + 20); i++) {
            const obj = {
                year: i
            };
            yearList.push(obj);
        }
        return yearList;
    }

    public buildForms(data?: any) {
        this.formSave = this.buildForm(data, this.formConfig);
        this.formSave.controls['allowancePeriodOrgList'] = new FormArray([]);
        const fileAttachment = new FileControl(null);
        if (data && data.fileAttachment) {
            if (data.fileAttachment.fileAttachment) {
                fileAttachment.setFileAttachment(data.fileAttachment.fileAttachment);
            }
        }
        this.formSave.addControl('fileAttachment', fileAttachment);
    }

    public goBack() {
        this.router.navigate(['/population/allowance-period']);
    }

    public goView(id: any) {
        this.router.navigate([`/population/allowance-period/view/${id}`]);
    }


    public processSaveOrUpdate() {
        this.isAllowancePeriodOrgList = false;
        if (!CommonUtils.isValidForm(this.formSave) || this.isInvalidDeadline || this.isInvalidEmpDeadline || this.isInvalidEmpDeadlineStartDate) {
            return;
        }
        if(!this.isChangeStartDate && !this.view && !this.update){
            this.formSave.controls['startDate'].setValue(this.formSave.value.startDate.getTime())
        }
        this.formSave.value['allowancePeriodOrgList'] = this.formSave.get('allowancePeriodOrgList').value;
        if(this.formSave.get('allowancePeriodOrgList').value.length == 0){
            this.isAllowancePeriodOrgList = true;
            return;
        }
        this.app.confirmMessage(null, () => {
            this.allowancePeriodService.saveOrUpdateFormFile(this.formSave.value)
                .subscribe(res => {
                    this.goView(res.data.allowancePeriodId);
                });
        }, () => {

        });

    }

    changeAllowanceType(event: any){
        if(event){
            if(event === 4){
                this.formSave.controls['orgType'].setValue(3);
            }else if(event === 2 || event === 3){
                this.formSave.controls['orgType'].setValue(2);
            }
            this.welfarePolicyCategoryService.findAllByType(2).subscribe(res => {
                this.welfarePolicyCategoryList = res.filter((data: any) => data.type === event)
            });
        }else{
            this.welfarePolicyCategoryList = []
        }
    }

    setDefaultInvalidDate(){
        this.isInvalidDeadline = false;
        this.isInvalidEmpDeadlineStartDate = false;
        this.isInvalidEmpDeadline = false;
    }

    changeStartDate(event: any) {
        this.setDefaultInvalidDate();
        if (event) {
            this.isChangeStartDate = true
            let date = new Date(event).getTime();
            if (this.formSave.get('deadline').value && date > this.formSave.get('deadline').value) {
                this.isInvalidDeadline = true;
            } else {
                this.isInvalidDeadline = false;
            }
            if (this.formSave.get('empDeadline').value && date > this.formSave.get('empDeadline').value) {
                this.isInvalidEmpDeadlineStartDate = true;
            } else {
                this.isInvalidEmpDeadlineStartDate = false;
            }
            if (this.formSave.get('deadline').value && this.formSave.get('empDeadline').value && this.formSave.get('deadline').value < this.formSave.get('empDeadline').value) {
                this.isInvalidEmpDeadline = true;
            } else {
                this.isInvalidEmpDeadline = false;
            }
        }
    }

    changeDeadline(event: any) {
        this.setDefaultInvalidDate();
        if (event) {
            let date = new Date(event).getTime();
            if (this.formSave.get('startDate').value && date < this.formSave.get('startDate').value) {
                this.isInvalidDeadline = true;
            } else {
                this.isInvalidDeadline = false;
            }
            if (this.formSave.get('empDeadline').value && date < this.formSave.get('empDeadline').value) {
                this.isInvalidEmpDeadline = true;
            } else {
                this.isInvalidEmpDeadline = false;
            }
            if (this.formSave.get('startDate').value && this.formSave.get('empDeadline').value && this.formSave.get('startDate').value > this.formSave.get('empDeadline').value) {
                this.isInvalidEmpDeadlineStartDate = true;
            } else {
                this.isInvalidEmpDeadlineStartDate = false;
            }
        }
    }

    changeEmpDeadline(event: any) {
        this.setDefaultInvalidDate();
        if (event) {
            let date = new Date(event).getTime();
            if (this.formSave.get('deadline').value && date > this.formSave.get('deadline').value) {
                this.isInvalidEmpDeadline = true;
            } else {
                this.isInvalidEmpDeadline = false;
            }
            if (this.formSave.get('startDate').value && date < this.formSave.get('startDate').value) {
                this.isInvalidEmpDeadlineStartDate = true;
            } else {
                this.isInvalidEmpDeadlineStartDate = false;
            }
            if (this.formSave.get('deadline').value && this.formSave.get('startDate').value && this.formSave.get('deadline').value < this.formSave.get('startDate').value) {
                this.isInvalidDeadline = true;
            } else {
                this.isInvalidDeadline = false;
            }
        }
    }

}
