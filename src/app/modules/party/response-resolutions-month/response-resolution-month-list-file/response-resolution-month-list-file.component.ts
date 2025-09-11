import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { ResponseResolutionMonthService } from '@app/core/services/party-organization/response-resolution-month.service';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { AssessmentResultService } from '@app/core/services/employee/assessment-result.service';

@Component({
  selector: 'response-resolution-month-list-file',
  templateUrl: './response-resolution-month-list-file.component.html',
})
export class ResponseResolutionMonthListFileComponent extends BaseComponent implements OnInit {
  data: any;
  dataTotal: any;
  recordsTotal: any;
  resultList: any;
  parseInt = parseInt;
  @ViewChild('ptable') dataTable: any;
  @Input() public responseResolutionsMonthId;

  title: any;
  transCode: any;
  documentStatus: any;
  formConfig = {
    fileName: [''],
    fileType: [''],
  };

  constructor(
    private responseResolutionMonthService: ResponseResolutionMonthService,
    public activeModal: NgbActiveModal,
    private fileStorage: FileStorageService,
    private assessmentResultService: AssessmentResultService
  ) {
    super();
  }

  ngOnInit() {
    // this.formConfig.transferPartyMemberId = this.transferPartyMemberId;
    // this.formSearch = this.buildForm(this.formConfig, { transferPartyMemberId: [''] });
    this.setData();
  }
  public downloadFile(fileData) {
    if ((this.documentStatus == 3 || this.documentStatus == 5) && this.transCode && fileData.fileType == 'File nghị quyết'){
      this.responseResolutionMonthService.downloadFile(this.transCode).subscribe(res => {
        saveAs(res, fileData.fileName);
      });
    } else {
      this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
        saveAs(res, fileData.fileName);
      });
    }
  }
  public processSearch(event){
    this.data = this.dataTotal.slice(event.first,event.first+5);
  }
  public setData(event?) {
    if (this.responseResolutionsMonthId > 0) {
      this.responseResolutionMonthService.findBeanById(this.responseResolutionsMonthId).subscribe(
        res => {
          if (res.data) {
            this.title = res.data.reqName + '_' + res.data.partyOrganizationName;
            this.documentStatus = res.data.documentStatus;
            this.transCode = res.data.transCode;
            const reportFile = res.data.fileAttachment.reportFile;
            const signFile = res.data.fileAttachment.signFile;
            if (reportFile && reportFile.length > 0) {
              reportFile.forEach(element => {
                element.fileType = 'File đính kèm biên bản'
              });
            }
            if (signFile && signFile.length > 0) {
              signFile.forEach(element => {
                element.fileType = 'File nghị quyết'
              });
            }
            this.dataTotal = (signFile).concat(reportFile);
            this.data = this.dataTotal.slice(0,10);
            this.recordsTotal = this.dataTotal.length;
          }
        }
      );
    }
    if (this.dataTable) {
      this.dataTable.first = 0;
    }
  }
}
