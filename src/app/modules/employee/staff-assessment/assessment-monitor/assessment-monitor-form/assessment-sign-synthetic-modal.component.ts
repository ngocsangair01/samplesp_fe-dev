import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "@app/shared/components/base-component/base-component.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslationService } from "angular-l10n";

@Component({
    selector: 'assessment-sign-synthetic-modal',
    templateUrl: './assessment-sign-synthetic-modal.component.html',
    styleUrls: ['./assessment-sign-synthetic-modal.component.css']
})
export class AssessmentSignSyntheticModal extends BaseComponent implements OnInit {
    dataSignSynthetic = null;
    fileName = null;
    url = '';
    constructor(
        public activeModal: NgbActiveModal,
        public translation: TranslationService,
    ) {
        super();
    }

    ngOnInit() {
        if (this.dataSignSynthetic) {
            const contentDisposition = this.dataSignSynthetic.headers.get('content-disposition');
            this.fileName = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
            this.url = URL.createObjectURL(this.dataSignSynthetic.body);
        }
    }

    /**
     * Hàm dowload file báo cáo
     */
    downloadFile() {
        saveAs(this.url, this.fileName);
    }
}