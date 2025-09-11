import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { throwIfAlreadyLoaded } from '@app/core/guards/module-import.guard';
import { BaseControl } from '@app/core/models/base.control';
import { FileControl } from '@app/core/models/file.control';
import { FundActivityService } from '@app/core/services/fund/fund-activity.service';
import { FundManagementService } from '@app/core/services/fund/fund-management.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { TranslationService } from 'angular-l10n';
import { debug } from 'console';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'fund-activity-form',
  templateUrl: './fund-activity-form.component.html',
  styleUrls: ['./fund-activity-form.component.css']
})
export class FundActivityFormComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  fundTypeList: any;
  fundActivityId: any;
  lstFormFundMangementConfig: FormArray;
  activityCategoryList: any;
  activityTypeList: any;
  executedMoneyNumber: any;
  isView = false;
  isUpdate = false;
  isInsert = false;
  downLoadFile = true;
  formConfig = {
    fundActivityId: [''],
    activityTypeId: ['', [ValidationService.required]],
    fundActivityName: ['', [ValidationService.required, Validators.maxLength(255)]],
    executedDate: ['', [ValidationService.required, ValidationService.beforeCurrentDate]],
    organizationId: ['', [ValidationService.required]],
    ortherMoney: ['', [ValidationService.positiveInteger, Validators.maxLength(15)]],
    totalExecutedMoney: [''],
    note: ['', [Validators.maxLength(1000)]],
  };
  formFundMangement = {
    fundManagementId: [''],
    fundName: [''],
    organizationId: ['',[ValidationService.required]],
    activityCategoryId: ['',[ValidationService.required]],
    executedMoney: ['', [ValidationService.required, ValidationService.positiveInteger, Validators.maxLength(15)]],
    fundTypeId: ['',[ValidationService.required]],
    activityCategoryList: [[]],
    remainingMoney : 0
  };
  remainingMoneyMap: any;
  isRemainingMoney = false;
  totalExecutedMoney:any;
  constructor(
    private router: Router,
    private fundManagementService: FundManagementService,
    public actr: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private app: AppComponent,
    private categoryService: CategoryService,
    private fundActivityService: FundActivityService,
    private confirmationService: ConfirmationService,
    public translation: TranslationService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.fundActivity"));
    this.remainingMoneyMap = {};
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.fundActivityId = params.id;
        } else {
          this.setFormValue({});
        }
      }
    });
  }
  ngOnInit() {
    this.setFormValue()
    const subPaths = this.router.url.split('/');
    if (this.activatedRoute.snapshot.paramMap.get('view') === 'view') {
      this.isView = true;
    }
    if (subPaths.length > 2) {
      // this.isUpdate = subPaths[2] === 'fund-activity-edit';
      this.isUpdate = subPaths.some(item => item == 'fund-activity-edit')
      // this.isInsert = subPaths[2] === 'fund-activity-add';
      this.isInsert = subPaths.some(item => item == 'fund-activity-add')
    }
    this.setFormValue(this.fundActivityId);
  }
  get f() {
    return this.formSave.controls;
  }

  public goBack() {
    this.router.navigate(['/fund/fund-activity']);
  }

  public goView(fundActivityId: any) {
    this.router.navigate([`/fund/fund-activity/fund-activity-view/${fundActivityId}/view`]);
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
    const filesControl = new FileControl(null);
    if (data && data.fileAttachment) {
      if (data.fileAttachment.activityFile) {
        filesControl.setFileAttachment(data.fileAttachment.activityFile);
      }
    }
    this.formSave.addControl('files', filesControl);
  }

  /**
   * Hàm build Form con
   * @param list
   */
  private async buildFormSaveConfig(list?: any) {
    if (!list || list.length == 0) {
      this.lstFormFundMangementConfig = new FormArray([this.makeDefaultFormFundMangement()]);
    } else {
      const controls = new FormArray([]);
      for (const i in list) {
        const formTableConfig = list[i];
        const group = this.makeDefaultFormFundMangement();
        group.patchValue(formTableConfig);
        await this.setActivityCategoryAndFundName(group);
        controls.push(group);
      }
      this.lstFormFundMangementConfig = controls;
    }
    this.renewRemainingMoneyMap();
  }
  public renewRemainingMoneyMap() {
    const values = this.lstFormFundMangementConfig.value;
    const listId = [];
    if (values) {
      values.forEach(e => {
        if (e.fundManagementId) {
          listId.push(e.fundManagementId);
        }
      });
    }
    for (let k in this.remainingMoneyMap) {
      if(listId.indexOf(parseInt(k)) < 0) {
        delete this.remainingMoneyMap[k];
      }
    }
  }
  /**
   * Hàm tạo dữ liệu mặc định cho form con
   * @returns
   */
  private makeDefaultFormFundMangement(): FormGroup {
    const formGroup = this.buildForm({}, this.formFundMangement);
    this.fundManagementService.getAllFundType().subscribe(res => {
      this.fundTypeList = res.data;
    });
    return formGroup;
  }
  /**
   * Thêm 1 row mới trong form con
   * @param index
   * @param item
   */
  public addRow(index: number, item: FormGroup) {
    const controls = this.lstFormFundMangementConfig as FormArray;
    controls.insert(index + 1, this.makeDefaultFormFundMangement());
  }

  /**
   * Xóa 1 row trong form con
   * @param index
   * @param item
   */
  public removeRow(index: number, item: FormGroup) {
    const controls = this.lstFormFundMangementConfig as FormArray;
    if (controls.length === 1) {
      this.buildFormSaveConfig();
      const group = this.makeDefaultFormFundMangement();
      controls.push(group);
      this.lstFormFundMangementConfig = controls;
    }
    controls.removeAt(index);
    this.renewRemainingMoneyMap();
    this.getTotal();
  }
  /**
   * setFormValue
   * param data
   */
  public async setFormValue(data?: any) {
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.ACTIVITY_TYPE).subscribe(res => {
      this.activityTypeList = res.data;
    });
    if (data && data > 0) {
      await this.fundActivityService.findOneFundActivity({ fundActivityId: data })
        .subscribe(async res => {
          this.buildForms(res.data.fundActivityForm);
          await this.buildFormSaveConfig(res.data.activitiMapManagemnetForms);
          // this.getTotal();
        });
    } else {
      this.buildForms({});
      this.buildFormSaveConfig();
    }
  }
  /**
   * Hàm lưu form
   * @returns
   */
  processSaveOrUpdate() {
    if (this.totalExecutedMoney > this.sumRemainingMoneyMap()) {
      this.f['note'].setValidators(ValidationService.required);
    } else {
      this.f['note'].clearValidators();
    }
    this.f['note'].updateValueAndValidity();
    if (!this.validateBeforeSave()) {
      return;
    }
    const formInput = {};
    formInput['fundActivityForm'] = this.formSave.value;
    formInput['activitiMapManagemnetForms'] = this.lstFormFundMangementConfig.value;
    this.app.confirmMessage(null, () => { // on accepted
      this.fundActivityService.saveOrUpdateFormFile(formInput)
        .subscribe(res => {
          if (this.fundActivityService.requestIsSuccess(res) && res.data && res.data.fundActivityId) {
            this.goView(res.data.fundActivityId);
          }
        });
    }, () => {

    });
  }
  /**
   * Hàm kiểm tra lại giá trị input trước khi lưu
   * @returns
   */
  validateBeforeSave() {
    const isValidForm = CommonUtils.isValidForm(this.formSave);
    const isValidFormArray = CommonUtils.isValidForm(this.lstFormFundMangementConfig);
    return isValidFormArray && isValidForm;
  }

  /**
   * Hàm xử lý hiển thị fundManageName
   * @param item
   */
  public async setActivityCategoryAndFundName(item: FormGroup) {
    //Xử lý hiển thị mục hoạt động
    if (item.controls['fundTypeId'].value != null) {
      this.fundActivityService.getActivityCategoryByType({ fundTypeId: item.controls['fundTypeId'].value }).subscribe(res => {
        item.controls.activityCategoryList.setValue(res.data);
      });
    }
    //Xử lý hiển thị đơn vị
    if (item.controls['fundTypeId'].value != null && item.controls['fundTypeId'].value != "" && item.controls['organizationId'].value != null && item.controls['organizationId'].value != "" ) {
      await this.fundActivityService.findOneByTypeAndOrganization({ fundTypeId: item.controls['fundTypeId'].value, organizationId: item.controls['organizationId'].value, fundActivityId: this.formSave.controls['fundActivityId'].value })
        .subscribe( res => {
          if (res.data != null) {
            this.remainingMoneyMap[res.data.fundManagementId] = res.data.remainingMoney;
            item.controls['fundManagementId'].setValue(res.data.fundManagementId);
            item.controls['fundName'].setValue(res.data.name);
          } else {
            this.isRemainingMoney = false;
            item.controls['fundManagementId'].setValue(null);
            item.controls['fundName'].setValue(null);
            item.controls['executedMoney'].setValue(null);
            // xóa đơn vị khi không có cấu hình
            item.removeControl('organizationId');
            item.addControl('organizationId', new FormControl(null));
          }
          if(this.isUpdate) {
            this.getTotal()
          }
        });
    }  else {
      this.isRemainingMoney = false;
      item.controls['fundManagementId'].setValue(null);
      item.controls['fundName'].setValue(null);
      item.controls['executedMoney'].setValue(null);
    }
  }
  public sumRemainingMoneyMap() {
    let total = 0;
    for (let k in this.remainingMoneyMap) {
      total += this.remainingMoneyMap[k];
    }
    return total;
  }
  public trim(str: string) {
    return CommonUtils.isNullOrEmpty(str);
  } 
  /**
   * Hàm tính tổng số tiền chi
   */
  public getTotal() {
    const cstSum = this.lstFormFundMangementConfig.value.reduce((sum, item) => sum + Number(item.executedMoney), 0);
    const otherMoney = Number(this.formSave.controls['ortherMoney'].value) != null ? Number(this.formSave.controls['ortherMoney'].value) : 0;
    this.formSave.controls['totalExecutedMoney'].setValue(Number(cstSum + otherMoney));
    this.totalExecutedMoney = this.formSave.controls['totalExecutedMoney'].value;
    if (this.totalExecutedMoney > this.sumRemainingMoneyMap()) {
      this.isRemainingMoney = true;
      this.f['note'].setValidators(ValidationService.required);
    } else {
      this.isRemainingMoney = false;
      this.f['note'].clearValidators();
    }
      this.f['note'].updateValueAndValidity();
  }

  navigate() {
    this.router.navigate(['/fund/fund-activity/fund-activity-edit', this.fundActivityId]);
  }
}