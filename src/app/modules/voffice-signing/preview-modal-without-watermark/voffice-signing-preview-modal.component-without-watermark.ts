import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FileStorageService } from "@app/core/services/file-storage.service";
import { SignDocumentService } from "@app/core/services/sign-document/sign-document.service";
import { BaseComponent } from "@app/shared/components/base-component/base-component.component";
import { CommonUtils } from "@app/shared/services";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ReportManagerService } from '@app/core/services/report/report-manager.service';
declare var $: any;
@Component({
    selector: 'voffice-signing-preview-modal-without-watermark',
    templateUrl: './voffice-signing-preview-modal.component-without-watermark.html'
})
export class VofficeSigningPreviewModalComponentWithoutWatermark extends BaseComponent implements OnInit {
    @ViewChild('spreadsheet')
    public spreadsheet: ElementRef;
    @Input() public id = null;
    @Input() public transCode;
    spreadSheetData: any;
    files = [];
    formType = 1;
    file = null;
    index = null;
    url = '';

    constructor(
        public activeModal: NgbActiveModal,
        private signDocumentService: SignDocumentService,
        private fileStorage: FileStorageService,

    ) {
        super();
    }

    ngOnInit() {
        this.getFile();
    }

    getFile() {
        if(this.id) {
            this.signDocumentService.getFile2(this.id).subscribe(res => {
                if (this.signDocumentService.requestIsSuccess(res)) {
                    if (res.data && res.data.transcode) {
                        this.transCode = res.data.transcode;
                        this.id = null;
                        this.files = res.data.files
                        this.file = this.files[0];
                        this.preview(this.file , 0);
                    } else {
                        if (res.data && res.data.length > 0) {
                            this.files = res.data;
                        }
                    }
                }
            });
        } else if (this.transCode) {
            this.signDocumentService.getSignFile(this.transCode).subscribe(res => {
                if(res.data && res.data.length > 0) {
                    this.files = res.data
                    this.file = this.files[0];
                    this.preview(this.file , 0);
                }
            })
        }
    }

    preview(item: any, index: number) {
        if(this.transCode) {
            if(this.index != index) {
                this.index = index
                this.file = item;
                if(this.file.fileName.includes('.docx') || this.file.fileName.includes('.doc')) {
                    this.formType = 1
                    this.signDocumentService.getVofficeDocxFile(this.transCode , this.index).subscribe(res => {
                        this.url = URL.createObjectURL(res);
                    });
                } else if(this.file.fileName.includes('.xlsx')) {
                    const self = this;
                    this.formType = 2
                    this.signDocumentService.getVofficeFile(this.transCode , this.index)
                        .subscribe(res => {
                        this.url = URL.createObjectURL(res);
                        $(self.spreadsheet.nativeElement).kendoSpreadsheet({ rows: 12000, toolbar: false});
                        self.spreadSheetData = $(self.spreadsheet.nativeElement).getKendoSpreadsheet();
                        self.spreadSheetData.fromFile(res);
                    });
                } else if(this.file.fileName.includes('.pdf')) {
                    this.formType = 1
                    this.signDocumentService.getVofficeFile(this.transCode , this.index).subscribe(res => {
                        this.url = URL.createObjectURL(res);
                    });
                } else {
                    this.downloadFile()
                }
            }
        } else if(this.id) {
            if (item.fileName.includes(".pdf")) {
                this.signDocumentService.preview2(this.id, item.id).subscribe(res => {
                    this.url = URL.createObjectURL(res);
                });
            } else {
                this.fileStorage.downloadFile(item.secretId).subscribe(res => {
                    saveAs(res, item.fileName);
                });
            }
        }
    }
    downloadFile() {
        this.signDocumentService.getVofficeFile(this.transCode , this.index).subscribe(res => {
            saveAs(res, this.file.fileName);
        });
    }
}