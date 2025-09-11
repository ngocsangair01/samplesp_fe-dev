import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AssessmentEmployeeLevelService } from "@app/core/services/assessment-employee-level/assessment-employee-level.service";
import { AssessmentResultService } from "@app/core/services/employee/assessment-result.service";
import { BaseComponent } from "@app/shared/components/base-component/base-component.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslationService } from "angular-l10n";

declare var $: any;
@Component({
    selector: 'assessment-sign-preview-modal',
    templateUrl: './assessment-sign-preview-modal.component.html'
})
export class AssessmentSignPreviewModalComponent extends BaseComponent implements OnInit {
    @ViewChild('spreadsheet')
    public spreadsheet: ElementRef;
    @Input() public evaluateEmployeeData;
    formType = 1;
    files = [];
    file = null;
    url = '';
    showAction = true;
    constructor(
        public activeModal: NgbActiveModal,
        private assessmentEmployeeLevelService: AssessmentEmployeeLevelService,
        public translation: TranslationService,
        public assessmentResultService: AssessmentResultService,
        public router: Router
    ) {
        super();
    }

    ngOnInit() {
        this.getFile();
        console.log("window", window)
    }

    getFile() {
        let param = {
            assessmentPeriodId: this.evaluateEmployeeData['assessmentPeriodId'],
            employeeId: this.evaluateEmployeeData['employeeId'],
            assessmentOrder: this.evaluateEmployeeData['evaluatingLevel']
        }
        this.assessmentEmployeeLevelService.viewListFileAssessmentLevel(param).subscribe(res => {
            if (res.data && res.data.length > 0) {
                this.files = res.data;
            }
        });
    }

    preview(item: any, index: number) {
        this.url = null;
        this.file = item;
        let param = {
            assessmentPeriodId: this.evaluateEmployeeData['assessmentPeriodId'],
            employeeId: this.evaluateEmployeeData['employeeId'],
            assessmentOrder: this.evaluateEmployeeData['evaluatingLevel'],
            fileIndex: index,
        }
        if (item.fileName.includes(".pdf")) {
            this.assessmentEmployeeLevelService.exportFile(param).subscribe(res => {
                    this.url = window.URL.createObjectURL(res);
            });
        }
    }

    /**
     * Hàm dowload file báo cáo
     */
    downloadFile() {
        saveAs(this.url, this.file.fileName)
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
