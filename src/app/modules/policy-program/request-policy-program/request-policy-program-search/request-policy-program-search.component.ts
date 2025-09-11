import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS } from '@app/core';
import { RequestPolicyProgramService } from '@app/core/services/policy-program/request-democratic-meeting.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { RequestDemocraticMeetingManageComponent } from '@app/modules/population/request-democratic-meeting-manage/request-democratic-meeting-manage.component';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'request-policy-program-search',
  templateUrl: './request-policy-program-search.component.html',
})
export class RequestPolicyProgramSearchComponent extends BaseComponent implements OnInit {
  policyProgramTypeList: [];
  formSearch: FormGroup;
  formConfig = {
    requestMonth: [''],
    policyProgramType: [''],
    name: ['', [Validators.maxLength(200)]],
    requestDateFromDate: [''],
    requestDateToDate: [''],
    finishDateFromDate: [''],
    finishDateToDate: [''],
  };

  constructor(
    public actr: ActivatedRoute
    , private requestPolicyProgramService: RequestPolicyProgramService
    , private modalService: NgbModal
    , private router: Router,
    private app: AppComponent,
    private categoryService: CategoryService) {
    super(null, CommonUtils.getPermissionCode("resource.requestPolicyProgram"));
    this.setMainService(requestPolicyProgramService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('requestDateFromDate', 'requestDateToDate', 'app.responseResolutionMonth.requestDateToDate'),
      ValidationService.notAffter('finishDateFromDate', 'finishDateToDate', 'app.responseResolutionMonth.finishDateToDate')]);
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.LOAI_CHINH_SACH).subscribe(res => {
      this.policyProgramTypeList = res.data;
    });
  }

  ngOnInit() {
    this.processSearch();
  }

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.requestPolicyProgramId > 0) {
      this.requestPolicyProgramService.findOne(item.requestPolicyProgramId).subscribe(res => {
        if (res.data != null) {
          if (res.data.status === 2) {
            this.app.warningMessage('requestPolicyProgram.requested');
          } else {
            this.router.navigate(['/policy-program/request-policy-program-edit/', item.requestPolicyProgramId]);
          }
        }
      })
    } else {
      this.router.navigate(['/policy-program/request-policy-program-add']);
    }
    this.processSearch();
  }

  /**
   * View
   * @param item 
   */
  public view(item?: any) {
    if (item && item.requestPolicyProgramId > 0) {
      this.requestPolicyProgramService.findOne(item.requestPolicyProgramId).subscribe(res => {
        if (res.data != null) {
          this.router.navigate(['/policy-program/request-policy-program-view/', item.requestPolicyProgramId]);
        }
      })
    }
    this.processSearch();
  }

  sendRequest(item?: any) {
    if (item && item.requestPolicyProgramId > 0) {
      this.app.confirmSendReqest(null, () => {// on accepted
        this.requestPolicyProgramService.sendRequest({ requestPolicyProgramId: item.requestPolicyProgramId })
          .subscribe(res => {
            if (this.requestPolicyProgramService.requestIsSuccess(res)) {
              this.processSearch();
            }
          });
      }, () => {// on rejected
      });
    }
  }

  delete(item?: any) {
    if (item && item.requestPolicyProgramId > 0) {
      this.app.confirmDelete('common.message.confirm.responsePolicyProgram.recalled', () => {// on accepted
        this.requestPolicyProgramService.deleteById(item.requestPolicyProgramId)
          .subscribe(res => {
            if (this.requestPolicyProgramService.requestIsSuccess(res)) {
              this.processSearch();
            }
          });
      }, () => {// on rejected
      });
    }
  }

  // mo pop-up quan ly
  preparePopManage(item) {
    this.actionActiveModal(item);
  }

  // action mo
  actionActiveModal(item) {
    const modalRef = this.modalService.open(RequestDemocraticMeetingManageComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.setManageForm(item.requestPolicyProgramId, item.organizationId);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.requestPolicyProgramService.requestIsSuccess(result)) {
        this.processSearch();
      }
    });
  }

  /**
   * Download file biểu mẫu
   */
  public prepareExport(item) {
    const requestPolicyProgramId = item.requestPolicyProgramId;
    if (requestPolicyProgramId > 0) {
      this.requestPolicyProgramService.processExportReport(requestPolicyProgramId).subscribe(res => {
        if (res.size > 0) {
          saveAs(res, 'ctct_Bao_cao_thuc_hien_yeu_cau_chinh_sach.xlsx');
        } else {
          this.app.warningMessage("requestHasRecalled");
          this.processSearch();
        }
      });
    }
  }

  /**
   * export man hinh search
   */
  public export() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.requestPolicyProgramService.export(params).subscribe(res => {
      saveAs(res, 'Danh_sach_yeu_cau_chuong_trinh_chinh_sach.xlsx');
    })
  }
}