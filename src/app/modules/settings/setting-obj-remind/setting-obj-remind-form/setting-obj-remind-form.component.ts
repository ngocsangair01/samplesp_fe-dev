import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core';
import { FileControl } from '@app/core/models/file.control';
import { CategoryService } from '@app/core/services/setting/category.service';
import { SettingIconService } from '@app/core/services/setting/setting-icon.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { ValidationService } from '@app/shared/services/validation.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {ObjRemindConfigService} from "@app/core/services/setting/obj-remind-config.service";

@Component({
  selector: 'setting-obj-remind-form',
  templateUrl: './setting-obj-remind-form.component.html',
  styleUrls: ['./setting-obj-remind-form.component.css']
})
export class SettingObjRemindFormComponent extends BaseComponent implements OnInit {

  formSave: FormGroup;
  isView: boolean;
  formConfig = {
    objRemindConfigId: [''],
    type: [''],
    objName: [''],
    objCode: [''],
    objType: [''],
    vpsPermission: [''],
    sqlCondition: [''],
    orderNo: [''],
    rootDisplay: [''],
    isDefault: ['']
  };
  objTypeList: any;
  iconTypeList: any;
  constructor(
    public actr: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private objRemindConfigService: ObjRemindConfigService,
    private app: AppComponent
  ) {
    super(null, 'SETTING_ICON');
    this.buildForms({});
    this.objTypeList = APP_CONSTANTS.OBJ_TYPE
  }

  ngOnInit() {
  }

  get f() {
    return this.formSave.controls;
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig);
  }

  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }

    this.app.confirmMessage(null, () => {// on accepted
      this.objRemindConfigService.saveOrUpdateFormFile(this.formSave.value)
        .subscribe(res => {
          if (this.objRemindConfigService.requestIsSuccess(res)) {
            this.activeModal.close(res);
          }
        });
    }, () => {// on rejected
    });
  }

  public handleChangeObjType(){
    if(this.formSave.value.objType != null){
    }
  }
}
