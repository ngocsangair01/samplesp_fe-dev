import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { LetterDenunciationService } from '@app/core/services/monitoring/letter-denunciation.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { ValidationService } from '@app/shared/services/validation.service';

@Component({
    selector: 'receive-letter-denunciation-search',
    templateUrl: './receive-letter-denunciation-search.component.html',
    styleUrls: ['./receive-letter-denunciation-search.component.css']
})
export class ReceiveLetterDenunciationSearchComponent extends BaseComponent {

    types = APP_CONSTANTS.LETTER_DENUNCIATION_TYPE;
    statuses = APP_CONSTANTS.LETTER_DENUNCIATION_STATUS;
    formConfig = {
        actionType: [APP_CONSTANTS.LETTER_DENUNCIATION_ACTION_TYPE.RECEIVE],
        type: [null],
        code: ['', [ValidationService.maxLength(50)]],
        name: ['', [ValidationService.maxLength(200)]],
        status: [null],
        dateOfReceptionFrom: [''],
        dateOfReceptionTo: [''],
        isType: [false],
        isCode: [false],
        isName: [false],
        isStatus: [false],
        isDateOfReceptionFrom: [false],
        isDateOfReceptionTo: [false]
    };

    constructor(
        private letterDenunciationService: LetterDenunciationService,
        private router: Router,
        private app: AppComponent
    ) {
        super(null, CommonUtils.getPermissionCode("resource.receiveLetterDenunciation"));
        this.setMainService(letterDenunciationService);
        this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
            [ValidationService.notAffter("dateOfReceptionFrom", "dateOfReceptionTo", "common.label.toDate")]);
        this.processSearch();
    }

    get f() {
        return this.formSearch.controls;
    }

    prepareSaveOrUpdate(item?: any) {
        if (item && item.letterDenunciationId > 0) {
            this.router.navigate(['/monitoring-inspection/letter-denunciation/receive/edit/', item.letterDenunciationId]);
        } else {
            this.router.navigate(['/monitoring-inspection/letter-denunciation/receive/add']);
        }
    }

    prepareView(item) {
        this.router.navigate(['/monitoring-inspection/letter-denunciation/receive/view/', item.letterDenunciationId]);
    }

    processDelete(item) {
        if (item && item.letterDenunciationId > 0) {
            this.app.confirmDelete(null, () => {// on accepted
                this.letterDenunciationService.deleteById(item.letterDenunciationId)
                    .subscribe(res => {
                        if (this.letterDenunciationService.requestIsSuccess(res)) {
                            this.processSearch();
                        }
                    });
            }, () => {// on rejected

            });
        }
    }

}
