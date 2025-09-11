import { ACTION_FORM, DEFAULT_MODAL_OPTIONS } from '@app/core';
import {ViewChild, Injectable, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { SysPropertyDetailBean } from '@app/core/models/sys-property-details.model';
import { CommonUtils } from '@app/shared/services/common-utils.service';

@Injectable()
export class BaseComponent{
  public FILE_TYPE_PERSONAL_UPLOAD = 'xls,xlsx,doc,docx,pdf,png,jpg,rar,zip'; // bien xu ly validate file upload trong cac qa trinh cua nhan vien
  public propertyConfigs = new Array<SysPropertyDetailBean>();
  public actionForm: ACTION_FORM;
  public resource;
  public permissions;
  /**
   * Bien ho tro tim kiem chung
   */
  resultList: any = {};
  
  formSearch: FormGroup;
  @ViewChild('ptable') dataTable: any;
  private mainService: any;
  // dùng responsive cho màn hình mobile
  public isMenuHeaderMobile: boolean = false;

  constructor(public actr?: ActivatedRoute
    , resource?
    , actionForm?: ACTION_FORM) {
    if (actionForm) {
      this.actionForm = actionForm;
    }
    if (resource) {
      this.resource = resource;
    }
    this.findPropertyDetails();
    this.getPermissions();
    this.pressLabelSearchBasic();
    this.showFormSearch(false);
    this.isMenuHeaderMobile = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  /** =================== Check Permissions =================== */
  public getPermissions(resourceKey?: string) {
    let _resource = this.resource;
    if (resourceKey) {
      _resource = CommonUtils.getPermissionCode(resourceKey);
    }
    this.permissions = CommonUtils.getPermissionByResourceCode(_resource);
  }

  public hasPermission(operationKey: string, resourceKey?: string): boolean {
    if (resourceKey) {
      return CommonUtils.havePermission(operationKey, resourceKey);
    } else {
      if (!this.permissions || this.permissions.length <= 0) {
        return false;
      }
      const rsSearch = this.permissions.findIndex(x => x.operationCode === CommonUtils.getPermissionCode(operationKey));
      if (rsSearch < 0) {
        return false;
      }
      return true;
    }
  }
  /** =================== End Check Permissions =================== */

  /**
   * Build FormGroup
   * @param formData value of controls (Ex: data)
   * @param formConfig object formConfig (Ex: formConfig)
   * @param actionForm action of this Form (Ex: ACTION_FORM.INSERT)
   * @param validateForm validate of FormGroup
   */
  public buildForm(formData: any, formConfig: any, actionForm?: ACTION_FORM, validateForm?: any,): FormGroup {
    if (actionForm) {
      this.actionForm = actionForm;
      // console.log('ActionForm is being built ->', this.actionForm);
    }
    return CommonUtils.createFormNew(this.resource, this.actionForm, formData, formConfig, this.propertyConfigs, validateForm);
  }

  /**
   * Lay cau hinh cac thuoc tinh
   */
  private findPropertyDetails() {
    if (!this.actr) {
      return;
    }
    this.actr.data.subscribe(
      res => {
        if (res && res.props && res.props.data && res.props.data.length > 0) {
          this.propertyConfigs = CommonUtils.toPropertyDetails(res.props.data);
        }
      }
    );
  }

  /**
   * findPropertyConfigByCode
   * @param code : propertyCode
   */
  public findPropertyConfigByCode(code: string): SysPropertyDetailBean {
    const data = this.propertyConfigs.filter(item => item.propertyCode === code && item.actionForm === this.actionForm);
    return data[0];
  }

  /**
   * findAllPropertyConfigs
   */
  public findAllPropertyConfigs() {
    return this.propertyConfigs;
  }

  /**
   * Xu ly tim kiem chung
   */
  public setMainService(serviceSearch) {
    this.mainService = serviceSearch;
  }

  public setDataTable(param = {
    resultList: null,
    formSearch: null
  }) {
    this.resultList = param.resultList;
    this.formSearch = param.formSearch;
  }

  public processSearch(event?): void {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const params = this.formSearch ? this.formSearch.value : null;
    // Xu ly trong truong hop click search thi lay them thong tin cau hinh datatable
    // if (!event) {
    //   event = this.getEventDatatable(this.dataTable);
    // }
    this.mainService.search(params, event).subscribe(res => {
      this.resultList = res;
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  /**
   * Xu ly xoa
   */
  public processDelete(id): void {
    if (id && id > 0) {
      this.mainService.confirmDelete({
        messageCode: null,
        accept: () => {
          this.mainService.deleteById(id)
            .subscribe(res => {
              if (this.mainService.requestIsSuccess(res)) {
                this.processSearch();
              }
            });
        }
      });
    }
  }

  /**
   * Xu ly show popup
   */
  public activeFormModal(service, component, data) {
    const modalRef = service.open(component, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.mainService.requestIsSuccess(result)) {
        this.processSearch();
      }
    });
  }

  public getEventDatatable(datatable) {
    if (!datatable) {
      return null;
    }
    return {
      filters: datatable.filters,
      first: datatable.first,
      globalFilter: datatable.globalFilter,
      multiSortMeta: datatable.multiSortMeta,
      rows: datatable.rows,
      sortField: datatable.sortField,
      sortOrder: datatable.sortOrder
    };
  }

  /** =================== start thêm cấu hình hiển thị theo chiều ngang và chiều dọc =================== */

  isShowVertical: boolean = false;  // cho dạng dọc
  isAdvanceSearch: boolean = false; // search nâng cao
  isBasicSearch: boolean = false; // search cơ bản cho dạng nằm ngang
  isBasicDivSearch: boolean = true;// search cơ bản cho dạng dọc
  isShowHideVertical: boolean = true;

  pressLabelSearchType() {
    if (this.isAdvanceSearch) {
      window.scrollTo(0, 0);
    }
    this.isAdvanceSearch = !this.isAdvanceSearch
  }

  pressLabelSearchBasic(){
    if (this.isBasicSearch){
      window.scrollTo(0,0);
    }
    this.isBasicSearch = !this.isBasicSearch
  }

  pressLabelSearchBasicDiv(){
    if (this.isBasicDivSearch){
      window.scrollTo(0,0);
    }
    this.isBasicDivSearch = !this.isBasicDivSearch
  }

  showFormSearch(item: boolean){
    this.isShowVertical = item;
  }

  showFormMobileSearch(item: boolean){
    this.isShowVertical = !this.isShowVertical;
    this.isShowHideVertical = true;
  }

  closeBasicSearch(){
    if(this.isShowHideVertical){
      window.scrollTo(0,0);
    }
    this.isShowHideVertical = !this.isShowHideVertical
  }

  /** =================== end thêm cấu hình hiển thị theo chiều ngang và chiều dọc =================== */

  /** =================== start thay đổi số bản ghi hiển thị =================== */
  changeRow: number = 10;

  onTablePageChange(event) {
    const param = {first: 0, rows: event};
    this.changeRow = event;
    this.processSearch(param)
  }


  /** =================== end thay đổi số bản ghi hiển thị =================== */

}
