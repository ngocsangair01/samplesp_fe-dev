import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "@app/shared/components/base-component/base-component.component";
import {CommonUtils, ValidationService} from "@app/shared/services";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {FormGroup, Validators} from "@angular/forms";
import {AppComponent} from "@app/app.component";
@Component({
    selector: 'pass-sign-modal',
    templateUrl: './pass-sign-modal.component.html'
})
export class PassSignModalComponent extends BaseComponent {
    formSearch: FormGroup;
    formConfig = {
        employeeId: ['', Validators.required],
        decisionNumber: ['',Validators.required],
        promulgateDate:['',Validators.required]
    };

    constructor(
        private app: AppComponent,
        public activeModal: NgbActiveModal,
    ) {
        super(null, CommonUtils.getPermissionCode("resource.rewardGeneral"));
        this.formSearch = this.buildForm({}, this.formConfig);
    }

    ngOnInit() {
    }

    get f() {
        return this.formSearch.controls;
    }
    save(){
        if(CommonUtils.isValidForm(this.formSearch)){
            this.app.confirmMessage('common.message.confirm.save', () => {// on accepted
                this.activeModal.close(this.formSearch.value)
            }, () => {
                // on rejected
            });
        }
    }


}