import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, DEFAULT_MODAL_OPTIONS } from '@app/core';
import { RequestDemocraticMeetingService } from '@app/core/services/population/request-democratic-meeting.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestDemocraticMeetingManageComponent } from '../../request-democratic-meeting-manage/request-democratic-meeting-manage.component';

@Component({
  selector: 'request-democratic-meeting-search',
  templateUrl: './request-democratic-meeting-search.component.html',
  styleUrls: ['./request-democratic-meeting-search.component.css'],
})
export class RequestDemocraticMeetingSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  formConfig = {
    requestMonth: [''],
    name: ['', [Validators.maxLength(200)]],
    requestDate: [''],
    finishDate: [''],
    isRequestMonth: [false],
    isName: [false],
    isRequestDate: [false],
    isFinishDate: [false],
  };

  constructor(
    public actr: ActivatedRoute
    , private requestDemocraticMeetingService: RequestDemocraticMeetingService
    , private modalService: NgbModal
    , private router: Router,
    private app: AppComponent) {
    super(null, CommonUtils.getPermissionCode("resource.requestDemocraticMeeting"));
    this.setMainService(requestDemocraticMeetingService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('requestDate', 'finishDate', 'app.responseResolutionMonth.finishDateToDate')]);

  }

  ngOnInit() {
    this.processSearch();
  }

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.requestDemocraticMeetingId > 0) {
      this.router.navigate(['/population/request-democratic-meeting-edit/', item.requestDemocraticMeetingId]);
    } else {
      this.router.navigate(['/population/request-democratic-meeting-add']);
    }
  }

  /**
   * View
   * @param item 
   */
  public view(item?: any) {
    if (item && item.requestDemocraticMeetingId > 0) {
      this.router.navigate(['/population/request-democratic-meeting-view/', item.requestDemocraticMeetingId]);
    }
  }

  sendRequest(item?: any) {
    if (item && item.requestDemocraticMeetingId > 0) {
      this.app.confirmSendReqest(null, () => {// on accepted
        this.requestDemocraticMeetingService.sendRequest({ requestDemocraticMeetingId: item.requestDemocraticMeetingId })
          .subscribe(res => {
            if (this.requestDemocraticMeetingService.requestIsSuccess(res)) {
              this.processSearch();
            }
          });
      }, () => {// on rejected
      });
    }
  }

  delete(item?: any) {
    if (item && item.requestDemocraticMeetingId > 0) {
      this.app.confirmDelete('common.message.confirm.recalled', () => {// on accepted
        this.requestDemocraticMeetingService.deleteById(item.requestDemocraticMeetingId)
          .subscribe(res => {
            if (this.requestDemocraticMeetingService.requestIsSuccess(res)) {
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
    modalRef.componentInstance.setManageForm(item.requestDemocraticMeetingId, item.organizationId);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.requestDemocraticMeetingService.requestIsSuccess(result)) {
        this.processSearch();
      }
    });
  }
}
