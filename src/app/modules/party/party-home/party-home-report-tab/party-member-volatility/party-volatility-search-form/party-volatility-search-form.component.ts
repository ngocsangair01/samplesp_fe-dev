import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ResponseResolutionQuarterYearService } from '@app/core/services/party-organization/request-resolution-quarter-year.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { APP_CONSTANTS } from '@app/core/app-config';
import { PartyTreeSelectorComponent } from '@app/shared/components/party-tree-selector/party-tree-selector.component';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'party-volatility-search-form',
  templateUrl: './party-volatility-search-form.component.html',
  styleUrls: ['./party-volatility-search-form.component.css']
})
export class PartyVolatilitySearchFormComponent extends BaseComponent implements OnInit {
  periodTypeList = APP_CONSTANTS.PERIOD_TYPE_LIST
  PERIOD_TYPE = APP_CONSTANTS.PERIOD_TYPE
  formSearch: FormGroup;
  DEFAULT_YEAR_NUMBER = 3;
  DEFAULT_PERIOD_TYPE = 3;
  listSelectedId: number[] = [];
  formConfig = {
    periodType: [this.PERIOD_TYPE.NAM],
    partyOrganizationId: [''],
    partyOrganizationIds: [],
    partyName: [''],
    year: [new Date().getFullYear()],
    yearNumber: [this.DEFAULT_YEAR_NUMBER, [ValidationService.required, Validators.min(1), Validators.max(10)]],
  };
  TYPE_YEAR = this.PERIOD_TYPE.NAM;
  LIST_YEAR = [];
  yearCurrent: number;
  isMultibleParty: boolean = false;
  @ViewChild('orgTree')
  orgTree: PartyTreeSelectorComponent;

  constructor(
    public actr: ActivatedRoute,
    private app: AppComponent,
    public activeModal: NgbActiveModal,
    public responseResolutionQuarterYearService: ResponseResolutionQuarterYearService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyOrganizationHome"));
  }

  ngOnInit() {
    this.innitYears();
  }

   /**
   * Hàm build form config with Data
   * @param formData 
   */
  public buildFormConfigWithData(formData: any){
    this.formSearch = this.buildForm(formData, this.formConfig);
     // Xử lý fill list node check nếu có dữ liệu
     if(formData.partyOrganizationIds && formData.partyOrganizationIds.length > 0){
      this.listSelectedId = formData.partyOrganizationIds;
    }
  }

  /**
   * Hàm set cho chọn nhiều đơn vị
   */
  public setIsMultibleParty(isMulti: boolean) {
      this.isMultibleParty = isMulti;    
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
    // Lấy danh sách id tổ chức đã check
    this.f.partyOrganizationIds.setValue(this.getListTree());
    // Danh sách tên tổ chức đã check
    if(this.isMultibleParty) {
      this.f.partyName.setValue(this.getListNameTree());
    } 
    const formData = this.formSearch.value;
    // Thêm list node check
    if(this.orgTree && this.orgTree.selectedNode){
      formData['selectedNode'] = this.orgTree.selectedNode;
    }
    this.activeModal.close(formData);
  }

  /**
   * Lấy danh sách tổ chức đã check
   */
  getListTree() {
    const lstNodeCheck: Array<number> = [];
    this.orgTree && this.orgTree.selectedNode.forEach(element => {
      lstNodeCheck.push(parseInt(element.data));
    });
    return lstNodeCheck;
  }

  /**
   * Lấy danh sách tên tổ chức đã check
  */
  getListNameTree() {
    let lstNameheck = "";
    this.orgTree && this.orgTree.selectedNode.forEach(element => {
      lstNameheck = lstNameheck + element.label + ", ";
    });
    if(lstNameheck.length > 0){
      lstNameheck = lstNameheck.substring(0, lstNameheck.length - 2);
    }
    return lstNameheck;
  }

  /**
   * Hàm set tên tổ chức tìm kiếm
   * @param event 
   */
  private setPartyName = (event) => {
    this.f['partyName'].setValue(event.name);
  }

  /**
   * Khởi tạo danh sách năm hiện tạo --. 20 năm trước
   */
  innitYears() {
    const range = 20;
    const yearCurrent = new Date().getFullYear();
    this.yearCurrent = yearCurrent;
    for(let i = yearCurrent; i > yearCurrent - range; i--) {
      this.LIST_YEAR.push({id: i, name: i});
    }
  }

  /**
   * Hàm set lại giá trị default cho trường yearNumber nếu đổi mode
   * @param id 
   */
  public changeModePeriod (id) {
    if(id != this.PERIOD_TYPE.NAM){
      this.f.yearNumber.setValue(this.DEFAULT_YEAR_NUMBER);
    }
  }
}
