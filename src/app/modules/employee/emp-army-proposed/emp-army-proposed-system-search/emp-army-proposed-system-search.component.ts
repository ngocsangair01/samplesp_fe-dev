import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DEFAULT_MODAL_OPTIONS, SMALL_MODAL_OPTIONS } from '@app/core/app-config';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { HelperService } from '@app/shared/services/helper.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { EmpArmyProposedAddComponent } from '../emp-army-proposed-add/emp-army-proposed-add.component';
import { EmpArmyProposedAdditionalComponent } from '../emp-army-proposed-additional/emp-army-proposed-additional.component';
import { EmpArmyProposedService } from '@app/core/services/employee/emp-army-proposed.service';
import { EmpTypesService } from '@app/core/services/emp-type.service';
import { TranslationService } from 'angular-l10n';
import { EmpArmyProposedReportService } from '@app/core/services/employee/emp-army-proposed-report.service';
import { EmpArmyProposedExportComponent } from '../emp-army-proposed-export/emp-army-proposed-export.component';

@Component({
  selector: 'emp-army-proposed-system-search',
  templateUrl: './emp-army-proposed-system-search.component.html',
  styleUrls: ['./emp-army-proposed-system-search.component.css']
})
export class EmpArmyProposedSystemSearchComponent extends BaseComponent implements OnInit {
  year: number;
  formSearch: FormGroup;
  listType = [];
  listStatus = [];
  listYear = [];
  listEmpType = [];
  listSoldierLevel = [];
  link: any;
  isMobileScreen: boolean = false;
  
  formConfig = {
    organizationId: ['', ValidationService.required],
    year: [''],
    type: [''],
    status: [''],
    employeeCode: [''],
    fullName: [''],
    listEmpTypesId: [],
    listSoldierLevelsId: [],
    isOrganizationId: [false],
    isYear: [false],
    isType: [false],
    isStatus: [false],
    isEmployeeCode: [false],
    isFullName: [false],
    isListEmpTypesId: [false],
    isListSoliderLevelsId: [false],
  }
  constructor(
    private router: Router,
    private helperService: HelperService,
    private empArmyProposedService: EmpArmyProposedService,
    private empArmyProposedReportService: EmpArmyProposedReportService,
    private app: AppComponent,
    public modalService: NgbModal,
    private empTypeService: EmpTypesService,
    public translation: TranslationService
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

    this.empTypeService.getAllByEmpTypeByIsUsed().subscribe(res => {
      this.listEmpType = res.data;
    });

    this.empArmyProposedService.getSoldierLevel().subscribe(res => {
      this.listSoldierLevel = res.data;
    })
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
    this.empArmyProposedService.systemSearch(params, event).subscribe(res => {
      res.data.forEach(el => {
        this.listType.forEach(e => {
          if (el.typeOrg == e.parValue) {
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

  public processSign(event?) : void {
    const yearValue = this.formSearch.get('year').value;
    this.formSearch.removeControl('year');
    const yearControl = new FormControl(yearValue, [ValidationService.required]);
    this.formSearch.addControl('year', yearControl);

    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }

    const params = this.formSearch ? this.formSearch.value : null;
    this.empArmyProposedService.processSign(params, event).subscribe(res => {
      if (res.data.signDocumentId > 0) {
        this.router.navigate(["/voffice-signing/emp-army-proposed/", res.data.signDocumentId]);
      }
    });
      
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

  prepareSaveAll() {
    let validate = false;
    this.resultList.data.forEach(item => {
      if (item.typeOrg === 0 && CommonUtils.isNullOrEmpty(item.noteOrg)) {
        validate = true;
        item.check = true;
        setTimeout(() => {
          item.check = false;
        }, 3000);
      }

      if (!CommonUtils.isNullOrEmpty(item.orderNumber) && this.isInteger(item.orderNumber)) {
        validate = true;
        item.isNotInteger = true;
        setTimeout(() => {
          item.isNotInteger = false;
        }, 3000);
      }
    });
    if (validate) {
      return;
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
   * organizationEvaluate
   * @param item 
   */
  public organizationEvaluate(item) {
    this.empArmyProposedService.findOne(item.empArmyProposedId)
      .subscribe(res => {
        this.activeModalUpdate(res.data, true);
      });
  }

  public reEvaluate(item) {
    if (item && item.empArmyProposedId > 0) {
      this.app.confirmMessage("empArmyProposed.confirm.reEvaluate", () => {// on accepted
        this.empArmyProposedService.reEvaluate(item.empArmyProposedId)
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

  checkReEvaluate(item) {
    let isDisabled = true;
    if (item.status == 4) {
      isDisabled = false;
    }
    return isDisabled;
  }

  /**
   * unitEvaluate
   * @param item 
   */
  public unitEvaluate(item) {
    const isEvaluating = false;
    const isDetail = true;
    this.empArmyProposedService.findOne(item.empArmyProposedId)
      .subscribe(res => {
        this.activeModalUpdate(res.data, true);
      });
  }

  /**
   * show model
   * data
   */
  private activeModalUpdate(data?: any, isCoQuanCtri?: boolean) {
    const modalRef = this.modalService.open(EmpArmyProposedAddComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(data, isCoQuanCtri);
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

  changeType(item) {
    item.typeOrg = parseInt(item.typeObject.parValue);
  }

  /**
   * validate integer
   */
   public isInteger(input): any {
    return (input.toString().match(/^[\-\+]?\d+$/)) ? '' : { integer: true };
  } 
  
  exportTemplateByEmpId(type?: string, employeeId?: any, createdTime?: any) {
    const url = `${this.empArmyProposedReportService.serviceUrl}/appendix`;
    const params = this.formSearch ? this.formSearch.value : null;
    const formData = CommonUtils.convertData(Object.assign({}, params));
    formData.employeeId = employeeId;
    formData.typeReport = type;
    formData.reportForm = 'PHU_LUC_CO_QUAN_CTRI';
    formData.createdTime = createdTime;
    if(type == 'pdf'){
      this.empArmyProposedReportService.postRequestFile(url,formData).subscribe(res => {
        saveAs(res, 'Phu luc.pdf');
      });
    } else {
      this.empArmyProposedReportService.postRequestFile(url,formData).subscribe(res => {
        saveAs(res, 'Phu luc.docx');
      });
    }
  }

  exportTemplate() {
    const modalRef = this.modalService.open(EmpArmyProposedExportComponent, SMALL_MODAL_OPTIONS);
    modalRef.componentInstance.formSearch = this.formSearch;
    modalRef.componentInstance.reportForm = 'PHU_LUC_CO_QUAN_CTRI';
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
}
