import { ValidationService } from './../../../shared/services/validation.service';
import { BaseComponent } from './../../../shared/components/base-component/base-component.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EmpTypesService } from '@app/core/services/emp-type.service';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { PoliticsQualityService } from '@app/core/services/security-guard/politics-quality.service';
import { CommonUtils } from '@app/shared/services';
import { HrStorage } from '@app/core/services/HrStorage';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';

@Component({
  selector: 'report-quality-internal',
  templateUrl: './report-quality-internal.component.html',
  styleUrls: ['./report-quality-internal.component.css']
})
export class ReportQualityInternalComponent extends BaseComponent implements OnInit {
  @ViewChild('empDataPicker') empDataPicker: any;
  formConfig = {
    fromDate: ['', [ValidationService.required]],  // từ ngày
    toDate: ['', [ValidationService.required]],    // đến ngày
    gender: [''],                                   // giới tính
    isPartyMember: [''],                            // là Đảng viên
    ethnic: [''],                                   // dân tộc
    religion: [''],                                 // tôn giáo
    learnInForeign: [''],                           // học tập tại nước ngoài ?
    familyInForeign: [''],                          // người thân tại nước ngoài - family relationship
    politicalClass: [''],                           // phân loại CTCB
    problemNote: [''],                              // Vấn đề cần lưu ý ?
    role: [''],                                     // Là cán bộ chủ trì 
    isKeyPosition: [''],                            // là vị trị trọng yếu
    discipline: [''],                               // kỷ luật - trong bảng khen thưởng kỉ luật
    joinKeyProject: [''],                           // Tham gia dự án trọng điểm
    empTypeList: [''],                                // diện dối tượng
    isBVAN: [''],                                   // Đối tượng BVAN ?
    organizationId: ['', [ValidationService.required]], // Đơn vị
    employeeId: [''],
    currentDate: [new Date()],
  }
  // list select condition
  ynParty: any;
  ynEthnicId: any;
  ysList: any;
  empTypeListSelect: any;
  ysPoliticalClass: any;
  ysJoinKeyProject: any;
  yssBVAN: any;
  filterCondition = " AND obj.status = 1 "
    + " AND EXISTS ( SELECT 1 FROM  organization o "
    + "     WHERE o.organization_id = obj.organization_id "
    + "           AND ( 0 = 1 OR o.path LIKE '{path}'))"
  filterByOrg: string;
  organizationId: any;

  constructor(
    private politicsQualityService: PoliticsQualityService,
    private empTypeService: EmpTypesService,
    private sysCatService: SysCatService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.politicsQuality"));
    this.setMainService(this.politicsQualityService);

    // empTypeList
    this.empTypeService.getListEmpType().subscribe(res => {
      this.empTypeListSelect = res;
      this.empTypeListSelect.forEach(item => {
        if (item.name === "Hợp đồng lao động" || item.name === "Hợp đồng") {
          item.name = "HĐLĐ"
        }
      })
    })

    // list thông tin đảng viên
    this.ynParty = APP_CONSTANTS.SELECT_IS_PARTY;

    // list dân tộc
    this.ynEthnicId = APP_CONSTANTS.SELECT_NATION;

    // list yes/no
    this.ysList = APP_CONSTANTS.SELECT_YES_NO;

    // list phân loại CTNB
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.POLITICAL_CLASS).subscribe(
      res => {
        this.ysPoliticalClass = res.data;
        let sysCate = { sysCatId: -1, name: 'Không phân loại' }
        this.ysPoliticalClass.push(sysCate);
        sysCate = { sysCatId: -2, name: 'Chưa phân loại' }
        this.ysPoliticalClass.push(sysCate);
      }
    );
    this.ysPoliticalClass = APP_CONSTANTS.SELECT_POLITICAL_CLASS;

    // tham gia dự án trọng điểm
    this.ysJoinKeyProject = APP_CONSTANTS.SELECT_JOIN_KEY_PROJECT;

    // BVAN
    this.yssBVAN = APP_CONSTANTS.SELECT_BVAN;

    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('fromDate', 'toDate', 'report.qualityInternal.toDate')]);
    this.organizationId = HrStorage.getDefaultDomainByCode(
      CommonUtils.getPermissionCode("action.view"),
      CommonUtils.getPermissionCode("resource.politicsQuality"));
  }

  get f() {
    return this.formSearch.controls;
  }

  ngOnInit() {
    this.filterByOrg = this.filterCondition.replace('{path}', '%/' + this.organizationId + '/%')
  }

  public processExportTotal() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    this.politicsQualityService.processExportQualityTotal(this.formSearch.value)
      .subscribe(res => {
        saveAs(res, 'Bao_cao_tong_hop_chat_luong_CTNB.xlsx');
      });
  }
  public processExportDetail() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    this.politicsQualityService.processExportQualityDetail(this.formSearch.value)
      .subscribe(res => {
        saveAs(res, 'Bao_Cao_Chi_Tiet_Chat_Luong_CTNB.xlsx');
      });
  }
  public onChangeOrg(event?) {
    if (event) {
      this.organizationId = event.organizationId;
      this.filterByOrg = this.filterCondition.replace('{path}', '%/' + this.organizationId + '/%')
      this.formSearch.controls['employeeId'].setValue('');
      this.empDataPicker.displayName.first.nativeElement.value = '';
    }
  }
}