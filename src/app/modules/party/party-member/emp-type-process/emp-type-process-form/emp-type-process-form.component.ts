import { ACTION_FORM, APP_CONSTANTS } from './../../../../../core/app-config';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { FileControl } from '@app/core/models/file.control';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmpTypeProcessService } from '@app/core/services/emp-type-process/emp-type-process.service';
import { AppComponent } from '@app/app.component';
import { EmpTypesService } from '@app/core/services/emp-type.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { LabourContractTypeService } from '@app/core/services/labour-contract-type/labour-contract-type.service';
import { LabourContractDetailService } from '@app/core/services/labour-contract-detail/labour-contract-detail.service';

@Component({
  selector: 'emp-type-process-form',
  templateUrl: './emp-type-process-form.component.html',
})
export class EmpTypeProcessFormComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  laboutTypeList: any;
  contractByOfficialList: any;
  contractByLabourTypeList: any;
  empTypeList: any;
  soldierLevelList: any;
  labourContractDetailList: any;
  workingTimeList: any;
  isNotHDLD: boolean; // ko phai hop dong lao dong
  isHDLD: boolean;  // la hop dong lao dong
  isLabourContract: boolean;
  isLabourService: boolean; // la họp dong dich vu
  isLabourNonRequired: boolean;
  empTypeProcessId: number;
  fileControl = new FileControl(null);

  formConfig = {
    empTypeProcessId: [''],
    employeeId: ['', [ValidationService.required]],
    empTypeId: ['', [ValidationService.required]],
    labourContractTypeId: ['', [ValidationService.required]],
    labourContractDetailId: ['', [ValidationService.required]],
    effectiveDate: ['', [ValidationService.required]],
    expiredDate: [''],
    signedDate: ['', [ValidationService.required]],
    contractDecisionNumber: ['', [ValidationService.required, ValidationService.maxLength(50)]],
    soldierLevelId: [''],
    managementTypeId: ['', [Validators.required]],
    description: ['', [ValidationService.maxLength(500)]],
    contractMonth: ['', [ValidationService.maxLength(4), ValidationService.positiveInteger, Validators.min(1), Validators.max(1000)]],
    workingTimeId: ['', [ValidationService.required]],
  };

  formConfigNotHDLD = {
    empTypeProcessId: [''],
    employeeId: ['', [ValidationService.required]],
    empTypeId: ['', [ValidationService.required]],
    effectiveDate: ['', [ValidationService.required]],
    expiredDate: [''],
    signedDate: ['', [ValidationService.required]],
    contractDecisionNumber: ['', [ValidationService.required, ValidationService.maxLength(50)]],
    soldierLevelId: [''],
    managementTypeId: ['', [Validators.required]],
    description: ['', [ValidationService.maxLength(500)]],
  };

  constructor(public actr: ActivatedRoute
    , public activeModal: NgbActiveModal
    , private empTypeProcessService: EmpTypeProcessService
    , private app: AppComponent
    , private labourContractTypeService: LabourContractTypeService
    , private empTypeService: EmpTypesService
    , private sysCatService: SysCatService
    , private labourContractDetailService: LabourContractDetailService) {
    super();
    this.formSave = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT,
      [ValidationService.notAffter('signedDate', 'effectiveDate', 'app.empTypeProcess.effectiveDate')
        , ValidationService.notAffter('effectiveDate', 'expiredDate', 'app.empTypeProcess.expiredDate')]);
    this.formSave.addControl('file', new FileControl(null));
    this.empTypeService.getNoneStaffAreaEmpType().subscribe(res => {
      this.empTypeList = res.data;
    });
    this.labourContractTypeService.findActiveLabourContractType().subscribe(res => {
      this.laboutTypeList = res.data;
    });
    this.showSoldierLevel();
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.WORKING_TIME).subscribe(res => {
      this.workingTimeList = res.data;
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    this.isNotHDLD = true;
    this.isHDLD = true;
    this.isLabourContract = true;
    this.isLabourService = false;
    this.isLabourNonRequired = true;
  }

  /**
   * processSaveOrUpdate
   */
  processSaveOrUpdate() {
    // Xet file vao form
    this.formSave.addControl('file', this.fileControl);
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    } else {
      this.empTypeProcessService.validateBeforeSave(this.formSave.value).subscribe(res => {
        if (this.empTypeProcessService.requestIsSuccess(res)) {
          const obj = JSON.parse(res.data);
          const returnCode = obj['returnCode'];
          const extraValue = obj['extraValue'];
          if (returnCode === 1) {
            // Giao qua trinh
            this.empTypeProcessService.processReturnMessage({ type: 'WARNING', code: 'process.duplicateProcess' });
            return;
          } else if (returnCode === 2) {
            // Qua trinh khong lien mach
            this.app.confirmMessage('app.contracProcess.notContinuousProcess', () => {
              if (extraValue === 1) {
                // Khong co quyen voi don vi
                setTimeout(() => {
                  this.app.confirmMessage('app.contracProcess.confirmHasNotPermission', () => {
                    this.actionSave();
                  }, null);
                }, 500);
              } else {
                this.actionSave();
              }
            }, null);
          } else {
            if (extraValue === 1) {
              // Khong co quyen voi don vi
              this.app.confirmMessage('app.contracProcess.confirmHasNotPermission', () => {
                this.actionSave();
              }, null);
            } else {
              this.app.confirmMessage(null, () => {
                this.actionSave();
              }, null);
            }
          }
        }
      });
    }
  }

  private actionSave() {
    this.empTypeProcessService.saveOrUpdateFormFile(this.formSave.value)
      .subscribe(res => {
        if (this.empTypeProcessService.requestIsSuccess(res)) {
          this.activeModal.close(res);
        }
      });
  }

  get f() {
    return this.formSave.controls;
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT,
      [ValidationService.notAffter('signedDate', 'effectiveDate', 'app.empTypeProcess.effectiveDate')
        , ValidationService.notAffter('effectiveDate', 'expiredDate', 'app.empTypeProcess.expiredDate')]);
  }

  private buildFormNotHDLD(data?: any) {
    this.formSave = this.buildForm(data, this.formConfigNotHDLD, ACTION_FORM.INSERT,
      [ValidationService.notAffter('signedDate', 'effectiveDate', 'app.empTypeProcess.effectiveDate')
        , ValidationService.notAffter('effectiveDate', 'expiredDate', 'app.empTypeProcess.expiredDate')]);
  }

  private buildFormFile(data) {
    if (data.fileAttachment && data.fileAttachment.file) {
      this.fileControl.setFileAttachment(data.fileAttachment.file);
    }
  }

  /**
   * setFormValue
   * param data
   */
  public setFormValue(data?: any) {
    if (data && data.empTypeProcessId > 0) {
      this.buildForms(data);
    } else {
      this.buildForms(data);
    }
    this.buildFormFile(data);
    if (data && data.empTypeId) {
      this.onEmpTypeChange(data.empTypeId, data, true);
    }
    if (data && data.labourContractTypeId) {
      this.onLabourContractTypeChange(data.labourContractTypeId, true);
    }
  }

  /**
   * onEmpTypeChange
   * param event
   */
  public onEmpTypeChange(event, data, isDefault?: boolean) {
    let formDefaultValue;
    if (data) {
      formDefaultValue = data;
    } else {
      formDefaultValue = this.formSave.value;
    }
    if (!event) {
      this.buildFormNotHDLD(formDefaultValue);
      this.showSoldierLevel();
      this.isNotHDLD = true;
      this.isHDLD = false;
      this.isLabourContract = true;
      return;
    }

    this.empTypeService.findOne(event).subscribe(res => {
      if (res.data) {
        if (res.data.hasLabourContractInfo === 1 && res.data.hasSoldierInfo === 1) {
          this.buildForms(formDefaultValue);
          this.isNotHDLD = true;
          this.isHDLD = true;
          this.isLabourContract = true;
          this.isLabourService = false;
          this.isLabourNonRequired = true;
        } else if (res.data.hasLabourContractInfo === 1) {
          this.buildForms(formDefaultValue);
          this.formSave.removeControl('soldierLevelId');
          this.isNotHDLD = false;
          this.isHDLD = true;
        } else if (res.data.hasSoldierInfo === 1) {
          this.buildFormNotHDLD(formDefaultValue);
          this.showSoldierLevel();
          this.isNotHDLD = true;
          this.isHDLD = false;
          this.isLabourContract = true;
        } else if (res.data.hasLabourContractInfo === 0 && res.data.hasSoldierInfo === 0) {
          this.isNotHDLD = false;
          this.isHDLD = false;
        }
      }
    });
  }

  /**
   * onLabourContractTypeChange
   * param event
   */
  public onLabourContractTypeChange(e, isDefault?: boolean) {
    if (e) {
      this.labourContractTypeService.findOne(e).subscribe(res => {
        // xu ly an hien chi tiet hop dong
        let contracTypeDetailValue = null;
        if (isDefault) {
          contracTypeDetailValue = this.formSave.value.labourContractDetailId;
        }

        // Kiem trloai hop dong dang chon la gi?
        this.labourContractTypeService.checkLabourType(res.data.code).subscribe(res1 => {
          if (res1.data === 1) {
            // Hop dong thoi vu hoac Hop dong CTV
            this.isLabourService = false;
            this.isLabourNonRequired = false;
            this.formSave.removeControl('workingTimeId');
          } else if (res1.data === 2) {
            // Chi la hop dong dich vu
            this.isLabourService = true;
            this.isLabourNonRequired = false;
            const workingTimeIdDefault = this.formSave.value.workingTimeId;
            this.formSave.removeControl('workingTimeId');
            this.formSave.addControl('workingTimeId', new FormControl(
              workingTimeIdDefault, [ValidationService.required]));
          } else {
            // Cac loai hop dong khac
            this.isLabourService = false;
            this.isLabourNonRequired = true;
            this.formSave.removeControl('workingTimeId');
          }

          // Xu ly validate thoi han hop dong
          const contractMonthValue = this.formSave.value.contractMonth;
          if (res1.data === 1 || res1.data === 2) {
            this.formSave.removeControl('contractMonth');
            this.formSave.addControl('contractMonth', new FormControl(
              contractMonthValue, [ValidationService.required, ValidationService.positiveInteger, Validators.min(1),
              Validators.max(1000), ValidationService.maxLength(4)]));
          } else {
            this.formSave.removeControl('contractMonth');
            this.formSave.addControl('contractMonth', new FormControl(contractMonthValue
              , [ValidationService.positiveInteger, Validators.min(1), Validators.max(1000), ValidationService.maxLength(4)]));
          }
        });

        // Lay danh sach chi tiet hop dong
        this.labourContractDetailService.getListLabourContractDetail(e).subscribe(lst => {
          this.labourContractDetailList = lst.data;
          if (lst.data.length !== 0) {
            this.formSave.removeControl('labourContractDetailId');
            this.formSave.addControl('labourContractDetailId', new FormControl(contracTypeDetailValue, [ValidationService.required]));
            this.isLabourContract = false;
          } else {
            this.formSave.removeControl('labourContractDetailId');
            this.isLabourContract = true;
          }
        });
      });
    } else {
      this.isLabourContract = true;
      this.isLabourService = false;
    }
  }

  public clearFormData() {
    this.formSave.reset();
  }

  /**
   * showSoldierLevel
   * param event
   */
  public showSoldierLevel() {
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.SOLDIER_LEVEL).subscribe(res => {
      this.soldierLevelList = res.data;
    });
  }
}