import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import {PersonnelKeyService} from "@app/core/services/security-guard/personnel-key.service";
import {Router} from "@angular/router";


@Component({
    selector: 'personnel-key-form',
    templateUrl: './personnel-key-form.component.html',
    styleUrls: ['./personnel-key-form.component.css']
})
export class PersonnelKeyFormComponent extends BaseComponent {
    formSave: FormGroup;
    formConfig = {
        employeeId: ['', [ValidationService.required]]
    };

    constructor(
        private personnelKeyService: PersonnelKeyService,
        private sysCatService: SysCatService,
        private app: AppComponent,
        private router: Router,
    ) {
        // super(null, CommonUtils.getPermissionCode("resource.politicsQuality"));
        super();
        this.formSave = this.buildForm({}, this.formConfig);
    }

    get f() {
        return this.formSave.controls;
    }

    processSave() {
        if (!CommonUtils.isValidForm(this.formSave)) {
            return;
        }
        this.app.confirmMessage(null, () => { // on accepted
            this.personnelKeyService.saveOrUpdate(this.formSave.value)
                .subscribe(res => {
                    if (this.personnelKeyService.requestIsSuccess(res)) {
                        this.close();
                    }
                });
        }, () => { });
    }

    close(){
        this.router.navigate(['security-guard/personnel-key']);
    }
}
