import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {ActivatedRoute, Router} from "@angular/router";
import {AppParamService} from "@app/core/services/app-param/app-param.service";
import {APP_CONSTANTS, RequestReportService} from "@app/core";
import {AppComponent} from "@app/app.component";
import {DialogService} from "primeng/api";
import {WelfarePolicyCategoryService} from "@app/core/services/population/welfare-policy-category.service";
import {WelfarePolicyProposalService} from "@app/core/services/population/welfare-policy-proposal.service";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormArray, FormGroup, Validators} from "@angular/forms";
import {CommonUtils} from "@app/shared/services";
import {AllowanceProposalService} from "@app/core/services/population/allowance-proposal.service";

@Component({
  selector: 'allowance-proposal-sign-form-popup',
  templateUrl: './allowance-proposal-sign-form-popup.component.html',
  styleUrls: ['./allowance-proposal-sign-form-popup.component.css']
})
export class AllowanceProposalSignFormPopupComponent extends BaseComponent implements OnInit{
    formSave: FormGroup;
    allowanceProposalBOList: FormArray;
    firstRowIndex = 0;
    pageSize = 10;
    formConfig = {
        allowanceProposalSignId: [''],
        allowancePeriodId: [''],
        proposeOrgId: [''],
        allowanceProposalBOList: [null],
        listSearch: [null],
        allowanceProposalId: [null],
    }
    formRequest = {
        allowanceProposalId: [null],
        name: [null],
        allowancePeriod: [null],
        proposeOrg: [null],
        approveOrg: [null],
        signOrg: [null],
        orgType: [null],
        year: [null],
        employeeProposal: [null],
        amountTotal: [null],
        status: [null],
        isCheck: [false]
    }

    constructor(
        private router: Router,
        private appParamService: AppParamService,
        private requestReportService: RequestReportService,
        private app: AppComponent,
        public dialogService: DialogService,
        public activeModal: NgbActiveModal,
        private activatedRoute: ActivatedRoute,
        private welfarePolicyCategoryService: WelfarePolicyCategoryService,
        private service: WelfarePolicyProposalService,
        private allowanceProposalService : AllowanceProposalService,
        public modalService: NgbModal
    ) {
        super();
        this.setMainService(allowanceProposalService);
        this.buildFormRequest()
        this.formSave = this.buildForm({}, this.formConfig);
        this.allowanceProposalBOList = new FormArray([this.makeDefaultFormRequest()])
    }

    ngOnInit() {}

    // public goBack() {
    //     this.router.navigate(['/population/welfare-policy/welfare-policy-proposal']);
    // }

    get f() {
        return this.formSave.controls;
    }

    public setFormValue(propertyConfigs: any, data: any) {
        if(data.allowanceProposalBOList.length > 0){
            for(const item in data.allowanceProposalBOList){
                Object.assign(data.allowanceProposalBOList[item], {'isCheck': false})
            }
        }
        this.propertyConfigs = propertyConfigs;
        this.f['allowanceProposalSignId'].setValue(data.allowanceProposalSignId)
        this.f['allowancePeriodId'].setValue(data.allowancePeriodId)
        this.f['allowanceProposalBOList'].setValue(data.allowanceProposalBOList)
        this.f['proposeOrgId'].setValue(data.proposeOrgId)
        this.f['allowanceProposalId'].setValue(data.allowanceProposalId)
        this.callDataForTable()
    }

    callDataForTable(){
        if(this.f['allowanceProposalBOList'].value.length > 0 && this.f['allowanceProposalBOList'].value[0].allowanceProposalId){
            let listLong = new Array();
            for(const item in this.f['allowanceProposalBOList'].value){
                listLong.push(this.f['allowanceProposalBOList'].value[item].allowanceProposalId)
            }
            this.allowanceProposalService.getAllowanceProposalTableBean(
                {proposeOrgId: this.f['proposeOrgId'].value,
                    allowanceProposalSignId: (this.f['allowanceProposalSignId'] && this.f['allowanceProposalSignId'].value)? this.f['allowanceProposalSignId'].value: 0,
                    list: listLong,
                    isSign: 1,
                    allowanceProposalId: (this.f['allowanceProposalId'] && this.f['allowanceProposalId'].value)? this.f['allowanceProposalId'].value: 0,
                    allowancePeriodId: this.f['allowancePeriodId'].value, isPopup: 1}).subscribe(res => {
                this.buildFormRequest(res)
            })
        }else{
            this.allowanceProposalService.getAllowanceProposalTableBean(
                {proposeOrgId: this.f['proposeOrgId'].value,
                    allowanceProposalSignId: (this.f['allowanceProposalSignId'] && this.f['allowanceProposalSignId'].value)? this.f['allowanceProposalSignId'].value: 0,
                    allowanceProposalId: (this.f['allowanceProposalId'] && this.f['allowanceProposalId'].value)? this.f['allowanceProposalId'].value: 0,
                    isSign: 1,
                    allowancePeriodId: this.f['allowancePeriodId'].value}).subscribe(res => {
                this.buildFormRequest(res)
            })
        }

    }

    private makeDefaultFormRequest(): FormGroup {
        const formSaveRequest = this.buildForm({}, this.formRequest);
        return formSaveRequest;
    }

    private buildFormRequest(list?: any) {
        if (!list || list.length == 0) {
            this.allowanceProposalBOList = new FormArray([this.makeDefaultFormRequest()]);
        } else {
            const controls = new FormArray([]);
            for (const i in list) {
                const formTableConfig = list[i];
                const group = this.makeDefaultFormRequest();
                group.patchValue(formTableConfig);
                controls.push(group);
            }
            this.allowanceProposalBOList = controls;
        }
    }

    public removeRow(index: number, item: FormGroup) {
        const controls = this.allowanceProposalBOList as FormArray;
        if (controls.length === 1) {
            this.buildFormRequest();
            const group = this.makeDefaultFormRequest();
            controls.push(group);
            this.allowanceProposalBOList = controls;
        }
        controls.removeAt(index)
    }

    addRequest(){
        this.activeModal.close(this.allowanceProposalBOList.value)
    }
}
