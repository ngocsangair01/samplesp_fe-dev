import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { DEFAULT_MODAL_OPTIONS } from '@app/core';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { SettingIconService } from '@app/core/services/setting/setting-icon.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { environment } from '@env/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountFormComponent } from '../account-form/account-form.component';
import { APP_CONSTANTS, CONFIG } from './../../../../core/app-config';
import {AccountService} from "@app/core/services/setting/account.service";

@Component({
  selector: 'account-search',
  templateUrl: './account-search.component.html',
  styleUrls: ['./account-search.component.css']
})
export class AccountSearchComponent extends BaseComponent implements OnInit {

  public ICON_API_URL = environment.serverUrl['assessment'] + CONFIG.API_PATH['settingIcon'] + '/icon/';
  formConfig = {
    accountInKind: [''],
    accountInCash: [''],
    accountDepenUnplan: [''],
    accountDepenPlan: [''],
    accountDepenActive: [''],
    accountIndepenUnplan: [''],
    accountIndepenPlan: [''],
    accountBod: [''],
    id: [1],
  };
  iconTypeList: any;
  constructor(
    private modalService: NgbModal,
    private app: AppComponent,
    private settingIconService: SettingIconService,
    private fileStorage: FileStorageService,
    private accountService: AccountService
  ) {
    super(null, 'SETTING_ICON');
    this.setMainService(settingIconService);
    this.formSearch = this.buildForm({}, this.formConfig);
    this.accountService.findById(1).subscribe(res => {
      // this.iconTypeList = res.data;
      console.log(res.data)
      this.formSearch = this.buildForm(res.data, this.formConfig);
    });
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }


  /**
   * prepare insert/update
   */
  prepareSaveOrUpdate(item?: any): void {
    this.app.confirmMessage(null, () => { // on accept
      this.accountService.saveOrUpdate(this.formSearch.value)
          .subscribe(res => {
          });
      () => {
      }
    }, () => {
      // on rejected
    });
  }

}
