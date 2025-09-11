import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ACTION_FORM, DEFAULT_MODAL_OPTIONS } from '@app/core';
import { RewardPartyMemberService } from '@app/core/services/party-organization/reward-party-member.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RewardPartyMemberViewComponent } from '../reward-party-member-view/reward-party-member-view.component';

@Component({
  selector: 'reward-party-member-search',
  templateUrl: './reward-party-member-search.component.html',
  styleUrls: ['./reward-party-member-search.component.css']
})
export class RewardPartyMemberSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  yearList = [];
  isMobileScreen: boolean = false;
  formConfig = {
    partyOrganizationId: [''],
    year: [''],
    importDateFrom: [''],
    importDateTo: [''],
    isPartyOrganizationId: [false],
    isYear: [false],
    isImportDateFrom: [false],
    isImportDateTo: [false],
  };

  constructor(
    private rewardPartyMemberService: RewardPartyMemberService,
    private router: Router,
    private modalService: NgbModal
  ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardParty"));
    this.setMainService(rewardPartyMemberService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('importDateFrom', 'importDateTo', 'common.label.toDate')]);
    this.processSearch(null);
    this.getYearList();
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }

  private getYearList() {
    this.yearList = [];
    const currentYear: number = new Date().getFullYear();
    for (let i = (currentYear - 50); i <= (currentYear + 10); i++) {
      const obj = {
        year: i
      };
      this.yearList.push(obj);
    }
    return this.yearList;
  }

  prepareImport() {
    this.router.navigate(['/party-organization/reward-party-member-import']);
  }

  prepareSign(item: any) {
    if (item && item.signDocumentId > 0) {
      this.router.navigate(['/sign-manager/import-reward-party-member/', item.signDocumentId]);
    }
  }

  processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    this.rewardPartyMemberService.exportRewardYear(this.formSearch.value).subscribe(
      res => {
        if (this.formSearch.value && this.formSearch.value.year) {
          saveAs(res, 'ctct_danh_sach_khen_thuong_dang_vien_theo_to_chuc_dang_nam_' + this.formSearch.value.year + '.xlsx');
        } else {
          saveAs(res, 'ctct_danh_sach_khen_thuong_dang_vien_theo_to_chuc_dang.xlsx');
        }
      }
    );
  }

  processViewDetail(item) {
    if (item && item.importRewardPartyMemberId > 0) {
      const modalRef = this.modalService.open(RewardPartyMemberViewComponent, DEFAULT_MODAL_OPTIONS);
      modalRef.componentInstance.setFormValue(item);
    }
  }
}
