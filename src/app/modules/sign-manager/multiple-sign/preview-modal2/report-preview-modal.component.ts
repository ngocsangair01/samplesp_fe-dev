import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { AssessmentEmployeeLevelService } from "@app/core/services/assessment-employee-level/assessment-employee-level.service";
import { FileStorageService } from "@app/core/services/file-storage.service";
import { SignDocumentService } from "@app/core/services/sign-document/sign-document.service";
import { BaseComponent } from "@app/shared/components/base-component/base-component.component";
import { CommonUtils } from "@app/shared/services";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

declare var $: any;
@Component({
    selector: 'report-preview-modal',
    templateUrl: './report-preview-modal.component.html'
})
export class ReportPreviewModalComponent extends BaseComponent implements OnInit {
    @ViewChild('spreadsheet')
    public spreadsheet: ElementRef;
    @Input() public file;
    formType = 1;
    files = [];
    url = '';
    constructor(
        public activeModal: NgbActiveModal,
        private signDocumentService: SignDocumentService,
        private fileStorage: FileStorageService
    ) {
        super(null, CommonUtils.getPermissionCode("resource.signDocument"));
    }

    ngOnInit() {
        this.preview();
    }
    preview() {
        this.fileStorage.downloadFile(this.file.secretId)
        .subscribe(res => {
            this.url = URL.createObjectURL(res);
        });
    }
    /**
     * Hàm dowload file báo cáo
     */
    downloadFile() {
        saveAs(this.url, this.file.fileName)
    }
}