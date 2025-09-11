import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { FormGroup } from '@angular/forms';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS } from '@app/core';
import { CategoryService } from '@app/core/services/setting/category.service';
import { MassGroupService } from '@app/core/services/mass-group/mass-group.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MassGroupFormComponent } from '../mass-group-form/mass-group-form.component';
import { MassGroupImportComponent } from '../mass-group-import/mass-group-import.component';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'mass-group-search',
  templateUrl: './mass-group-search.component.html'
})
export class MassGroupSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  formConfig = {
    employeeName: [''],
    fromYear: [''],
    toYear: [''],
    categoryIdListStr: [''],
    orgId: ['']
  }
  categoryList: Array<any>;
  yearList: Array<any>;
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  constructor(
    private categoryService: CategoryService,
    private massGroupService: MassGroupService,
    private modalService: NgbModal,
    private app: AppComponent

  ) {
    super(null, CommonUtils.getPermissionCode('resource.massGroup'));
    this.setMainService(massGroupService);
    this.yearList = this.getYearList();
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.MASS_GROUP).subscribe(res => {
      this.categoryList = res.data;
    });
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('fromYear', 'toYear', 'massGroup.titleField.toYear')]);
    this.processSearch();
  }

  ngOnInit() {
  }

  get f () {
    return this.formSearch.controls;
  }

  private getYearList() {
    const yearList = [];
    for (let i = (this.currentYear - 20); i <= (this.currentYear + 20); i++) {
      const obj = {
        year: i
      };
      yearList.push(obj);
    }
    return yearList;
  }

  prepareCreateOrUpdate(item?) {
    if (item && item.massGroupId > 0) {
      this.massGroupService.findAllInfo(item.massGroupId)
        .subscribe(res => {
          if (res.data.massGroupId) {
            this.activeModal(res.data);
          } else {
            this.app.warningMessage('record.deleted');
            this.processSearch();
          }
        });
    } else {
      this.activeModal({});
    }
  }

  /**
   * show model
   * data
   */
  private activeModal(data?: any) {
    const modalRef = this.modalService.open(MassGroupFormComponent, DEFAULT_MODAL_OPTIONS);
      if (data) {
        modalRef.componentInstance.setFormValue(data);
      }
      modalRef.result.then((result) => {
        if (!result) {
          return;
        }
        if (this.massGroupService.requestIsSuccess(result)) {
          this.processSearch();
        }
    });
  }

  public processExport() {
    const buildParams = CommonUtils.buildParams(this.formSearch.value);
    this.massGroupService.export(buildParams).subscribe(res => {
      saveAs(res, 'Tổ công tác quần chúng.xlsx');
    });
  }

  prepareImport() {
    const modalRef = this.modalService.open(MassGroupImportComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.result.then((result) => {
      this.processSearch();
    });
  }

  /**
   * Xu ly xoa
   */
  public processDeleteMassGroup(id): void {
    if (id && id > 0) {
      this.massGroupService.confirmDelete({
        messageCode: null,
        accept: () => {
          this.massGroupService.deleteById(id)
            .subscribe(res => {
              if (this.massGroupService.requestIsSuccess(res) || res.code === 'record.deleted') {
                this.processSearch();
              }
            });
        }
      });
    }
  }

}