import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS } from '@app/core';
import { KeyProjectService } from '@app/core/services/security/key-project.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KeyProjectConfirmComponent } from '../key-project-confirm/key-project-confirm.component';

@Component({
  selector: 'key-project-search',
  templateUrl: './key-project-search.component.html',
})
export class KeyProjectSearchComponent extends BaseComponent implements OnInit {
  @Input() warningType;
  formSearch: FormGroup;
  bo: any;
  listKeyProjectType: any;
  statusList: any;
  formconfig = {
    keyProjectId: [null],
    code: [null],
    name: [null],
    startDate: [null],
    endDate: [null],
    toStartDate: [null],
    toEndDate: [null],
    type: [null],
    organizationId: [null],
    status: [null],
    reason: [null],
  }

  constructor(
    public actr: ActivatedRoute,
    private keyProjectService: KeyProjectService,
    private router: Router,
    private modalService: NgbModal,
    private app: AppComponent,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.projectsForm"));
    this.setMainService(keyProjectService);
    this.listKeyProjectType = APP_CONSTANTS.KEY_PROJECT_TYPE;
    this.statusList = APP_CONSTANTS.KEY_PROJECT_STATUS_TYPE;
    this.formSearch = this.buildForm({}, this.formconfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('startDate', 'toStartDate', 'protectsecurity.mainproject.label.nbddn'),
      ValidationService.notAffter('endDate', 'toEndDate', 'protectsecurity.mainproject.label.nktdn')]);
  }

  ngOnInit() {
    this.setFormSearchValue(this.warningType);
    this.processSearch();
  }

  get f() {
    return this.formSearch.controls;
  }

  /**
   * prepareSaveOrUpdate
   */
  public prepareSaveOrUpdate(item?: any) {
    if (item && item.keyProjectId > 0) {
      this.keyProjectService.findOne(item.keyProjectId).subscribe(res => {
        if (res.data != null) {
          this.router.navigate(['/security-guard/key-project/edit/', item.keyProjectId]);
        }
      });
    } else {
      this.router.navigate(['/security-guard/key-project/add'])
    }
  }

  public processView(item, view) {
    if (view) {
      this.keyProjectService.findOne(item.keyProjectId)
        .subscribe(res => {
          if (res.data != null) {
            this.router.navigate(['/security-guard/key-project/view/', item.keyProjectId]);
          }
        });
    }
  }

  // Phê duyệt
  public actionApproved(item) {
    this.app.confirmMessage('protectsecurity.mainproject.confirmApproval', () => { // on accepted
      this.keyProjectService.approved({ keyProjectId: item.keyProjectId }).subscribe(res => {
        if (this.keyProjectService.requestIsSuccess(res)) {
          this.processSearch(null);
        }
      });
      // });
    }, () => {
      // on rejected
    });
  }

  // Từ chối
  public actionUnApproved(item) {
    if (!item) {
      return;
    }
    if (item.keyProjectId != null) {
      const modalRef = this.modalService.open(KeyProjectConfirmComponent, DEFAULT_MODAL_OPTIONS);
      modalRef.componentInstance.keyProjectId = item.keyProjectId;

      modalRef.result.then((result) => {
        if (!result) {
          return;
        }
        if (this.keyProjectService.requestIsSuccess(result)) {
          this.processSearch(this.keyProjectService.credentials._search);
          if (this.dataTable) {
            this.dataTable.first = 0;
          }
        }
      });
    }
  }

  // Hủy dự án
  // Từ chối
  public actionCancel(item) {
    this.app.confirmMessage('common.message.confirm.cancel', () => { // on accepted
      this.keyProjectService.cancel({ keyProjectId: item.keyProjectId }).subscribe(res => {
        if (this.keyProjectService.requestIsSuccess(res)) {
          this.processSearch(null);
        }
      });
      // });
    }, () => {
      // on rejected
    });
  }

  public processDelete(item) {
    if (item && item.keyProjectId > 0) {
      this.app.confirmDelete(null, () => { // accept
        this.keyProjectService.deleteById(item.keyProjectId)
          .subscribe(res => {
            if (this.keyProjectService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          })
      }, () => {
        // on rejected
      })
    }
  }

  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.keyProjectService.export(params).subscribe(res => {
      saveAs(res, 'Danh_sach_du_an_trong_diem.xlsx');
    });
  }

  setFormSearchValue(warningType) {
    if (warningType === 'totalKeyProject') {
      this.f['status'].setValue(2);
    }
  }
}