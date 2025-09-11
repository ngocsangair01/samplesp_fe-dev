import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ACTION_FORM, DEFAULT_MODAL_OPTIONS } from '@app/core';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { RequestResolutionMonthService } from '@app/core/services/party-organization/request-resolution-month.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'request-resolutions-month-detail',
  templateUrl: './request-resolutions-month-detail.component.html',
  styleUrls: ['./request-resolutions-month-detail.component.css']
})
export class RequestResolutionMonthDetailComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  formConfig = {
    requestMonth: [''],
    name: ['', [Validators.maxLength(200)]],
    requestedDateFrom: [''],
    requestedDateTo: [''],
    partyOrganizationId: [''],
    requestedPeriod: [0],
    requestedLevel: [0],
  };

  // id yeu cau ra nghi quyet
  @Input()
  public requestId: number;

  constructor(
    public actr: ActivatedRoute
    , private requestResolutionMonthService: RequestResolutionMonthService) {
    super(null, CommonUtils.getPermissionCode("resource.requestResolutionMonth"));
    this.setMainService(requestResolutionMonthService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('requestedDateFrom', 'requestedDateTo', 'app.responseResolutionMonth.requestDateToDate')]);
  }

  ngOnInit() {
    this.processSearch();
  }

  get f() {
    return this.formSearch.controls;
  }

  /**
   * 
   * @param event Hàm lấy thông tin danh sách đơn vị theo yêu cầu
   */
  public processSearch(event?): void {
    this.requestResolutionMonthService.searchDetailList({requestResolutionsMonthId: this.requestId}, event).subscribe(res => {
      this.resultList = res;
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  /**
   * Hàm lấy tên theo tiêu chuẩn
  */
  getFirstPartEmail(item: any){
    let empName = item.massOrganizationEmployee ? item.massOrganizationEmployee : "";
    if(item.email){
      empName += '(' + item.email.substring(0, item.email.lastIndexOf("@")) + ')';
    } 
    return empName;
  }

}