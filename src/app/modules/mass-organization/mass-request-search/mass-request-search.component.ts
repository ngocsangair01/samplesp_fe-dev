import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, DEFAULT_MODAL_OPTIONS } from '@app/core';
import { MassRequestService } from '@app/core/services/mass-organization/mass-request.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MassRequestFormComponent } from '../mass-request-form/mass-request-form.component';
import { MassRequestManageComponent } from '../mass-request-manage/mass-request-manage.component';

@Component({
  selector: 'mass-request-search',
  templateUrl: './mass-request-search.component.html',
  styleUrls: ['./mass-request-search.component.css']
})
export class MassRequestSearchComponent extends BaseComponent implements OnInit {

  formSearch: FormGroup;
  formConfig = {
    massRequestId: [''],
    massOrganizationId: [''],
    branch: [''],
    status: ['0'],
    signVoffice: ['0'],
    description: [''],
    massRequestCode: ['', ValidationService.maxLength(50)],
    massRequestName: ['', ValidationService.maxLength(200)],
    finishStartDate: [''],
    finishEndDate: [''],
    isMassRequestId: [false],
    isMassOrganizationId: [false],
    isBranch: [false],
    isStatus: [false],
    isSignVoffice: [false],
    isDescription: [false],
    isMassRequestCode: [false],
    isMassRequestName: [false],
    isFinishStartDate: [false],
    isFinishEndDate: [false]
  };
  public branch: any;

  constructor(private router: Router,
    public actr: ActivatedRoute,
    private helperService: HelperService,
    private modalService: NgbModal,
    private massRequestService: MassRequestService,
    private app: AppComponent) {
    super(null, CommonUtils.getPermissionCode("resource.massRequestCriteria"));
    this.setMainService(massRequestService);
    this.buildForms({});

    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 2) {
      if (subPaths[2] === 'woman') {
        this.branch = 1;
      }
      if (subPaths[2] === 'youth') {
        this.branch = 2;
      }
      if (subPaths[2] === 'union') {
        this.branch = 3;
      }
    }
    this.formSearch.controls['branch'].setValue(this.branch);
    // tim kiem phuc vu cho slelect node tren tree
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.formSearch.controls['massOrganizationId'].setValue(`${params.id}`);
      } else {
        this.helperService.reloadTreeMass('complete');
      }
      this.helperService.resetMass();
      this.formSearch.controls['massOrganizationId'].setValue(null);
    });
    this.processSearch();
  }

  ngOnInit() {
  }

  public buildForms(data?: any) {
    this.formSearch = this.buildForm(data, this.formConfig, ACTION_FORM.VIEW, [ValidationService.notAffter('finishStartDate', 'finishEndDate', 'document.label.toDate')]);
  }

  get f() {
    return this.formSearch.controls;
  }

  /**
   * prepareUpdate
   * param item
   */
  prepareSaveOrUpdate(item?: any) {
    if (item && item.massRequestId > 0) {
      this.massRequestService.findOne(item.massRequestId)
        .subscribe(res => {
          if (this.massRequestService.requestIsSuccess(res)) {
            this.activeModal(res.data);
          }
        });
    } else {
      this.activeModal(this.branch);
    }
  }

  /**
   * show model
   * data
   */
  private activeModal(data?: any) {
    const modalRef = this.modalService.open(MassRequestFormComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.massRequestService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }


  preparePopManage(item) {
    this.actionActiveModal(item);
  }

  // action mo
  actionActiveModal(item) {
    const modalRef = this.modalService.open(MassRequestManageComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.setManageForm(item.massRequestId, item.organizationId);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
    });
  }

  /**
   * Lập cây tiêu chí
   * @param item 
   */
  public createMassCriteriaPlan(item) {
    if (!item) {
      return;
    }
    if (this.branch === 1) {
      this.router.navigate(['mass/woman/mass-request/create-plan', item.massRequestId]);
    } else if (this.branch === 2) {
      this.router.navigate(['mass/youth/mass-request/create-plan', item.massRequestId]);
    } else if (this.branch === 3) {
      this.router.navigate(['mass/union/mass-request/create-plan', item.massRequestId]);
    }
  }

  delete(item?: any) {
    if (item && item.massRequestId > 0) {
      this.app.confirmDelete('common.message.confirm.revoke', () => {// on accepted
        this.massRequestService.deleteById(item.massRequestId)
          .subscribe(res => {
            if (this.massRequestService.requestIsSuccess(res)) {
              this.processSearch();
            }
          });
      }, () => {// on rejected
      });
    }
  }

  /**
   * Ra yêu cầu nghị quyết
   * @param item 
   */
  public setRequest(item) {
    if (!item) {
      return;
    }
    this.app.confirmMessage('massRequest.confirmRequest', () => { // on accepted
      this.massRequestService.setRequest(item.massRequestId).subscribe(res => {
        if (this.massRequestService.requestIsSuccess(res)) {
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
   * Lập cây tiêu chí
   * @param item 
   */
  public viewDetail(item) {
    if (!item) {
      return;
    }
    if (this.branch === 1) {
      this.router.navigate(['mass/woman/mass-request/view-detail', item.massRequestId]);
    } else if (this.branch === 2) {
      this.router.navigate(['mass/youth/mass-request/view-detail', item.massRequestId]);
    } else if (this.branch === 3) {
      this.router.navigate(['mass/union/mass-request/view-detail', item.massRequestId]);
    }
  }
}
