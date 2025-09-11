import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM } from '@app/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportDynamicService } from '../report-dynamic.service';

declare var $: any;

@Component({
  selector: 'report-dynamic-viewer',
  templateUrl: './report-dynamic-viewer.component.html',
  styleUrls: ['./report-dynamic-viewer.component.css'],
})
export class ReportDynamicViewerComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('spreadsheet')
  public spreadsheet: ElementRef;
  formValue: any;
  nameExport: any;
  formType = 0; //1: excel; 2: word; 3: pdf
  urlPdf = '';
  urlWord = '';
  urlExcel = '';
  innerHtmlDocx = '';
  spreadSheetData: any;
  urlSpecial: any;

  constructor(public actr: ActivatedRoute
    , public activeModal: NgbActiveModal
    , public reportDynamicService: ReportDynamicService
    , private app: AppComponent) {
    super(actr, CommonUtils.getPermissionCode("resource.reportDynamic"), ACTION_FORM.VIEW);
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.preparePreview();
  }

  get f() {
    return this.formSearch.controls;
  }

  preparePreview() {
    if (this.urlSpecial === null) {
      this.loadData();
    } else {
      this.loadDataSpecial();
    }
  }

  loadDataSpecial() {
    const self = this;
    const reqData = this.formValue;
    this.app.isProcessing(true);
    this.reportDynamicService.exportSpecial(reqData, this.urlSpecial)
      .subscribe((res) => {
        this.app.isProcessing(false);
        if (res.type === 'application/json') {
          const reader = new FileReader();
          reader.addEventListener('loadend', (e) => {
            const text = e.srcElement['result'];
            const json = JSON.parse(text);
            this.reportDynamicService.processReturnMessage(json);
          });
          reader.readAsText(res);
        } else {
          var nameFile = self.formValue.reportName;
          var extension = "";
          if (res.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            this.formType = 1;
            extension = ".xlsx";
            this.urlExcel = URL.createObjectURL(res);
            $(self.spreadsheet.nativeElement).kendoSpreadsheet({ rows: 12000 });
            self.spreadSheetData = $(self.spreadsheet.nativeElement).getKendoSpreadsheet();
            self.spreadSheetData.fromFile(res);
          } else if (res.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            this.formType = 2;
            this.urlWord = URL.createObjectURL(res);
            this.reportDynamicService.convertDocxToPDF(res).subscribe((response) => {
              if (response) {
                self.urlPdf = URL.createObjectURL(response);
              }
            })
            extension = ".docx";
          } else {
            this.formType = 3;
            this.urlPdf = URL.createObjectURL(res);
            extension = ".pdf";
          }
          this.nameExport = nameFile;
        }
      });
  }

  private loadData() {
    const self = this;
    let reqData = this.formValue;
    this.app.isProcessing(true);
    this.reportDynamicService.export(reqData)
      .subscribe((res) => {
        this.app.isProcessing(false);
        if (res.type === 'application/json') {
          const reader = new FileReader();
          reader.addEventListener('loadend', (e) => {
            const text = e.srcElement['result'];
            const json = JSON.parse(text);
            this.reportDynamicService.processReturnMessage(json);
          });
          reader.readAsText(res);
        } else {
          var nameFile = self.formValue.reportName;
          var extension = "";
          if (res.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            this.formType = 1;
            extension = ".xlsx";
            this.urlExcel = URL.createObjectURL(res);
            $(self.spreadsheet.nativeElement).kendoSpreadsheet({ rows: 12000 });
            self.spreadSheetData = $(self.spreadsheet.nativeElement).getKendoSpreadsheet();
            self.spreadSheetData.fromFile(res);
          } else if (res.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            this.formType = 2;
            this.urlWord = URL.createObjectURL(res);
            this.reportDynamicService.convertDocxToPDF(res).subscribe((response) => {
              if (response) {
                self.urlPdf = URL.createObjectURL(response);
              }
            });
            extension = ".docx";
          } else {
            this.formType = 3;
            this.urlPdf = URL.createObjectURL(res);
            extension = ".pdf";
          }
          this.nameExport = nameFile;
        }
      });
  }

  exportReport() {
    if (this.formType == 1) {
      saveAs(this.urlExcel, this.nameExport);
    } else if (this.formType == 2) {
      saveAs(this.urlWord, this.nameExport);
    } else {
      saveAs(this.urlPdf, this.nameExport);
    }
  }

  setData(data) {
    this.urlSpecial = data;
  }

  setFormValue(value) {
    this.formValue = value;
  }
}