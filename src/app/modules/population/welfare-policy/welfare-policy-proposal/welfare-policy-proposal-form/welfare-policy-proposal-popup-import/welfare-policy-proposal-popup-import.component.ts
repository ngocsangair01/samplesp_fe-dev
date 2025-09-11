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
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {CommonUtils, ValidationService} from "@app/shared/services";
import {FileControl} from "@app/core/models/file.control";

@Component({
  selector: 'welfare-policy-proposal-popup-import',
  templateUrl: './welfare-policy-proposal-popup-import.component.html',
  styleUrls: ['./welfare-policy-proposal-popup-import.component.css']
})
export class WelfarePolicyProposalPopupImportComponent extends BaseComponent implements OnInit{
    formSave: FormGroup;
    formConfig = {
        proposalOrgId: [''],
        welfarePolicyProposalId: [''],
    }
    public dataError: any;
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
        this.formSave = this.buildForm({}, this.formConfig);
        this.formSave.addControl('fileImport', new FileControl(null, ValidationService.required));
    }

    ngOnInit() {}

    public goBack() {
        this.router.navigate(['/population/welfare-policy-proposal']);
    }

    get f() {
        return this.formSave.controls;
    }

    public setFormValue(propertyConfigs: any, data: any) {
        this.propertyConfigs = propertyConfigs;
        this.f['proposalOrgId'].setValue(data.proposalOrgId)
        this.f['welfarePolicyProposalId'].setValue(data.welfarePolicyProposalId)
    }

    importData(){
        this.formSave.controls['fileImport'].updateValueAndValidity();
        if (!CommonUtils.isValidForm(this.formSave)) {
            return;
        }
        this.app.confirmMessage(null, () => {// on accepted
            this.service.processImport(this.formSave.value).subscribe(res => {
                if (res.type !== 'SUCCESS') {
                    this.dataError = res.data;
                } else {
                    this.dataError = null;
                    this.activeModal.close('SUCCESS')
                }
            });
        }, () => {
            // on rejected
        });
    }

    processDownloadTemplate() {
        const params = this.formSave.value;
        delete params['fileImport'];
        this.formSave.removeControl('fileImport');
        this.formSave.addControl('fileImport', new FormControl(null));
        if (!CommonUtils.isValidForm(this.formSave)) {
            return;
        }
        this.service.downloadTemplateImport(params).subscribe(res => {
            saveAs(res, 'Danh sách đề nghị chính sách phúc lợi.xls');
        });
        this.formSave.controls['fileImport'].setValidators(ValidationService.required);
    }
}
