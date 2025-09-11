import { FileStorageService } from '@app/core/services/file-storage.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { FormGroup, Validators } from '@angular/forms';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Component, OnInit } from '@angular/core';
import { PartyMemberProfileTypeService } from '@app/core/services/party-member-profile-type/party-member-profile-type.service';
import { AppComponent } from '@app/app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'party-member-profile-type-search',
  templateUrl: './party-member-profile-type-search.component.html',
  styleUrls: ['./party-member-profile-type-search.component.css']
})
export class PartyMemberProfileTypeSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  groupOptions: [];
  decisionTypeCodeList: string[];
  isMobileScreen: boolean = false;
  formConfig = {
    symbol: ['', [Validators.maxLength(50)]],
    name: ['', [Validators.maxLength(200)]],
    groupId: [''],
    status: [''],
    hardCopy: [''],
    integrateVoffice: [''],

    isSymbol: [false],
    isName: [false],
    isGroupId: [false],
    isStatus: [false],
    isHardCopy: [false],
    isIntegrateVoffice: [false]
  };
  constructor(
    public partyMemberProfileTypeService: PartyMemberProfileTypeService,
    private categoryService: CategoryService,
    private fileStorage: FileStorageService,
    private app: AppComponent,
    private router: Router
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyMemberProfileType"));
    this.setMainService(partyMemberProfileTypeService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW);
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.PARTY_MEMBER_PROFILE_TYPE_GROUP_TYPE).subscribe(res => {
      this.groupOptions = res.data;
    });
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    // get decisionTypeCodeList
    let decisionTypeList = APP_CONSTANTS.DECISION_TYPE;
    this.decisionTypeCodeList = Object.keys(decisionTypeList);
    this.processSearch(null);
  }

  get f() {
    return this.formSearch.controls;
  }

  /**
   * Xu ly download file trong danh sach
   */
  public downloadFile(fileData) {
    this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
      saveAs(res, fileData.fileName);
    });
  }

  /**
   * handle event create or update
   * @param id of partyMemberProfile 
   */
  prepareCreateOrUpdate(id?: any) {
    if(id) {
      this.router.navigate(['/party-organization/party-member-profile-type/edit/', id]);
    } else {
      this.router.navigate(['/party-organization/party-member-profile-type/add']);
    }
  }

  /**
   * handle action delete
   * @param item is partyMemberProfileType
   */
  processDelete(item) {
    if (item && item.partyMemberProfileTypeId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.partyMemberProfileTypeService.deleteById(item.partyMemberProfileTypeId)
          .subscribe(res => {
            if (this.partyMemberProfileTypeService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected

      });
    }
  }

  /**
   * Check special symbol not delete
   * @param symbol 
   */
  checkDelete(symbol) {
    if (!this.decisionTypeCodeList.includes(symbol)) return true;
    return false;
  }
}
