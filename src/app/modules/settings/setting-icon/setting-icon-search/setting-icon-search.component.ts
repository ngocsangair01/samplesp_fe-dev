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
import { SettingIconFormComponent } from '../setting-icon-form/setting-icon-form.component';
import { APP_CONSTANTS, CONFIG } from './../../../../core/app-config';

@Component({
  selector: 'setting-icon-search',
  templateUrl: './setting-icon-search.component.html',
  styleUrls: ['./setting-icon-search.component.css']
})
export class SettingIconSearchComponent extends BaseComponent implements OnInit {

  public ICON_API_URL = environment.serverUrl['assessment'] + CONFIG.API_PATH['settingIcon'] + '/icon/';
  formConfig = {
    settingIconId: [''],
    iconType: [''],
    iconName: ['', [Validators.maxLength(100)]],
    isIconType: [false],
    isIconName: [false]
  };
  iconTypeList: any;
  constructor(
    private modalService: NgbModal,
    private app: AppComponent,
    private settingIconService: SettingIconService,
    private fileStorage: FileStorageService,
    private categoryService: CategoryService
  ) {
    super(null, 'SETTING_ICON');
    this.setMainService(settingIconService);
    this.formSearch = this.buildForm({}, this.formConfig);
    this.processSearch();
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.SETTING_ICON_TYPE).subscribe(res => {
      this.iconTypeList = res.data;
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
        this.settingIconService.deleteById(item.settingIconId)
          .subscribe(res => {
            if (this.settingIconService.requestIsSuccess(res)) {
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
    if (item && item.settingIconId > 0) {
      this.settingIconService.findOne(item.versionControlId)
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
    const modalRef = this.modalService.open(SettingIconFormComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.buildForms(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.settingIconService.requestIsSuccess(result)) {
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
