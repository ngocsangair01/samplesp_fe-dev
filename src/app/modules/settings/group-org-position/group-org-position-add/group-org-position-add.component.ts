import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { GroupOrgPositionService } from '@app/core/services/group-org-position/group-org-position.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { ValidationService } from '@app/shared/services/validation.service';

@Component({
  selector: 'group-org-position-add',
  templateUrl: './group-org-position-add.component.html',
  styleUrls: ['./group-org-position-add.component.css']
})

export class GroupOrgPositionAddComponent extends BaseComponent implements OnInit {
  groupList: any;
  formSave: FormGroup;
  groupOrgPositionId: any;
  partyTypeList: any;
  isEditMode: boolean = false;


  formConfig = {
    groupOrgPositionId: [''],
    groupId: [null, [ValidationService.required, ValidationService.maxLength(20)]],
    groupPositionId: [null],
    positionId: ['', [ValidationService.required, ValidationService.maxLength(20)]],
    organizationId: ['', [ValidationService.required, ValidationService.maxLength(20)]],
    effectiveDate: ['', [ValidationService.required]],
    expiredDate: ['']
  };

  constructor(
    private categoryService: CategoryService,
    private groupOrgPositionService: GroupOrgPositionService,
    public actr: ActivatedRoute,
    private router: Router,
    private app: AppComponent
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
        })
    }
  }

  processSaveOrUpdate() {
    // Xet file vao form
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    } else {
      this.groupOrgPositionService.validateBeforeSave(this.formSave.value).subscribe(res => {
        if (this.groupOrgPositionService.requestIsSuccess(res)) {
          if (res.data === 1) {
            // Giao qua trinh
            this.groupOrgPositionService.processReturnMessage({ type: 'WARNING', code: 'process.duplicateProcess' });
            return;
          } else {
            this.app.confirmMessage(null, () => {// on accepted
              this.actionSave();
            }, () => {// on rejected
            });
          }
        }
      });
    }
  }

  private actionSave() {
    this.groupOrgPositionService.saveOrUpdate(this.formSave.value)
      .subscribe(res => {
        if (this.groupOrgPositionService.requestIsSuccess(res) && res.data && res.data.groupOrgPositionId) {
          this.goView(res.data.groupOrgPositionId);
        }
      });
  }

  public goBack() {
    this.router.navigate(['/settings/group-org-position']);
  }

  public goView(groupOrgPositionId: any) {
    this.router.navigate(['/settings/group-org-position-view', groupOrgPositionId]);
  }
}