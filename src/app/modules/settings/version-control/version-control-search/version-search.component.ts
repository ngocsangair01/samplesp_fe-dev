import {VersionControlAddComponent} from '../version-control-add/version-control-add.component'
import { AppComponent } from '../../../../app.component';
import { BaseComponent } from '../../../../shared/components/base-component/base-component.component';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ACTION_FORM } from '@app/core';
import { Validators } from '@angular/forms';
import { SettingVersionService } from '@app/core/services/setting/version-control.service';
import {CommonUtils} from "@app/shared/services";

@Component({
  selector: 'version-search',
  templateUrl: './version-search.component.html',
})
export class VersionControlSearchComponent extends BaseComponent implements OnInit {
  formConfig = {
    versionControlId :[''], 
    androidBuildNumber: [''],
    androidVersion: ['', Validators.maxLength(5)],
    forceUpdateAndroid: [false],
    linkAndroid: ['', [Validators.maxLength(100)]],
    iosBuildNumber: ['', [Validators.maxLength(5)]],
    iosVersion:['', [Validators.maxLength(5)]],
    forceUpdateIOS: [false],
    linkIOS: ['', [Validators.maxLength(100)]],
   
  };
  constructor(
    private modalService: NgbModal,
    private app: AppComponent,
    private settingVersionService : SettingVersionService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.versionControl"));
    this.setMainService(settingVersionService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW);
    this.processSearch();
  }

  ngOnInit() {
   
  }

  get f() {
    return this.formSearch.controls;
  }

  processDelete(item) {
    if (item && item.versionControlId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.settingVersionService.deleteById(item.versionControlId)
          .subscribe(res => {
            if (this.settingVersionService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected

      });
    }
  }

  /**
   * prepare insert/update   -- add new 
   */ 
  prepareSaveOrUpdate(item?: any): void {
    if (item && item.versionControlId > 0) {
      this.settingVersionService.findOne(item.versionControlId)
        .subscribe(res => {

              this.activeFormModal(this.modalService, VersionControlAddComponent, res);
          });
    } else {
      this.activeFormModal(this.modalService, VersionControlAddComponent, {}); 
    }
  }
}
