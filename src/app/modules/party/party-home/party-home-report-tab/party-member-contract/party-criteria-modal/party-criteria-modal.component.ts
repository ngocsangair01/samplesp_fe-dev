import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ResponseResolutionQuarterYearService } from '@app/core/services/party-organization/request-resolution-quarter-year.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { PartyTreeSelectorComponent } from '@app/shared/components/party-tree-selector/party-tree-selector.component';

@Component({
  selector: 'party-criteria-modal',
  templateUrl: './party-criteria-modal.component.html'
})
export class PartyCriteriaModalComponent extends BaseComponent implements OnInit {
  DISPLAY_TYPE = APP_CONSTANTS.DISPLAY_TYPE
  formSearch: FormGroup;
  formConfig = {
    partyOrganizationId: [''],
    partyName: [''],
    displayType: [this.DISPLAY_TYPE.SO_LUONG], // loại giới hạn
    displayValue: ['', []],
    dateTo: [new Date().getTime()],
    type: [1] // loại thống kê
  };
  LIST_TYPE = [];
  DISPLAY_LIST_TYPE = [{id: 1, name: 'Số lượng giá trị tối đa'}, {id: 2, name: 'Giá trị có % tối thiểu'}]

  constructor(
    public actr: ActivatedRoute,
    private app: AppComponent,
    public activeModal: NgbActiveModal,
    public responseResolutionQuarterYearService: ResponseResolutionQuarterYearService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyOrganizationHome"));
  }

  ngOnInit() {
  }

  /**
   * Hàm build form config with Data
   * @param formData 
   */
  public buildFormConfigWithData(formData: any){
    // Trường hợp display type = 2 thì thêm điều kiện cho trường displayValue
    const formConfig = {...this.formConfig};
    if(formData.displayType == this.DISPLAY_TYPE.TI_LE){
      formConfig.displayValue = ['0', [ValidationService.required, Validators.min(0), Validators.max(100)]];
    }
    this.formSearch = this.buildForm(formData, this.formConfig, ACTION_FORM.VIEW, []);
  }

  /**
   * Hàm set danh sách Thống kê theo
   */
  public setListType(listValue: []) {
    this.LIST_TYPE = listValue;
  }

  get f() {
    return this.formSearch.controls;
  }

  /**
   * Action search
   */
  public processSearch() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const _displayValue = this.f.displayValue.value? this.f.displayValue.value: '';
    // Lấy danh sách id tổ chức đã check
    this.activeModal.close({...this.formSearch.value, displayValue: _displayValue});
  }

  /**
   * Hàm set tên tổ chức tìm kiếm
   * @param event 
   */
  public setPartyName = (event) => {
    this.f['partyName'].setValue(event.name);
  }

  /**
   * Hàm đổi validate khi change mode
   * @param id 
   */
  public changeModeDisplay(id) {
    let displayValueControl = new FormControl(null);
    this.formSearch.removeControl('displayValue');
    if(id == this.DISPLAY_TYPE.TI_LE) { // mode tối thiểu giá trị thì thêm validate cho trường hiển thị
       displayValueControl = new FormControl('0', [ValidationService.required, Validators.min(0), Validators.max(100)]);
    }
    this.formSearch.addControl('displayValue', displayValueControl);
  }

}
