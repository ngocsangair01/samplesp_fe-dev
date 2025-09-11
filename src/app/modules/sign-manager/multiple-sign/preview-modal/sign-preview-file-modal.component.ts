import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FileStorageService } from "@app/core/services/file-storage.service";
import { SignDocumentService } from "@app/core/services/sign-document/sign-document.service";
import { BaseComponent } from "@app/shared/components/base-component/base-component.component";
import { CommonUtils } from "@app/shared/services";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ReportManagerService } from '@app/core/services/report/report-manager.service';
import { AssessmentEmployeeLevelService } from "@app/core/services/assessment-employee-level/assessment-employee-level.service";
declare var $: any;
@Component({
    selector: 'sign-preview-file-modal',
    templateUrl: './sign-preview-file-modal.component.html'
})
export class SignPreviewFileModalComponent extends BaseComponent implements OnInit {
    @ViewChild('spreadsheet')
    public spreadsheet: ElementRef;
    @Input() public assessmentEmployeeLevelIds = [];
    spreadSheetData: any;
    files = [];
    formType = 1;
    file = null;
    index = null;
    url = '';

    constructor(
        public activeModal: NgbActiveModal,
        private signDocumentService: SignDocumentService,
        private employeeLevelerServices : AssessmentEmployeeLevelService,
    ) {
        super();
    }

    ngOnInit() {
        this.getFile();
    }

    getFile() {
        if(this.assessmentEmployeeLevelIds) {
            this.employeeLevelerServices.getFile(this.assessmentEmployeeLevelIds).subscribe(res => {
                if (res.data && res.data.length > 0) {
                    this.files = res.data;
                    
                }
            });
        }
    }

    preview(item: any, index: number) {
        this.file = item;
        if(this.assessmentEmployeeLevelIds) {
            if (item.fileName.includes(".pdf")) {
                this.signDocumentService.preview(item.objectId, item.id).subscribe(res => {
                    this.url = URL.createObjectURL(res);
                });
            }
        }
    }

    /**
     * Hàm dowload file báo cáo
     */
     downloadFile() {
        saveAs(this.url, this.file.fileName)
    }

    /**
     * Hàm dowload all file
     */
     downloadAllFile() {
        let param = {
            assessmentEmployeeLevelIds: this.assessmentEmployeeLevelIds,
          }
        this.employeeLevelerServices.exportAllFile(param).subscribe(res => {
            saveAs(res, "file_tong_hop.pdf")
        })
    }
    /**
     * Hàm view all file
     */
    viewAllFile() {
        let param = {
            assessmentEmployeeLevelIds: this.assessmentEmployeeLevelIds,
          }
          this.employeeLevelerServices.exportAllFile(param).subscribe(res => {
            this.url = URL.createObjectURL(res);
        })
    }
}