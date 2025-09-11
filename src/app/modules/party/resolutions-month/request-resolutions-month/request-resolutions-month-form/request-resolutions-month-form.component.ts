import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { RequestResolutionMonthService } from '@app/core/services/party-organization/request-resolution-month.service';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { PartyTreeSelectorComponent } from '@app/shared/components/party-tree-selector/party-tree-selector.component';
import * as moment from 'moment';
import { FileStorageService } from '@app/core/services/file-storage.service';

@Component({
  selector: 'request-resolutions-month-form.component',
  templateUrl: './request-resolutions-month-form.component.html',
  styleUrls: ['./request-resolutions-month-form.component.css']
})
export class RequestResolutionMonthFormComponent extends BaseComponent implements OnInit {
  @ViewChild('orgTree')
  orgTree: PartyTreeSelectorComponent;
  @ViewChild('partyOrgSelector')
  public partyOrgSelector;
  formSave: FormGroup;
  requestResolutionsMonthId: Number;
  isMobileScreen: boolean = false;
  formConfig = {
    requestResolutionsMonthId: [''],
    partyOrganizationId: ['', [Validators.required]],
    requestDate: [moment(new Date()).startOf('day').toDate().getTime(), [Validators.required, ValidationService.afterCurrentDate, this.afterLastDayMonthCurrent]],
    finishDate: ['', [ValidationService.afterCurrentDate, ValidationService.required]],
    name: ['', [Validators.required, Validators.maxLength(200)]],
    lstNodeCheck: [''],
    description: [''],
    requestedPeriod: ['', [Validators.required]],
    capChiBoTrucThuoc: [''],
    capChiBoCoSo: [''],
    capDangBoCoSo: [''],
    capDangBoBoPhan: [''],
    periodName: [''],
    tailPrefix: [''],
    partyType: ['']
  };
  isShowPeriod6Month: Boolean;
  isShowPeriodYear: Boolean;
  isShowPeriodQuarter: Boolean;
  filterConditionPartyOrg: string;
  isHideTree: boolean;
  isView: boolean;
  isAddPartyExcute: boolean;
  isHideFile: boolean;
  createdBy: string;
  templateFileDefault: any;

