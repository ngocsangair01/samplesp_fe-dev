import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AppComponent} from '@app/app.component';
import {ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS} from '@app/core/app-config';
import {LetterDenunciationService} from '@app/core/services/monitoring/letter-denunciation.service';
import {BaseComponent} from '@app/shared/components/base-component/base-component.component';
import {CommonUtils} from '@app/shared/services';
import {ValidationService} from '@app/shared/services/validation.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeclineLetterDenunciationModalComponent} from '../modal/decline-letter-denunciation-modal.component';

@Component({
    selector: 'handle-party-letter-denunciation-search',
    templateUrl: './handle-party-letter-denunciation-search.component.html',
    styleUrls: ['./handle-party-letter-denunciation-search.component.css']
})
export class HandlePartyLetterDenunciationSearchComponent extends BaseComponent {

    types = APP_CONSTANTS.LETTER_DENUNCIATION_TYPE;
    statuses = APP_CONSTANTS.LETTER_DENUNCIATION_STATUS;
    formConfig = {
        actionType: [APP_CONSTANTS.LETTER_DENUNCIATION_ACTION_TYPE.HANDLE_PARTY],
        partyOrganizationId: [null],
        type: [null],
        code: ['', [ValidationService.maxLength(50)]],
        name: ['', [ValidationService.maxLength(200)]],
        status: [null],
        dateOfReceptionFrom: [''],
        dateOfReceptionTo: [''],
        isPartyOrganizationId: [false],
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
        private modalService: NgbModal
    ) {
        super(null, CommonUtils.getPermissionCode("resource.handlePartyLetterDenunciation"));
        this.setMainService(letterDenunciationService);
        this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
            [ValidationService.notAffter("dateOfReceptionFrom", "dateOfReceptionTo", "common.label.toDate")]);
        this.processSearch();
    }

    get f() {
        return this.formSearch.controls;
    }

    prepareInsert(letterDenunciationId: number) {
        this.router.navigate(['/monitoring-inspection/letter-denunciation/handle-party/input/', letterDenunciationId]);
    }

    prepareView(letterDenunciationId: number) {
        this.router.navigate(['/monitoring-inspection/letter-denunciation/handle-party/view/', letterDenunciationId]);
    }

    // Từ chối
    prepareDecline(letterDenunciationId) {
        if (letterDenunciationId && letterDenunciationId > 0) {
            const modalRef = this.modalService.open(DeclineLetterDenunciationModalComponent, DEFAULT_MODAL_OPTIONS);
            modalRef.componentInstance.letterDenunciationId = letterDenunciationId;

            modalRef.result.then((result) => {
                if (!result) {
                    return;
                }
                if (this.letterDenunciationService.requestIsSuccess(result)) {
                    this.processSearch();
                }
            });
        }
    }

}
