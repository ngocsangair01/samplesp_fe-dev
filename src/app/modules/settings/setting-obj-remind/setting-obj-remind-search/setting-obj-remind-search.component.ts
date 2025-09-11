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
import { SettingObjRemindFormComponent } from '@app/modules/settings/setting-obj-remind/setting-obj-remind-form/setting-obj-remind-form.component';
import { APP_CONSTANTS, CONFIG } from './../../../../core/app-config';
import {ObjRemindConfigService} from "@app/core/services/setting/obj-remind-config.service";

@Component({
  selector: 'setting-obj-remind-search',
  templateUrl: './setting-obj-remind-search.component.html',
  styleUrls: ['./setting-obj-remind-search.component.css']
})
export class SettingObjRemindSearchComponent extends BaseComponent implements OnInit {

  public ICON_API_URL = environment.serverUrl['assessment'] + CONFIG.API_PATH['settingIcon'] + '/icon/';
  formConfig = {
    objRemindConfigId: [''],
    type: [''],
    objName: ['', [Validators.maxLength(100)]],
    isType: [false],
    isObjName: [false]
  };
  typeList: any;
  constructor(
    private modalService: NgbModal,
    private app: AppComponent,
    private objRemindConfigService: ObjRemindConfigService,
    private fileStorage: FileStorageService,
    private categoryService: CategoryService
  ) {
    super(null, 'SETTING_ICON');
    this.setMainService(objRemindConfigService);
    this.formSearch = this.buildForm({}, this.formConfig);
    this.processSearch();
    this.objRemindConfigService.findListType().subscribe(res => {
      this.typeList = res.data.map(item => {
        return {
          value: item.type,
          label: item.type,
        };
      });
    });
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }

  processDelete(item) {
    if (item && item.settingIconId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.objRemindConfigService.deleteById(item.settingIconId)
          .subscribe(res => {
            if (this.objRemindConfigService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected

      });
    }
  }

  /**
   * prepare insert/update
   */
  prepareSaveOrUpdate(item?: any): void {
    if (item && item.objRemindConfigId > 0) {
      this.objRemindConfigService.findOne(item.objRemindConfigId)
        .subscribe(res => {
          this.activeModal(res.data);
        });
    } else {
      this.activeModal();
    }
  }


  /**
   * show modal
   * data
   */
  private activeModal(data?: any) {
    const modalRef = this.modalService.open(SettingObjRemindFormComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.buildForms(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.objRemindConfigService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

  /**
   * Xu ly download file trong danh sach
   */
  public downloadFile(fileData) {
    this.fileStorage.downloadFile(fileData.id).subscribe(res => {
      saveAs(res, fileData.fileName);
    });
  }
}
