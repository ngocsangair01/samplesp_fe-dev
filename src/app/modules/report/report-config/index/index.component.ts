import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { RequestReportService } from '@app/core';
import { Router } from '@angular/router';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AppComponent } from '@app/app.component';
import { DialogService } from 'primeng/api';
import {ReportConfigService} from "@app/core/services/report/report-config.service";
import {FileStorageService} from "@app/core/services/file-storage.service";
import {CommonUtils} from "../../../../shared/services";
@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent extends BaseComponent implements OnInit {
  isHidden: boolean = false;
  isMasO: boolean = false;
  isPartyO: boolean = false;
  isOrg: boolean = false;
  rewardType: any;
  branch: any;
  formConfig = {
    businessType: [null],
    code: [null],
    name: [null],
    validFromDate: [null],
    validToDate: [null],
    isCode: [false],
    isName: [false],
    isValidFromDate: [false],
    isValidToDate: [false],
    isBusinessType: [false]
  }
  businessTypeOptions
  typeOfReportOptions;
  isMobileScreen: boolean = false;
  tableColumnsConfig = [
    {
      header: "common.label.table.action",
      width: "50px"
    },
    {
      header: "common.table.index",
      width: "50px"
    },
    {
      name: "name",
      header: "label.reportConfig.name",
      width: "200px"
    },
    {
      name: "code",
      header: "label.reportConfig.code",
      width: "200px"
    },
    {
      name: "businessType",
      header: "label.reportConfig.businessType",
      width: "200px"
    },
    {
      name: "description",
      header: "label.reportConfig.description",
      width: "150px"
    },
    {
      name: "file",
      header: "label.reportConfig.Template",
      width: "200px"
    },
    {
      name: "validFromDate",
      header: "label.reportConfig.fromDate",
      width: "200px"
    },
    {
      name: "validToDate",
      header: "label.reportConfig.toDate",
      width: "200px"
    },
  ]

  constructor(
    private router: Router,
    private appParamService: AppParamService,
    private requestReportService: RequestReportService,
    private app: AppComponent,
    public dialogService: DialogService,
    private service: ReportConfigService,
    private fileStorage: FileStorageService,
  ) {
    super();
    this.setMainService(this.service);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    this.formSearch = this.buildForm('', this.formConfig);
    this.getDropDownOptions();
    this.search()
  }

  getDropDownOptions() {
    this.appParamService.appParams("TYPE_OF_REPORT").subscribe(
      res => {
        this.typeOfReportOptions = res.data;
      }
    )

    this.requestReportService.getBusinessType().subscribe(
      res => {
        this.businessTypeOptions = res.data;
      }
    )
  }

  navigateToCreatePage(rowData?) {
    this.router.navigateByUrl('/report/report-config/create-update', { state: rowData });
  }

  navigateToViewPage(rowData?) {
    this.router.navigateByUrl('/report/report-config/view', { state: rowData });
  }

  clonePopup(rowData?){
    if (CommonUtils.nvl(rowData.adReportTemplateId) > 0) {
      this.app.confirmMessage("common.message.confirm.clone", () => {// on accepted
        this.service.clone(rowData.adReportTemplateId)
            .subscribe(res => {
              if (this.service.requestIsSuccess(res)) {
                this.search(null);
              }
            });
      }, () => {// on rejected
      });
    }
  }

  search(event?) {
    this.service.search(this.formSearch.value, event).subscribe(res => {
      this.resultList = res;
    });
  }

  deleteReport(report) {
    this.app.confirmDelete(null,
      () => {
        this.service.deleteById(report.adReportTemplateId)
          .subscribe(res => {
              this.search();
          })
      },
      () => { }
    )
  }

  public downloadFile(fileData) {
    if(fileData){
      this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
        saveAs(res, fileData.fileName);
      });
    }
  }


}
