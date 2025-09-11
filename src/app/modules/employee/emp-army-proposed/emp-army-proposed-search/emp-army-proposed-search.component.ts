import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {
  DEFAULT_MODAL_OPTIONS,
  LARGE_MODAL_OPTIONS,
  SMALL_MODAL_OPTIONS
} from '@app/core/app-config';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { HelperService } from '@app/shared/services/helper.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { EmpArmyProposedAddComponent } from '../emp-army-proposed-add/emp-army-proposed-add.component';
import { EmpArmyProposedAdditionalComponent } from '../emp-army-proposed-additional/emp-army-proposed-additional.component';
import { OrgArmyProposedComponent } from '../org-army-proposed/org-army-proposed.component';
import { EmpArmyProposedService } from '@app/core/services/employee/emp-army-proposed.service';
import { EmpArmyProposedReportService } from '@app/core/services/employee/emp-army-proposed-report.service';
import { EmpArmyProposedExportComponent } from '../emp-army-proposed-export/emp-army-proposed-export.component';
import {DialogService} from "primeng/api";
import {
  empArmyProposedUpdateSignUnit
} from "@app/modules/employee/emp-army-proposed/emp-army-proposed-update-sign-unit/emp-army-proposed-update-sign-unit";
import {OrganizationService} from "@app/core";
import {
  VofficeSigningPreviewModalComponent
} from "@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component";

@Component({
  selector: 'emp-army-proposed-search',
  styleUrls: ['./emp-army-proposed-search.component.css'],
  templateUrl: './emp-army-proposed-search.component.html'
})
export class EmpArmyProposedSearchComponent extends BaseComponent implements OnInit {
  year: number;
  formSearch: FormGroup;
  listType = [];
  listStatus = [];
  listYear = [];
  link: any;
  isMobileScreen: boolean = false;
  formConfig = {
    organizationId: ['', ValidationService.required],
    year: [''],
    type: [''],
    status: [''],
    employeeCode: [''],
    fullName: [''],
    typeProposed: [''],
    isOrganizationId: [false],
    isYear: [false],
    isType: [false],
    isStatus: [false],
    isEmployeeCode: [false],
    isFullName: [false]
  }

