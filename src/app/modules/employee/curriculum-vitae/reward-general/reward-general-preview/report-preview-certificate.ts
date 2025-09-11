import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FileStorageService } from "@app/core/services/file-storage.service";
import { BaseComponent } from "@app/shared/components/base-component/base-component.component";
import { CommonUtils } from "@app/shared/services";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

declare var $: any;
@Component({
    selector: 'report-preview-certificate',
    templateUrl: './report-preview-certificate.component.html'
})
export class ReportPreviewCertificateComponent extends BaseComponent implements OnInit {
    @ViewChild('spreadsheet')
    public spreadsheet: ElementRef;
    @Input() public file;
    @Input() public isBlobFile = false;

    files = [];
    url = '';
    formType = 1; //1: word, pdf 2; excel
    spreadSheetData: any;
    constructor(
        public activeModal: NgbActiveModal,
        private fileStorage: FileStorageService
    ) {
        super(null, CommonUtils.getPermissionCode("resource.signDocument"));
    }

    ngOnInit() {
        if (!this.isBlobFile) {
            this.preview();
        } else {
            this.previewBlob();
        }
    }

    previewBlob() {
        this.url = URL.createObjectURL(this.file);
    }

    preview() {
        this.files.push(this.file);
        if(this.file.fileName.includes('.docx') || this.file.fileName.includes('.doc')) {
            this.fileStorage.downloadPdfFile(this.file.secretId)
            .subscribe(res => {
                this.url = URL.createObjectURL(res);
            });
        } else if (this.file.fileName.includes('.xlsx')) {
            const self = this;
            this.formType = 2
            this.fileStorage.downloadFileExcel(this.file.secretId)
                .subscribe(res => {
                this.url = URL.createObjectURL(res);
                $(self.spreadsheet.nativeElement).kendoSpreadsheet({ rows: 12000, toolbar: false});
                self.spreadSheetData = $(self.spreadsheet.nativeElement).getKendoSpreadsheet();
                self.spreadSheetData.fromFile(res);
            });
        }
        else {
            this.fileStorage.downloadFile(this.file.secretId)
            .subscribe(res => {
                this.url = URL.createObjectURL(res);
            });
        }
    }

    /**
     * Hàm dowload file báo cáo
     */
    downloadFile() {
        saveAs(this.url, this.file.fileName)
    }
}