import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM } from '@app/core';
import { PartyPositionService } from '@app/core/services/party-organization/party-position.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'party-position-search',
  templateUrl: './party-position-search.component.html',
  styleUrls: ['./party-position-search.component.css']
})
export class PartyPositionSearchComponent extends BaseComponent implements OnInit {
  partyTypeList: any;
  isMobileScreen: boolean = false;

  constructor(
    private partyPositionService: PartyPositionService,
    public sysCatService: SysCatService,
    public categoryService: CategoryService,
    private router: Router,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyPosition"));
    this.setMainService(partyPositionService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW, [
      ValidationService.notAffter('effectiveDate', 'toEffectiveDate', 'position.check.toStartDate'),
      ValidationService.notAffter('expritedDate', 'toExpritedDate', 'position.check.toFinishDate')]);
    this.processSearch();
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  formSearch: FormGroup;
  status: any;
  formConfig = {
    partyPositionId: ['', [ValidationService.maxLength(20)]],
    code: ['', [ValidationService.maxLength(50),]],
    name: ['', [
      ValidationService.maxLength(200)]],
    effectiveDate: [''],
    expritedDate: [''],
    toEffectiveDate: [''],
    toExpritedDate: [''],
    sortOrder: ['', [ValidationService.positiveInteger, Validators.min(1), ValidationService.maxLength(11)]],
    partyType: ['', [ValidationService.maxLength(4)]],
  };

  ngOnInit() {

  }


  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item) {
    if (item && item.partyPositionId > 0) {
      if (item.partyPositionId > 0) {
        this.partyPositionService.findOne(item.partyPositionId)
          .subscribe(res => {
            if (res.data != null) {
              this.router.navigate(['/party-organization/party-position-edit/', item.partyPositionId]);
            }
          })
      }
    } else {
      this.router.navigate(['/party-organization/party-position-add']);
    }
  }

  public prepareView(item) {
    this.router.navigate(['/party-organization/party-position-view/', item.partyPositionId, 'view']);
  }

  processDelete(item) {
    if (item && item.partyPositionId > 0) {
      this.app.confirmDelete(null, () => {
        this.partyPositionService.deleteById(item.partyPositionId)
          .subscribe(res => {
            if (this.partyPositionService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      })
    };
  }

  export() {
    const reqData = this.formSearch.value;
    this.app.isProcessing(true);
    this.partyPositionService.export(reqData)
      .subscribe((res) => {
        this.app.isProcessing(false);
        if (res.type === 'application/json') {
          const reader = new FileReader();
          reader.addEventListener('loadend', (e) => {
            const text = e.srcElement['result'];
            const json = JSON.parse(text);
            this.partyPositionService.processReturnMessage(json);
          });
          reader.readAsText(res);
        } else {
          saveAs(res, 'quan_ly_chuc_danh_dang.xls');
        }
      });
  }
}
