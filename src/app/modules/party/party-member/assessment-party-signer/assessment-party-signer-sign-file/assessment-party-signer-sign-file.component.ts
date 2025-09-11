import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "@app/shared/components/base-component/base-component.component";
import { FileStorageService } from "@app/core/services/file-storage.service";
import { AssessmentPartySignerService } from "@app/core/services/assessment-party-signer/assessment-party-signer.service";

@Component({
  selector: "assessment-party-signer-sign-file",
  templateUrl: "./assessment-party-signer-sign-file.component.html"
})
export class AssessmentPartySignerSignFileComponent extends BaseComponent implements OnInit {
  data: any;
  dataTotal: any[] = [];
  recordsTotal: any;
  resultList: any;
  @ViewChild('ptable') dataTable: any;
  @Input() public assessmentPartySignerId;

  title: string;
  documentStatus: any;
  transCode: string;
  constructor(
    public activeModal: NgbActiveModal,
    private fileStorage: FileStorageService,
    private assessmentPartySignerService: AssessmentPartySignerService,
  ) {
    super();
  }

  
  ngOnInit() {
    this.setData();
  }

  public downloadFile(fileData) {
    if ((this.documentStatus == 3 || this.documentStatus == 5) && fileData.fileType == 'fileSign') {
      this.assessmentPartySignerService.downloadFile(this.transCode).subscribe(res => {
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

  public setData() {
    if (this.assessmentPartySignerId > 0) {
      this.assessmentPartySignerService.getSignFileInformation(this.assessmentPartySignerId).subscribe(
        res => {
          if (res.data) {
            this.title = res.data.assessmentPeriodName + '_';
            this.documentStatus = res.data.statusDoc;
            this.transCode = res.data.transCode;
            this.dataTotal = [];
            Object.keys(res.data.fileAttachment).map(key => {
              res.data.fileAttachment[key].forEach(file => {
                file.fileType = key;
                this.dataTotal.push(file);
              });
            })
            this.data = this.dataTotal.slice(0, 10);
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