  constructor(
    private router: Router,
    private helperService: HelperService,
    private empArmyProposedService: EmpArmyProposedService,
    private empArmyProposedReportService: EmpArmyProposedReportService,
    private app: AppComponent,
    public modalService: NgbModal,
    public dialogService: DialogService,
    private orgService: OrganizationService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.empArmyProposed"));
    this.formSearch = this.buildForm({}, this.formConfig);
    this.setMainService(empArmyProposedService);
    this.empArmyProposedService.getListType().subscribe(res => {
      this.listType = res.data;
    })
    this.empArmyProposedService.getListStatus().subscribe(res => {
      this.listStatus = res.data;
    })
    this.year = new Date().getFullYear();
    for (let i = this.year; i >= this.year - 5; i--) {
      this.listYear.push({ label: i, value: i });
    }
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  public processSearch(event?): void {
    const yearValue = this.formSearch.get('year').value;
    this.formSearch.removeControl('year');
    const yearControl = new FormControl(yearValue);
    this.formSearch.addControl('year', yearControl);

    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const params = this.formSearch ? this.formSearch.value : null;
    this.empArmyProposedService.search(params, event).subscribe(res => {
      res.data.forEach(el => {
        this.listType.forEach(e => {
          if (el.type == e.parValue) {
            el.typeObject = e;
          }
        })
      })
      this.resultList = res;
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  public processSign(event?): void {
    const yearValue = this.formSearch.get('year').value;
    this.formSearch.removeControl('year');
    const yearControl = new FormControl(yearValue, [ValidationService.required]);
    this.formSearch.addControl('year', yearControl);

    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }

    this.empArmyProposedService.checkSign(this.formSearch.get('organizationId').value).subscribe(res => {
      const params = this.formSearch ? this.formSearch.value : null;
      if (res.data > 0) {
        this.app.confirmMessage("label.empArmyProposed.confirmSign", () => {// on accepted
          params.isUpdateStatus = true;
          this.empArmyProposedService.processSign(params, event).subscribe(res => {
            if (res.data.signDocumentId > 0) {
              this.router.navigateByUrl('voffice-signing/emp-army-proposed/' + res.data.signDocumentId, { state: {backUrl:'employee/emp-army-proposed'} });
            }
          });
        }, () => {// on rejected

        });
      } else {
        this.empArmyProposedService.processSign(params, event).subscribe(res => {
          if (res.data.signDocumentId > 0) {
            this.router.navigateByUrl('voffice-signing/emp-army-proposed/' + res.data.signDocumentId, { state: {backUrl:'employee/emp-army-proposed'} });

          }
        });
      }
    })

  }

  ngOnInit() {
    this.formSearch.get('year').setValue(this.year);
    this.processSearch();
  }

  get f() {
    return this.formSearch.controls;
  }

  public additional() {
    this.activeModalAdditional();
  }

  private activeModalAdditional(data?: any) {
    const modalRef = this.modalService.open(EmpArmyProposedAdditionalComponent, SMALL_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.empArmyProposedService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

  public updateSignUnit(data?: any){
    this.activeModalUpdateSignUnit(data);
  }

  private activeModalUpdateSignUnit(data?: any) {
    if (data) {
      this.empArmyProposedService.findById(data.empArmyProposedId).subscribe(rec => {
        this.orgService.findData(rec.data.signOrganizationId).subscribe (res => {
          const ref = this.dialogService.open(empArmyProposedUpdateSignUnit, {
            header: 'CẬP NHẬT ĐƠN VỊ KÝ ĐỀ XUẤT',
            width: '50%',
            baseZIndex: 1000,
            contentStyle: {"padding": "0"},
            data: {
              idRecord: data.empArmyProposedId,
              organizationId: res.data.organizationId,
              organizationName: res.data.name
            }
          });
          ref.onClose.subscribe( (res) => {
            this.processSearch();
          })
        })
      })
    }
  }

  prepareSaveAll() {
    let validate = false;
    this.resultList.data.forEach(item => {
      if (item.type == 0 && CommonUtils.isNullOrEmpty(item.note)) {
        validate = true;
        item.check = true;
        setTimeout(() => {
          item.check = false;
        }, 3000);
      }
    });
    if (validate) {
      return
    } else {
      this.app.confirmMessage(null, () => {// on accepted
        this.empArmyProposedService.saveAll({ empArmyProposedList: this.resultList.data }).subscribe(res => {
          if (this.empArmyProposedService.requestIsSuccess(res)) {
            this.helperService.reloadHeaderNotification('complete');
            this.processSearch();
            if (this.dataTable) {
              this.dataTable.first = 0;
            }
          }
        });
      }, () => {// on rejected

      });
    }
  }

  /**
   * prepareUpdate
   * @param item
   */
  public prepareUpdate(item) {
    this.empArmyProposedService.findOne(item.empArmyProposedId)
      .subscribe(res => {
        this.activeModalUpdate(res.data);
      });
  }


  /**
   * show model
   * data
   */
  private activeModalUpdate(data?: any) {
    const modalRef = this.modalService.open(EmpArmyProposedAddComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(data, false);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.empArmyProposedService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

  prepareDelete(item) {
    if (item && item.empArmyProposedId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.empArmyProposedService.deleteById(item.empArmyProposedId)
          .subscribe(res => {
            if (this.empArmyProposedService.requestIsSuccess(res)) {
              this.helperService.reloadHeaderNotification('complete');
              this.processSearch();
              if (this.dataTable) {
                this.dataTable.first = 0;
              }
            }
          });
      }, () => {// on rejected

      });
    }
  }

  processLatch(item) {
    if (item && item.empArmyProposedId > 0) {
      this.app.confirmMessage(null, () => {// on accepted
        this.empArmyProposedService.processLatch(item.empArmyProposedId)
          .subscribe(res => {
            if (this.empArmyProposedService.requestIsSuccess(res)) {
              this.helperService.reloadHeaderNotification('complete');
              this.processSearch();
              if (this.dataTable) {
                this.dataTable.first = 0;
              }
            }
          });
      }, () => {// on rejected

      });
    }
  }

  cancelLatch(item) {
    if (item && item.empArmyProposedId > 0) {
      this.app.confirmMessage(null, () => {// on accepted
        this.empArmyProposedService.cancelLatch(item.empArmyProposedId)
          .subscribe(res => {
            if (this.empArmyProposedService.requestIsSuccess(res)) {
              this.helperService.reloadHeaderNotification('complete');
              this.processSearch();
              if (this.dataTable) {
                this.dataTable.first = 0;
              }
            }
          });
      }, () => {// on rejected

      });
    }
  }

  changeType(item) {
    item.type = parseInt(item.typeObject.parValue);
  }

  exportWrittenRequests() {
    const url = `${this.empArmyProposedReportService.serviceUrl}/document`;
    const params = this.formSearch ? this.formSearch.value : null;
    const formData = CommonUtils.convertData(Object.assign({}, params));
    const buildParams = CommonUtils.buildParams(formData);
    this.empArmyProposedReportService.getRequest(url, {params: buildParams, responseType: 'blob'}).subscribe(res => {
      saveAs(res, 'Cong van.zip');
    });
  }

  checkRemoved(item) {
    let isDisabled = true;
    if (item.status == 0 || item.status == 1 || item.status == 3) {
      isDisabled = false;
    }
    return isDisabled;
  }

  checkUpdate(item) {
    let isDisabled = true;
    if (item.status == 0 || item.status == 3 || item.status == 5) {
      isDisabled = false;
    }
    return isDisabled;
  }
  checkProcessLatch(item) {
    let isDisabled = true;
    if (item.status == 0 || item.status == 3 || item.status == 5) {
      isDisabled = false;
    }
    return isDisabled;
  }

  checkCancelLatch(item) {
    let isDisabled = true;
    if (item.status == 1) {
      isDisabled = false;
    }
    return isDisabled;
  }

  processLatchList() {
    const yearValue = this.formSearch.get('year').value;
    this.formSearch.removeControl('year');
    const yearControl = new FormControl(yearValue, [ValidationService.required]);
    this.formSearch.addControl('year', yearControl);

    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const params = this.formSearch ? this.formSearch.value : null;
    this.empArmyProposedService.processLatchList(params).subscribe(res => {
      if (this.empArmyProposedService.requestIsSuccess(res)) {
        this.helperService.reloadHeaderNotification('complete');
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

  cancelLatchList() {
    const yearValue = this.formSearch.get('year').value;
    this.formSearch.removeControl('year');
    const yearControl = new FormControl(yearValue, [ValidationService.required]);
    this.formSearch.addControl('year', yearControl);

    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const params = this.formSearch ? this.formSearch.value : null;
    this.empArmyProposedService.cancelLatchList(params).subscribe(res => {
      if (this.empArmyProposedService.requestIsSuccess(res)) {
        this.helperService.reloadHeaderNotification('complete');
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

  public activeModalOrgSign() {
    const yearValue = this.formSearch.get('year').value;
    this.formSearch.removeControl('year');
    const yearControl = new FormControl(yearValue, [ValidationService.required]);
    this.formSearch.addControl('year', yearControl);

    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }

    const modalRef = this.modalService.open(OrgArmyProposedComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.setFormValue(this.formSearch.value);

    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.empArmyProposedService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

  exportConfigTemplate() {
    const modalRef = this.modalService.open(EmpArmyProposedExportComponent, SMALL_MODAL_OPTIONS);
    modalRef.componentInstance.formSearch = this.formSearch;
    modalRef.componentInstance.reportForm = 'PHU_LUC_DON_VI';
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.empArmyProposedService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

  exportTemplate() {
    const url = `${this.empArmyProposedReportService.serviceUrl}/appendix`;
    const params = this.formSearch ? this.formSearch.value : null;
    const formData = CommonUtils.convertData(Object.assign({}, params));
    formData.reportForm = 'PHU_LUC_DON_VI';
    this.empArmyProposedReportService.postRequestFile(url,formData).subscribe(res => {
      saveAs(res, 'Phu luc.zip');
    });
  }

  exportTemplateByEmpId(type?: string, employeeId?: any, typeProposed?: string, createdTime?: any) {
    const url = `${this.empArmyProposedReportService.serviceUrl}/appendix`;
    const params = this.formSearch ? this.formSearch.value : null;
    const formData = CommonUtils.convertData(Object.assign({}, params));
    formData.employeeId = employeeId;
    formData.typeReport = type;
    formData.reportForm = 'PHU_LUC_DON_VI';
    formData.createdTime = createdTime;
    this.empArmyProposedService.checkTypeDownloadFile(formData).subscribe(res_type =>{
      if (res_type.type == "SUCCESS"){
        type = res_type.data.type
        this.empArmyProposedService.postRequestFile(url,formData).subscribe(res => {
          if(type == 'pdf'){
            saveAs(res,'Phu luc.pdf');
          }else if (type == 'docx'){
            saveAs(res, 'Phu luc.docx');
          }else if (type == 'xlsx'){
            saveAs(res, 'Phu luc.xlsx');
          }else{
            saveAs(res, 'Phu luc.zip');
          }
        });
      }
    });
  }
  previewFileSigning() {
    const yearValue = this.formSearch.get('year').value;
    // const params = this.formSearch ? this.formSearch.value : null;
    const organizationId = this.formSearch? this.formSearch.value.organizationId : null
    if(organizationId){
      this.empArmyProposedService.getDocumentSignID({organizationId, yearValue}).subscribe(res=>{
        const signDocumentId = res.data.signDocumentId

        const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent, LARGE_MODAL_OPTIONS);
        modalRef.componentInstance.id = signDocumentId;
      })
    }

  }
}
