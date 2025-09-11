import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup } from '@angular/forms';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResolutionQuarterYearFormComponent } from '../resolution-quarter-year-form/resolution-quarter-year-form.component';
import { ACTION_FORM, DEFAULT_MODAL_OPTIONS } from '@app/core';
import { ResponseResolutionQuarterYearService } from '@app/core/services/party-organization/request-resolution-quarter-year.service';
import { AppComponent } from '@app/app.component';
import { ResolutionsQuarterYearManageComponent } from '../resolutions-quarter-year-manage/resolutions-quarter-year-manage.component';

@Component({
  selector: 'resolution-quarter-year-search',
  templateUrl: './resolution-quarter-year-search.component.html',
  styleUrls: ['./resolution-quarter-year-search.component.css']
})
export class ResolutionQuarterYearSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  isMobileScreen: boolean = false;
  formConfig = {
    organizationId: [''],
    status: ['0'],
    resolutionsNumber: ['', ValidationService.maxLength(100)],
    resolutionsName: ['', ValidationService.maxLength(200)],
    finishStartDate: [''],
    finishEndDate: [''],
    isOrganizationId: [false],
    isStatus: [false],
    isResolutionNumber: [false],
    isResolutionsName: [false],
    isFinishStartDate: [false],
    isFinishEndDate: [false]
  };

  constructor(public actr: ActivatedRoute
    , private modalService: NgbModal
    , private router: Router
    , private app: AppComponent
    , private responseResolutionQuarterYearService: ResponseResolutionQuarterYearService) {
    super(null, CommonUtils.getPermissionCode("resource.requestResolutionQuarterYear"));
    this.setMainService(responseResolutionQuarterYearService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('finishStartDate', 'finishEndDate', 'resolutionQuarterYear.validatefinishEndDate')]);
    this.processSearch();
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }

  /**
   * prepareUpdate
   * param item
   */
  prepareSaveOrUpdate(item?: any) {
    if (item && item.requestResolutionsId > 0) {
      this.responseResolutionQuarterYearService.findOne(item.requestResolutionsId)
        .subscribe(res => {
          this.activeModal(res.data);
        });
    } else {
      this.activeModal();
    }
  }

  /**
   * show model
   * data
   */
  private activeModal(data?: any) {
    const modalRef = this.modalService.open(ResolutionQuarterYearFormComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.responseResolutionQuarterYearService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

  /**
   * Lập cây tiêu chí
   * @param item 
   */
  public createCriteriaPlan(item) {
    if (!item) {
      return;
    }
    this.router.navigate(['/party-organization/resolution-quarter-year/cate-criteria/', item.requestResolutionsId, 'create-plan']);
  }

  /**
   * Ra yêu cầu nghị quyết
   * @param item 
   */
  public setRequest(item) {
    if (!item) {
      return;
    }
    this.app.confirmMessage('resolutionQuarterYear.confirmRequest', () => { // on accepted
      this.responseResolutionQuarterYearService.setRequest(item.requestResolutionsId).subscribe(res => {
        if (this.responseResolutionQuarterYearService.requestIsSuccess(res)) {
          this.processSearch();
          if (this.dataTable) {
            this.dataTable.first = 0;
          }
        }
      })
    }, () => {
      // on rejected   
    });
  }

  /**
   * Vào màn hình xem chi tiết các tiêu chí
   * @param item 
   */
  public viewDetail(item) {
    if (!item) {
      return;
    }
    this.router.navigate(['/party-organization/resolution-quarter-year/cate-criteria/', item.requestResolutionsId, 'view-detail']);
  }

  /**
   * Xử lý xóa nghị quyết và các tiêu chí đi kèm
   */
  public processDeleteResolution(item): void {
    if (item && item.requestResolutionsId > 0) {
      this.responseResolutionQuarterYearService.confirmDelete({
        messageCode: 'resolutionQuarterYear.confirmDelete',
        accept: () => {
          this.responseResolutionQuarterYearService.deleteById(item.requestResolutionsId)
            .subscribe(res => {
              if (this.responseResolutionQuarterYearService.requestIsSuccess(res)) {
                this.processSearch();
              }
            });
        }
      });
    }
  }

  preparePopManage(item) {
    this.actionActiveModal(item);
  }

  // action mo
  actionActiveModal(item) {
    const modalRef = this.modalService.open(ResolutionsQuarterYearManageComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.setManageForm(item.requestResolutionsId, item.organizationId);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
    });
  }
}
