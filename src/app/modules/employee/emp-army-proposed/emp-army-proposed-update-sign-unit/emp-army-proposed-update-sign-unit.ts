import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import {EmpArmyProposedService} from "@app/core/services/employee/emp-army-proposed.service";
import {close} from "fs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    templateUrl: './emp-army-proposed-update-sign-unit.html',
})
export class empArmyProposedUpdateSignUnit extends BaseComponent implements OnInit {

    form: FormGroup
    isDuplicateOrganization: any;
    isMobileScreen: boolean = false;

    formConfig = {
        idRecord: [],
        organizationId: ['', [ValidationService.required]],
        organizationName: [],
    }


    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private empArmyProposedService: EmpArmyProposedService,
    ) {
        super(null, CommonUtils.getPermissionCode("resource.admin_nqh"));
        this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
     }

    ngOnInit() {
        this.form = this.buildForm('', this.formConfig);
        if (this.config.data) {
            let value = {...this.config.data};
            this.form = this.buildForm(value, this.formConfig);
        }
    }

    updateStatus(event: any) {
        const signOrganizationId = event.organizationId.value;
        const empArmyProposedId = this.config.data.idRecord;
        this.onSelectorChangeOrganization(signOrganizationId);
        if (this.isDuplicateOrganization == false) {
            // call service update
            this.empArmyProposedService.updateSignOrganizationId({
                empArmyProposedId,
                signOrganizationId
            }).subscribe(rec => {
                    if(rec.code == "success"){
                        this.goBack()
                    }
                }
            )
        }
    }

    goBack(){
        this.ref.close()
    }

    onSelectorChangeOrganization(organizationId: any){
        const currentOrganization = this.config.data.organizationId;

        this.isDuplicateOrganization = false;
        if(organizationId === currentOrganization){
            this.isDuplicateOrganization = true;
        }
    }

}
