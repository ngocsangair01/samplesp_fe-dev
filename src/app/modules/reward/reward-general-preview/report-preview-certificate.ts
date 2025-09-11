import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FileStorageService } from "@app/core/services/file-storage.service";
import { BaseComponent } from "@app/shared/components/base-component/base-component.component";
import { CommonUtils } from "@app/shared/services";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { RewardProposeSignService } from '@app/core/services/reward-propose-sign/reward-propose-sign.service';
import { AppComponent } from '@app/app.component';
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
    @Input() public isPreviewRewardTitle;
    @Input() public value;
    isShowStamp: boolean = false;
    files = [];
    url = '';
    formType = 1; //1: word, pdf 2; excel
    spreadSheetData: any;
    rewardForm: any = {};
    rows: any = 50;
    totalRecords: any = 0;
    constructor(
        public activeModal: NgbActiveModal,
        private fileStorage: FileStorageService,
        private rewardProposeSignService: RewardProposeSignService,
        private app: AppComponent,
    ) {
        super(null, CommonUtils.getPermissionCode("resource.signDocument"));
    }

    ngOnInit() {
        if (this.isPreviewRewardTitle) {
            this.previewRewardTitle();
        } else {
            if (!this.isBlobFile) {
                this.preview();
            } else {
                this.previewBlob();
            }
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
    async downloadFile(isDownloadAll = false) {
        let urlDownload = this.url;
        let fileName = "File_bang_khen.pdf";
        if (!this.isPreviewRewardTitle) {
            fileName = this.file.fileName;
        } else {
            if (isDownloadAll) {
                const formData = { ...this.rewardForm };
                formData['limit'] = null;
                formData['offset'] = null;
                const rest = await this.rewardProposeSignService.previewFile(formData).toPromise();
                if (rest) {
                    urlDownload = rest;
                }
            }
        }
        saveAs(urlDownload, fileName);
    }

    /**
     * previewRewardTitle
     */
    previewRewardTitle() {
        if (this.rewardForm.lstRewardProposeSignObjectForm) {
            this.totalRecords = this.rewardForm.lstRewardProposeSignObjectForm.length;
        }
        this.url = URL.createObjectURL(this.value);
    }

    async onPageChange(event?: any) {
        if (event) {
            this.rewardForm['limit'] = event.rows;
            this.rewardForm['offset'] = event.first;
        }
        const rest = await this.rewardProposeSignService.previewFile(this.rewardForm).toPromise();
        if (rest.size) {
            this.url = URL.createObjectURL(rest);
        } else {
            this.app.errorMessage("rewardPropose.canNotFindFileRewardTitle");
        }
    }
    async onShowStamp(event?: any) {
        this.rewardForm['isOrganizationStamp'] = event ? 1 : 0;
        await this.onPageChange();
    }
}