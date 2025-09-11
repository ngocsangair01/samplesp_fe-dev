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

@Component({
  selector: 'welfare-policy-proposal-popup-add',
  templateUrl: './welfare-policy-proposal-popup-add.component.html',
  styleUrls: ['./welfare-policy-proposal-popup-add.component.css']
})
export class WelfarePolicyProposalPopupAddComponent extends BaseComponent implements OnInit{
    formSave: FormGroup;
    list: FormArray;
    firstRowIndex = 0;
    pageSize = 10;
    formConfig = {
        welfarePolicyProposalId: [''],
        receiverEmployeeId: [''],
        proposalOrgId: [''],
        list: [null],
        listSearch: [null],
    }
    formRequest = {
        welfarePolicyRequestId: [''],
        employeeName: [''],
        employeeId: [''],
        welfarePolicyCategoryName: [''],
        objectType: [''],
        relationshipName: [''],
        objectName: [''],
        requestDate: [''],
        status: [''],
        chairmanTypeName: [''],
        amountTotal: [''],
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
        public modalService: NgbModal
    ) {
        super();
        this.setMainService(this.service);
        this.buildFormRequest()
        this.formSave = this.buildForm({}, this.formConfig);
        this.list = new FormArray([])
    }

    ngOnInit() {}

    public goBack() {
        this.router.navigate(['/population/welfare-policy-proposal']);
    }

    get f() {
        return this.formSave.controls;
    }

    public setFormValue(propertyConfigs: any, data: any) {
        if(data.list.length > 0){
            for(const item in data.list){
                Object.assign(data.list[item], {'isCheck': false})
            }
        }
        this.propertyConfigs = propertyConfigs;
        this.f['welfarePolicyProposalId'].setValue(data.welfarePolicyProposalId)
        this.f['list'].setValue(data.list)
        this.f['proposalOrgId'].setValue(data.proposalOrgId)
        this.callDataForTable()
    }

    callDataForTable(){
        let listLong = new Array();
        for(const item in this.f['list'].value){
            listLong.push(this.f['list'].value[item].welfarePolicyRequestId)
        }
        this.service.listRequestByRule({receiverEmployeeId: this.f['receiverEmployeeId'].value, listSearch: listLong, proposalOrgId: this.f['proposalOrgId'].value, welfarePolicyProposalId: this.f['welfarePolicyProposalId'].value}).subscribe(res => {
            this.buildFormRequest(res)
        })

    }

    private makeDefaultFormRequest(): FormGroup {
        const formSaveRequest = this.buildForm({}, this.formRequest);
        return formSaveRequest;
    }

    private buildFormRequest(list?: any) {
        if (!list || list.length == 0) {
            // this.list = new FormArray([this.makeDefaultFormRequest()]);
        } else {
            const controls = new FormArray([]);
            for (const i in list) {
                const formTableConfig = list[i];
                const group = this.makeDefaultFormRequest();
                group.patchValue(formTableConfig);
                controls.push(group);
            }
            this.list = controls;
        }
    }

    public removeRow(index: number, item: FormGroup) {
        const controls = this.list as FormArray;
        if (controls.length === 1) {
            this.buildFormRequest();
            const group = this.makeDefaultFormRequest();
            controls.push(group);
            this.list = controls;
        }
        controls.removeAt(index)
    }

    addRequest(){
        this.activeModal.close(this.list.value)
    }
}
