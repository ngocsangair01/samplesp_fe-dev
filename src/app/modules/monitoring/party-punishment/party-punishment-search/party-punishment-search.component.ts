import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PartyPunishmentService } from '@app/core/services/monitoring/party-punishment.service';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS } from '@app/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PartyPunishmentFormComponent } from '../party-punishment-form/party-punishment-form.component';

@Component({
  selector: 'party-punishment-search',
  templateUrl: './party-punishment-search.component.html',
  styleUrls: ['./party-punishment-search.component.css']
})
export class PartyPunishmentSearchComponent extends BaseComponent implements OnInit {

  listPunishmentForm: any;
  formConfig = {
    decideNum: ['', [ValidationService.maxLength(100)]],
    decideDateFrom: [''],
    decideDateTo: [''],
    decideLevelId: [''],
    punishmentFormId: [''],
    partyOrganizationId: [''],
    reason: ['', [ValidationService.maxLength(1000)]],
    isDecideNum: [false],
    isDecideDateFrom: [false],
    isDecideDateTo: [false],
    isDecideLevelId: [false],
    isPunishmentFormId: [false],
    isPartyOrganizationId: [false],
    isReason: [false],

  };

  constructor(
    private router: Router,
    public actr: ActivatedRoute,
    private modalService: NgbModal,
    public sysCatService: SysCatService,
    public partyPunishmentService: PartyPunishmentService
  ) {
    super(actr, CommonUtils.getPermissionCode("resource.partyPunishment"));
    this.setMainService(partyPunishmentService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('decideDateFrom', 'decideDateTo', 'partyPunishment.decideDateTo')]);
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.PUNISHMENT_FORM)
      .subscribe(res => {
        this.listPunishmentForm = res.data;
      });
  }

  ngOnInit() {
    this.processSearch();
  }

  get f() {
    return this.formSearch.controls;
  }

  /**
   * prepareUpdate
   * param item
   */
  prepareSaveOrUpdate(item?: any) {
    if (item && item.partyPunishmentId > 0) {
      this.partyPunishmentService.findOne(item.partyPunishmentId)
        .subscribe(res => {
          this.activeModal(res.data);
        });
    } else {
      this.activeModal();
    }
  }

  /**
   * show model
   * data
   */
  private activeModal(data?: any) {
    const modalRef = this.modalService.open(PartyPunishmentFormComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.partyPunishmentService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

  processImport() {
    this.router.navigate(['/monitoring-inspection/party-punishment-management/import']);
  }

  /**
   * Xuất file màn hình tìm kiếm
   */
  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }

    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.partyPunishmentService.export(params).subscribe(res => {
      saveAs(res, 'Danh_sach_ky_luat_to_chuc_Dang.xlsx');
    });
  }
}
