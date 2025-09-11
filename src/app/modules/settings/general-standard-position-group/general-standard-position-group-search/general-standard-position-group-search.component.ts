import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { CategoryService } from '@app/core/services/setting/category.service';
import { GeneralStandardPositionGroupService } from '@app/core/services/setting/general-standard_position_group.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../../../../app.component';
import { BaseComponent } from '../../../../shared/components/base-component/base-component.component';
import { CommonUtils } from '../../../../shared/services/common-utils.service';
import { GeneralStandardPositionGroupFormComponent } from '../general-standard-position-group-form/general-standard-position-group-form.component';
import { ValidationService } from './../../../../shared/services/validation.service';

@Component({
  selector: 'general-standard-position-group-search',
  templateUrl: './general-standard-position-group-search.component.html',
  styleUrls: ['./general-standard-position-group-search.component.css']
})
export class GeneralStandardPositionGroupSearchComponent extends BaseComponent implements OnInit {
  public commonUtils = CommonUtils;
  standardTypeList: [];
  formConfig = {
    code: ['', [ValidationService.maxLength(50)]],
    standardType: [''],
    name: ['', [ValidationService.maxLength(500)]],
    effectiveDate: [''],
    effectiveToDate: [''],
    expiredDate: [''],
    expiredToDate: ['']
  };

  constructor(
    public actr: ActivatedRoute,
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private generalStandardPositionGroupService: GeneralStandardPositionGroupService,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.generalStandardPositionGroup"));
    this.setMainService(generalStandardPositionGroupService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [
        ValidationService.notAffter('effectiveDate', 'effectiveToDate', "position.check.toStartDate"),
        ValidationService.notAffter('expiredDate', 'expiredToDate', "position.check.toFinishDate")
      ]);
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.GENERAL_STANDARD_TYPE).subscribe(res => {
      this.standardTypeList = res.data;
    });
  }

  ngOnInit() {
    this.processSearch();
  }

  get f() {
    return this.formSearch.controls;
  }

  /**
   * prepare insert/update
   */
  prepareSaveOrUpdate(item?: any): void {
    if (item && item.generalStandardPositionGroupId > 0) {
      this.generalStandardPositionGroupService.findOne(item.generalStandardPositionGroupId)
        .subscribe(res => {
          this.categoryService.findOne(res.data.groupPositionId)
            .subscribe(resCat => {
              res.data.nameCat = resCat.data.name;
              res.data.code = resCat.data.code;
              this.activeFormModal(this.modalService, GeneralStandardPositionGroupFormComponent, res.data);
            });
        });
    } else {
      if (!this.formSearch.get('groupPositionId')) {
        this.app.warningMessage('category.chooseCategoryType', '');
        return;
      }
      this.categoryService.findOne(this.formSearch.get('groupPositionId').value)
        .subscribe(resCat => {
          const data = {
            groupPositionId: resCat.data.categoryId,
            nameCat: resCat.data.name,
            code: resCat.data.code
          };
          this.activeFormModal(this.modalService, GeneralStandardPositionGroupFormComponent, data);
        });
    }
  }
}
