import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import {ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS} from '@app/core/app-config';
import { GroupOrgPositionService } from '@app/core/services/group-org-position/group-org-position.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { ValidationService } from '@app/shared/services/validation.service';
import {
  RewardSuggestImportManageComponent
} from "@app/modules/reward/reward-propose/reward-propose-form/file-import-reward-management/file-import-reward-management.component";
import {
  GroupOrgPositionImportComponent
} from "@app/modules/settings/group-org-position/group-org-position-search/file-import-group-org-position/file-import-group-org-position.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'group-org-position-search',
  templateUrl: './group-org-position-search.component.html',
  styleUrls: ['./group-org-position-search.component.css']
})
export class GroupOrgPositionSearchComponent extends BaseComponent implements OnInit {
  selectedGop: [];
  groupList: any;
  branchList: any;
  formSearch: FormGroup;
  status: any;
  formConfig = {
    groupOrgPositionId: [''],
    groupId: [''],
    positionId: [''],
    organizationId: [''],
    effectiveDate: [''],
    expiredDate: [''],
    isApproved: [0],
    isGroupId: [false],
    isCheckApproved: [false],
    isPositionId: [false],
    isOrganizationId: [false],
    isEffectiveDate: [false],
    isExpiredDate: [false]
  };


  constructor(
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private groupOrgPositionService: GroupOrgPositionService,
    private router: Router,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.groupOrgPosition"));
    this.setMainService(groupOrgPositionService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('effectiveDate', 'expiredDate', 'partyPosition.label.expiredDate')]);
    this.processSearchGroup();
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.POSITION_GROUP).subscribe(res => {
      this.groupList = res.data;
    });
  }

  ngOnInit() {

  }

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.groupOrgPositionId > 0) {
      this.groupOrgPositionService.findOne(item.groupOrgPositionId)
        .subscribe(res => {
          if (res.data != null) {
            this.router.navigate(['/settings/group-org-position-edit/', item.groupOrgPositionId]);
          }
        })
    }
    else {
      this.router.navigate(['/settings/group-org-position-add']);
    }
  }

  /**
   * Cap nhat tieu chuan rieng
   * @param item 
   */
  public preparePrivateStandard(item?: any) {
    if (item && item.groupOrgPositionId > 0) {
      this.groupOrgPositionService.findOne(item.groupOrgPositionId)
        .subscribe(res => {
          if (res.data != null) {
            this.router.navigate(['/settings/private-standard-edit/', item.groupOrgPositionId]);
          }
        });
    }
  }

  /**
   * Xem chi tiet
   * @param item 
   */
  public prepareView(item?: any) {
    if (item && item.groupOrgPositionId > 0) {
      this.groupOrgPositionService.findOne(item.groupOrgPositionId)
        .subscribe(res => {
          if (res.data != null) {
            this.router.navigate(['/settings/group-org-position-view/', item.groupOrgPositionId]);
          }
        });
    }
  }

  processDelete(item) {
    if (item && item.groupOrgPositionId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.groupOrgPositionService.deleteById(item.groupOrgPositionId)
          .subscribe(res => {
            if (this.groupOrgPositionService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected

      });
    }
  }

  export() {
    const reqData = this.formSearch.value;
    this.app.isProcessing(true);
    this.processSearch();
    this.groupOrgPositionService.export(reqData)
      .subscribe((res) => {
        this.app.isProcessing(false);
        if (res.type === 'application/json') {
          const reader = new FileReader();
          reader.addEventListener('loadend', (e) => {
            const text = e.srcElement['result'];
            const json = JSON.parse(text);
            this.groupOrgPositionService.processReturnMessage(json);
          });
          reader.readAsText(res);
        } else {
          saveAs(res, 'DANH_SACH_CHUC_DANH_THEO_DON_VI.xls');
        }
      });

  }

  public processSearchGroup(event?): void {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const params = this.formSearch ? this.formSearch.value : null;
    this.groupOrgPositionService.search(params, event).subscribe(res => {
      this.resultList = res;
      this.selectedGop = res.data.filter(gop => {
        return gop.isApproved == 1;
      });
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  public updateApproval() {
    this.app.confirmMessage('updateApproval.comfirm', () => {// on accepted
      let dataUpdate = [];
      this.resultList.data.forEach(gop => {
        dataUpdate.push({ groupOrgPositionId: gop.groupOrgPositionId });
      });
      dataUpdate.forEach(gop => {
        let isApproved = 2;
        this.selectedGop.forEach(item => {
          if (item['groupOrgPositionId'] == gop.groupOrgPositionId) {
            isApproved = 1;
          }
        });
        gop.isApproved = isApproved;
      });
      this.groupOrgPositionService.updateAppoval(dataUpdate).subscribe(res => {
        if (this.groupOrgPositionService.requestIsSuccess(res)) {
          this.processSearchGroup(null);
        }
      });
    }, () => {// on rejected
    });
  }
  public openFormImport() {
    const modalRef = this.modalService.open(GroupOrgPositionImportComponent, DEFAULT_MODAL_OPTIONS);
    const data = { };
    // modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
    });
  }
}
