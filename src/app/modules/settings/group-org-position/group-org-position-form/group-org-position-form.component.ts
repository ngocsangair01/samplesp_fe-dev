import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS } from '@app/core/app-config';
import { GroupOrgPositionService } from '@app/core/services/group-org-position/group-org-position.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { GeneralStandardPositionGroupService } from '@app/core/services/setting/general-standard_position_group.service';
import { PrivateStandardPositionGroupService } from '@app/core/services/setting/private-standard_position_group.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { ValidationService } from '@app/shared/services/validation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrivateStandardPositionGroupFormComponent } from '../private-standard-position-group-form/private-standard-position-group-form.component';

@Component({
  selector: 'group-org-position-form',
  templateUrl: './group-org-position-form.component.html',
  styleUrls: ['./group-org-position-form.component.css']
})

export class GroupOrgPositionFormComponent extends BaseComponent implements OnInit {
  privateResultList: any = {};
  credentials: any = {};
  groupList: any;
  formSave: FormGroup;
  groupOrgPositionId: any;
  partyTypeList: any;
  isEdit: boolean = false;
  isView: boolean = false;
  @ViewChild('ptable') dataTable: any;
  @ViewChild('ptablePrivate') dataPrivateTable: any;

  formConfig = {
    groupOrgPositionId: [''],
    groupId: [null, [ValidationService.required, ValidationService.maxLength(20)]],
    groupPositionId: [null],
    positionId: ['', [ValidationService.required, ValidationService.maxLength(20)]],
    organizationId: ['', [ValidationService.required, ValidationService.maxLength(20)]],
    effectiveDate: ['', [ValidationService.required]],
    expiredDate: [''],
    isApproved: ['', [ValidationService.required]],
  };

  constructor(
    private categoryService: CategoryService,
    private groupOrgPositionService: GroupOrgPositionService,
    public actr: ActivatedRoute,
    private router: Router,
    private generalStandardPositionGroupService: GeneralStandardPositionGroupService,
    private privateStandardPositionGroupService: PrivateStandardPositionGroupService,
    private modalService: NgbModal
  ) {
    super(null, CommonUtils.getPermissionCode("resource.groupOrgPosition"));
    this.buildForms({});
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.groupOrgPositionId = params.id;
        }
      }
    });
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.POSITION_GROUP).subscribe(res => {
      this.groupList = res.data;
    });

  }

  ngOnInit() {
    this.setFormValue(this.groupOrgPositionId);
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 2) {
      this.isView = subPaths[2] === 'group-org-position-view';
      this.isEdit = subPaths[2] === 'private-standard-edit';
    }
  }

  get f() {
    return this.formSave.controls;
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT,
      [ValidationService.notAffter('effectiveDate', 'expiredDate', 'partyPosition.label.expiredDate')]);
  }

  /**
   * setFormValue
   * param data
   */
  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.groupOrgPositionService.findOne(data)
        .subscribe(res => {
          this.buildForms(res.data);
          if (res.data.groupId != null) {
            this.processSearchGeneral();
          }
          if (this.groupOrgPositionId != null) {
            this.processSearchPrivateStandard();
          }
        })
    }
  }

  public goBack() {
    this.router.navigate(['/settings/group-org-position']);
  }

  public processSearchGeneral(event?): void {
    const groupId = this.formSave.get('groupId').value;
    if (groupId == null) {
      return;
    }
    this.formSave.get('groupPositionId').setValue(groupId);
    const params = this.formSave ? this.formSave.value : null;
    this.generalStandardPositionGroupService.searchgenaralStandard(params, event).subscribe(res => {
      this.resultList = res;
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  /**
   * tiêu chuẩn riêng grid
   * @param event 
   */
  public processSearchPrivateStandard(event?): void {
    const groupId = this.formSave.get('groupId').value;
    if (groupId == null) {
      return;
    }
    this.formSave.get('groupPositionId').setValue(groupId);
    const params = this.formSave ? this.formSave.value : null;
    this.privateStandardPositionGroupService.search(params, event).subscribe(res => {
      this.privateResultList = res;
    });
    if (!event) {
      if (this.dataPrivateTable) {
        this.dataPrivateTable.first = 0;
      }
    }
  }

  /**
   * show model
   * data
   */
  private activeModal(data?: any) {
    const modalRef = this.modalService.open(PrivateStandardPositionGroupFormComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.privateStandardPositionGroupService.requestIsSuccess(result)) {

        this.processSearchPrivateStandard();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

  /**
   * prepareUpdate
   * param item
   */
  prepareSaveOrUpdate(item) {
    if (item && item.privateStandardPositionGroupId > 0) {
      this.privateStandardPositionGroupService.findOne(item.privateStandardPositionGroupId)
        .subscribe(res => {
          this.activeModal(res.data);
        });
    } else {
      this.activeModal({ groupOrgPositionId: this.groupOrgPositionId });
    }
  }

  navigate() {
    this.router.navigate(['/settings/group-org-position-edit', this.groupOrgPositionId]);
  }
}