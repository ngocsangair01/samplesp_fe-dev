import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AssessmentEmployeeLevelService } from "@app/core/services/assessment-employee-level/assessment-employee-level.service";
import { AssessmentResultService } from "@app/core/services/employee/assessment-result.service";
import { FileStorageService } from "@app/core/services/file-storage.service";
import { SignDocumentService } from "@app/core/services/sign-document/sign-document.service";
import { BaseComponent } from "@app/shared/components/base-component/base-component.component";
import { CommonUtils } from "@app/shared/services";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslationService } from "angular-l10n";
import { ConfirmationService } from "primeng/api";

declare var $: any;
@Component({
    selector: 'assessment-sign-preview-modal2',
    templateUrl: './assessment-sign-preview-modal2.component.html'
})
export class AssessmentSignPreviewModalComponent2 extends BaseComponent implements OnInit {
    @ViewChild('spreadsheet')
    public spreadsheet: ElementRef;
    @Input() public evaluateEmployeeData;
    @Input() public id;
    @Input() public transCode;
    @Input() public dataFile;
    formType = 1;
    files = [];
    file = null;
    url = '';
    showAction = true;
    listFileSign = [];
    fileIndex = null;
    spreadSheetData: any;
    constructor(
        public activeModal: NgbActiveModal,
        private assessmentEmployeeLevelService: AssessmentEmployeeLevelService,
        private confirmationService: ConfirmationService,
        public translation: TranslationService,
        public assessmentResultService: AssessmentResultService,
        public router: Router,
        public signDocumentService: SignDocumentService,
        private fileStorage: FileStorageService
    ) {
        super();
    }

    ngOnInit() {
        this.getFile();
    }

    getFile() {
        if (this.transCode) {
            this.signDocumentService.getSignFile(this.transCode).subscribe(res => {
                if(res.data && res.data.length > 0) {
                    this.listFileSign = res.data
                    this.file = this.listFileSign[0];
                    this.preview(this.file ,0);
                }
            });
        }
    }

    preview(item: any, index: number) {
        if(this.transCode) {
            if(this.fileIndex != index) {
                this.fileIndex = index
                this.file = item;
                if(this.file.fileName.includes('.docx') || this.file.fileName.includes('.doc')) {
                    this.formType = 1
                    this.signDocumentService.getVofficeDocxFile(this.transCode , this.fileIndex).subscribe(res => {
                        this.url = URL.createObjectURL(res);
                    });
                } else if(this.file.fileName.includes('.xlsx')) {
                    const self = this;
                    this.formType = 2
                    this.signDocumentService.getVofficeFile(this.transCode , this.fileIndex)
                        .subscribe(res => {
                        this.url = URL.createObjectURL(res);
                        $(self.spreadsheet.nativeElement).kendoSpreadsheet({ rows: 12000, toolbar: false});
                        self.spreadSheetData = $(self.spreadsheet.nativeElement).getKendoSpreadsheet();
                        self.spreadSheetData.fromFile(res);
                    });
                } else if(this.file.fileName.includes('.pdf')) {
                    this.formType = 1
                    this.signDocumentService.getVofficeFile(this.transCode , this.fileIndex).subscribe(res => {
                        this.url = URL.createObjectURL(res);
                    });
                } else {
                    this.downloadFile()
                }
            } else if(this.id) {
                if (item.fileName.includes(".pdf")) {
                    this.signDocumentService.preview(this.id, item.id).subscribe(res => {
                        this.url = URL.createObjectURL(res);
                    });
                } else {
                    this.fileStorage.downloadFile(item.secretId).subscribe(res => {
                        saveAs(res, item.fileName);
                    });
                }
            }
        }
    }

    /**
     * Hàm dowload file báo cáo
     */
    downloadFile() {
        this.signDocumentService.getVofficeFile(this.transCode , this.fileIndex).subscribe(res => {
            saveAs(res, this.file.fileName);
        });
    }

    /**
   * choseSignImage
   */
    public choseSignImage() {
        this.evaluateEmployeeData['isDraft'] = false;
        this.assessmentResultService.saveOrUpdate(this.evaluateEmployeeData).subscribe(res => {
            if (this.assessmentResultService.requestIsSuccess(res)) {
                location.reload();
            }
        })
    }
}