  constructor(
    public actr: ActivatedRoute
    , private requestResolutionMonthService: RequestResolutionMonthService
    , private router: Router
    , private app: AppComponent
    , private fileStorage: FileStorageService
  ) {
    super(null);
    this.setMainService(requestResolutionMonthService);
    this.buildForms({});
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.requestResolutionsMonthId = params.id;
      }
    });
    // check show loại kỳ yêu cầu
    this.showPeriodMonthYear();
    // Tạo điều kiện chọn tổ chức đảng
    this.makeFilterConditionPartyOrg();
    // Cập nhật mode của màn hình
    if (this.actr.snapshot.paramMap.get('mode') === 'addPartyExcute') {
      this.isAddPartyExcute = true;
    }
    if (this.actr.snapshot.paramMap.get('mode') === 'view') {
      this.isView = true;
      // Trường hợp xem chi tiết thì ẩn cây
      this.isHideTree = true;
    }
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    // khởi tạo form
    this.setFormValue(this.requestResolutionsMonthId);
  }

  get f() {
    return this.formSave.controls;
  }

  getListTree() {
    const lstNodeCheck: Array<Number> = [];
    this.orgTree.selectedNode.forEach(element => {
      lstNodeCheck.push(parseInt(element.data));
    });
    return lstNodeCheck;
  }

  goBack() {
    this.router.navigate(['/party-organization/request-resolutions-month']);
  }

  goView(requestResolutionsMonthId: any) {
    this.router.navigate([`/party-organization/request-resolutions-month/request-resolutions-month-view/${requestResolutionsMonthId}/view`]);
  }

  processSaveOrUpdate() {
    if(this.f['requestResolutionsMonthId'].value > 0){
      this.f.lstNodeCheck.setValue(this.getListTree());
    }
    if (!this.validateBeforeSave()) {
      return;
    }
    // set thêm tailfix
    this.f['tailPrefix'].setValue(this.getTailFix(this.f['requestedPeriod'].value));
    // set tên kỳ
    this.f['periodName'].setValue(this.getPeriodName());

    const formInput = this.formSave.value;
    this.app.confirmMessage('', () => {// on accept
      this.requestResolutionMonthService.saveOrUpdateFormFile(formInput)
        .subscribe(res => {
          if (this.requestResolutionMonthService.requestIsSuccess(res) && res.data && res.data.requestResolutionsMonthId) {
            this.goView(res.data.requestResolutionsMonthId);
          }
        });
    }, () => {// on rejected

    });
  }

  validateBeforeSave() {
    const isValidForm = CommonUtils.isValidForm(this.formSave);
    return isValidForm;
  }

  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.requestResolutionMonthService.findBeanById(data)
        .subscribe(res => {
          this.formSave = this.buildForm(res.data, this.formConfig, ACTION_FORM.INSERT,
            [ValidationService.notAffter('requestDate', 'finishDate', 'app.requestResolutionMonth.finishDate')]);
          // set giá trị cấp phải thực hiện
          this.onChangeUnit(res.data.partyType);
          // set gia trị file
          const attachFileControl = new FileControl(null);
          if (res.data && res.data.fileAttachment && res.data.fileAttachment.attachFile.length > 0) {
            attachFileControl.setFileAttachment(res.data.fileAttachment.attachFile);
            this.templateFileDefault = res.data.fileAttachment.attachFile || [];
          } else {
            this.isHideFile = true;
          }
          this.formSave.addControl('attachFile', attachFileControl);
          // set giá trị người tạo
          this.createdBy = res.data.createdBy;
          // Set giá trị cây khi cây hiển thị
          if (!this.isHideTree) {
            this.orgTree.rootId = this.f.partyOrganizationId.value;
            // set dieu kien cac cap thuc hien trong cây
            this.orgTree.setListTypeCanCheck(this.getListOrgTypeExcute(res.data.partyType));
            this.orgTree.actionInitAjax();
          }
          if(this.isView){
            if(res.data.partyType == APP_CONSTANTS.PARTY_ORG_TYPE.TTQUTU){
              this.f['partyType'].setValue(1);
            } else if(res.data.partyType == APP_CONSTANTS.PARTY_ORG_TYPE.DBCS){
              this.f['partyType'].setValue(2);
            } else if(res.data.partyType == APP_CONSTANTS.PARTY_ORG_TYPE.DBCTTTCS){
              this.f['partyType'].setValue(3);
            } else if(res.data.partyType == APP_CONSTANTS.PARTY_ORG_TYPE.DBBP){
              this.f['partyType'].setValue(4);
            }
          }
        })
    } else {
      this.formSave = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT,
        [ValidationService.notAffter('requestDate', 'finishDate', 'app.requestResolutionMonth.finishDate')]);
      const attachFileControl = new FileControl(null);
      this.formSave.addControl('attachFile', attachFileControl);
      // set show Tree
      this.isHideTree = true;
      // tạo giá trị mặc định cho kỳ yêu cầu, tên yêu cầu.
      this.f['requestedPeriod'].setValue(1);
      this.generateName(1);
    }
  }

  public loadTree() {
    this.orgTree.rootId = this.f.partyOrganizationId.value;
    this.orgTree.selectedNode = [];
    this.orgTree.actionInitAjax();
  }

  // kiem tra chon duy nhat to chuc root
  // public checkValidTree() {
  //   if (this.orgTree.selectedNode != null && this.orgTree.selectedNode.length == 1 && this.orgTree.selectedNode[0].parent == null) {
  //     this.app.errorMessage('requestResolutionMonth.onlyParent');
  //     return false;
  //   }
  //   return true;
  // }

  buildForms(data?) {
    this.formSave = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT,
      [ValidationService.notAffter('requestDate', 'finishDate', 'app.requestResolutionMonth.requestedDate')]);
    const attachFileControl = new FileControl(null);
    if (data && data.fileAttachment && data.fileAttachment.attachFile) {
      attachFileControl.setFileAttachment(data.fileAttachment.attachFile);
    }
    this.formSave.addControl('attachFile', attachFileControl);
  }

  /**
   * onChangeUnit
   */
  // onChangeUnit(event, partyOrgSelector) {
  //   if (event && (event.type === APP_CONSTANTS.PARTY_ORG_TYPE.CBCS || event.type === APP_CONSTANTS.PARTY_ORG_TYPE.CBTT)) {
  //     this.app.errorMessage('partyOrgnization.leafPartyOrg');
  //     partyOrgSelector.delete();
  //   }
  //   this.loadTree();
  // }

  /**
   * Logic check show loại kỳ yêu cầu theo thời gian
   */
  showPeriodMonthYear() {
    const currentMonth = new Date().getMonth() + 1;
    if(currentMonth == 7 || currentMonth == 1){
      this.isShowPeriod6Month = true;
    }
    if(currentMonth == 1){
      this.isShowPeriodYear = true;
    }
    if(currentMonth == 4 || currentMonth == 10) {
      this.isShowPeriodQuarter = true;
    }
  }

  /**
   * Logic generate tên nghị quyết
   * @param requestPeriod
   */
  generateName(requestPeriod: number) {
    const prefix = "Nghị quyết lãnh đạo ";
    let tailfix = this.getTailFix(requestPeriod);
    this.f['name'].setValue(prefix + tailfix);
  }

  /**
   * Hàm lấy ra tên đuôi
   * @param requestPeriod
   */
  getTailFix(requestPeriod: number) {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    let tailfix ="";
    if(requestPeriod == 1){
      tailfix = "tháng " + moment(Date()).format('MM/YYYY')
    } else if(requestPeriod == 2){
      if(currentMonth == 1){
        tailfix = "6 tháng đầu năm " + currentYear;
      } else if(currentMonth == 7){
        tailfix = "6 tháng cuối năm " + currentYear;
      }
    } else if(requestPeriod == 3){
      tailfix = "năm " + currentYear;
    }
    return tailfix;
  }

  /**
   * Hàm lấy tên kỳ mmYYYY
   */
  getPeriodName() {
    return moment(Date()).format('MMYYYY')
  }

  /**
   * Hàm tạo điều kiện tổ chức đảng phải thuộc 1 trong 3 cấp
   */
  makeFilterConditionPartyOrg() {
    const listTypeOrg = APP_CONSTANTS.PARTY_ORG_TYPE.TTQUTU+","+APP_CONSTANTS.PARTY_ORG_TYPE.DBCS+","+APP_CONSTANTS.PARTY_ORG_TYPE.DBCTTTCS;
    this.filterConditionPartyOrg = `(type in (${listTypeOrg}))`;
  }

  /**
   * Hàm lấy các loại tổ chưucs thực thi theo tổ chưucs ra yêu cầu
   * @param type
   */
  getListOrgTypeExcute(type: number) {
    if (type === APP_CONSTANTS.PARTY_ORG_TYPE.TTQUTU ) {
      return [APP_CONSTANTS.PARTY_ORG_TYPE.CBCS, APP_CONSTANTS.PARTY_ORG_TYPE.DBCS];
    }
    if (type === APP_CONSTANTS.PARTY_ORG_TYPE.DBCTTTCS ) {
      return [APP_CONSTANTS.PARTY_ORG_TYPE.CBCS, APP_CONSTANTS.PARTY_ORG_TYPE.DBCS];
    }
    if (type === APP_CONSTANTS.PARTY_ORG_TYPE.DBCS ) {
      return [APP_CONSTANTS.PARTY_ORG_TYPE.CBTT, APP_CONSTANTS.PARTY_ORG_TYPE.DBBP];
    }
    return null;
  }

   /**
   * Hàm set cấp thực thi sau khi chọn tổ chưucs đảng
   */
  onChangeUnit(type: number) {
    if (type === APP_CONSTANTS.PARTY_ORG_TYPE.TTQUTU ) {
      this.f['capChiBoCoSo'].setValue(1);
      this.f['capDangBoCoSo'].setValue(1);
      this.f['capChiBoTrucThuoc'].setValue(0);
      this.f['capDangBoBoPhan'].setValue(0);
    }
    if (type === APP_CONSTANTS.PARTY_ORG_TYPE.DBCTTTCS ) {
      this.f['capChiBoCoSo'].setValue(1);
      this.f['capDangBoCoSo'].setValue(1);
      this.f['capChiBoTrucThuoc'].setValue(0);
      this.f['capDangBoBoPhan'].setValue(0);
    }
    if (type === APP_CONSTANTS.PARTY_ORG_TYPE.DBCS ) {
      this.f['capChiBoCoSo'].setValue(0);
      this.f['capDangBoCoSo'].setValue(0);
      this.f['capChiBoTrucThuoc'].setValue(1);
      this.f['capDangBoBoPhan'].setValue(1);
    }
  }

  /**
   * Hàm bổ sung tổ chức ban hành
   */
  addPartyExcute() {
    if(this.f['requestResolutionsMonthId'].value > 0){
      this.f.lstNodeCheck.setValue(this.getListTree());
    }
    const formInput = this.formSave.value;
    this.app.confirmMessage('', () => {// on accept
      this.requestResolutionMonthService.addPartyExcute(formInput)
        .subscribe(res => {
          if (this.requestResolutionMonthService.requestIsSuccess(res)) {
            this.goBack();
          }
        });
    }, () => {// on rejected

    });
  }

  // Hàm validate ngày phải nhỏ hơn ngày cuối cùng của tháng hiện tại
  private afterLastDayMonthCurrent(control: AbstractControl): any {
    if (!control.value) { return; }
    const currentDate = new Date();
    const lastDayOfCurentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return (control.value <= lastDayOfCurentDate.getTime())
      ? '' : { afterLastDayMonthCurrent: true };
  }

  /**
  * Xu ly download file trong danh sach
  */
  public downloadFile(data) {
    // Trường hơp bản ghi do tiến trình tạo tự động
    if (this.createdBy == 'ROBOT_SCHEDULE'){
      this.requestResolutionMonthService.getDefaultFileAttach(data.secretId).subscribe(res => {
        saveAs(res, data.fileName);
      });
    } else {
      this.fileStorage.downloadFile(data.secretId).subscribe(res => {
        saveAs(res, data.fileName);
      });
    }
  }

  navigate() {
    this.router.navigate(['/party-organization/request-resolutions-month/request-resolutions-month-edit', this.requestResolutionsMonthId]);
  }

}