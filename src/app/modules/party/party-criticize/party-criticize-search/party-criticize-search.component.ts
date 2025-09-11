import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_CONSTANTS, DEFAULT_MODAL_OPTIONS } from '@app/core/app-config';
import { PartyCriticizeService } from '@app/core/services/party-organization/party-criticize.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PartyCriticizeFormComponent } from './../party-criticize-form/party-criticize-form.component';

@Component({
  selector: 'party-criticize-search',
  templateUrl: './party-criticize-search.component.html'
})
export class PartyCriticizeSearchComponent extends BaseComponent implements OnInit {

  formConfig = {
    partyOrganizationId: [''],
    year: [''],
    criticizeType: ['']
  };
  public listYear: any;
  public listCriticizeType = APP_CONSTANTS.CRITICIZE_TYPE;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private partyCriticizeService: PartyCriticizeService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyCriticize"));
    this.setMainService(partyCriticizeService);
    this.listYear = this.getYearList();
    this.formSearch = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
    this.processSearch();
  }

  get f() {
    return this.formSearch.controls;
  }

  private getYearList() {
    this.listYear = [];
    const currentYear = new Date().getFullYear();
    for (let i = (currentYear - 50); i <= (currentYear + 10); i++) {
      const obj = {
        year: i
      };
      this.listYear.push(obj);
    }
    return this.listYear;
  }

  /**
   * Import
   */
  public import() {
    this.router.navigate(['/party-organization/criticize-import']);
  }


  /**
   * Export
   */
  public processExportListPartyCriticize() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const formData = Object.assign({}, this.formSearch.value);
    const params = CommonUtils.buildParams(CommonUtils.convertData(formData));
    this.partyCriticizeService.exportListPartyCriticize(params).subscribe(res => {
      saveAs(res, 'danh_sach_phe_binh_Dang.xlsx');
    });
  }

  /**
   * prepareUpdate
   * param item
   */
  prepareSaveOrUpdate(item?: any) {
    if (item && item.partyCriticizeId > 0) {
      this.partyCriticizeService.findOne(item.partyCriticizeId)
        .subscribe(res => {
          if (res.data) {
            this.activeModal(res.data);
          }
        });
    } else {
      this.activeModal();
    }
  }

  /**
   * Show modal
   * data
   */
  private activeModal(data?: any) {
    const modalRef = this.modalService.open(PartyCriticizeFormComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.partyCriticizeService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }
}
