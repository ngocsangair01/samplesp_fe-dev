import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { FileControl } from '@app/core/models/file.control';
import { RewardThoughtReportResultService } from '@app/core/services/propaganda/reward-thought-report-result.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ValidationService } from '@app/shared/services/validation.service';
import { TranslationService } from 'angular-l10n';
import { AppComponent } from '../../../../app.component';
import { CommonUtils } from '../../../../shared/services/common-utils.service';

@Component({
  selector: 'reward-thought-report-request',
  templateUrl: './reward-thought-report-request.component.html',
  styleUrls: ['./reward-thought-report-request.component.css']
})
export class RewardThoughtReportRequestComponent extends BaseComponent implements OnInit {

  updateRequest: boolean;
  orgCondition: String;
  formSave: FormGroup;
  view: boolean;
  update: boolean = null;
  formDetail: FormGroup;
  lstRewardCategory: any;
  propagandaRewardFormId: any;
  usecaseProcessId: any;
  addRequest: any;
  orgLevel: any;
  getListLevel: any;
  listUnitGq: any;
  eovListId: any;
  eovResultId: any;
  listIdFileRemove: number[] = [];

  formconfig = {
    propagandaRewardFormId: [''],
    code: [''],
    effectiveDate: ['', ValidationService.required],
    expiredDate: [''],
    decideDate: [''],
    usecaseTypeName: [''],
    createDateStr: [''],
    name: [''],
    listEmployeeNTN: [''],
    listEmployeeKNTN: [''],
    rewardCategory: [''],
    freeIncomeTax: [''],
    description: [''],
    status: [''],
    fileImport: [''],
    categoryName: [''],
    listEmployeeVP: [''],
    listOrgGQ: [''],
    employeeName: [''],
    level: [''],
    eovListOrgId: ['', ValidationService.required],
    documentNumber: ['', ValidationService.required],
    documentName: ['', ValidationService.required],
    result: ['', ValidationService.required],
    promulgatedPerson: [''],
    orgLevel: [''],
    orgLevelName: [''],
    files: [''],
    eovResultId: ['']
  }
  constructor(
    private rewardThoughtReportResultService: RewardThoughtReportResultService,
    private router: Router,
    public actr: ActivatedRoute,
    private app: AppComponent,
    public translation: TranslationService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.propagandaRewardThoughtHandling"));
    this.formDetail = this.buildForm({}, this.formconfig);
    this.lstRewardCategory = APP_CONSTANTS.REWARDCATEGORYLIST;
    this.actr.params.subscribe(params => {
      if (params && params.id != null) {
        this.eovListId = params.id;
        this.eovResultId = params.eovResultId;
        const param = CommonUtils.buildParams({ eovListId: this.eovListId });
        this.rewardThoughtReportResultService.getOrgan(param).subscribe(res => {
          this.listUnitGq = res;
        });
      }
      if (params.eovResultId) {
        this.update = true;
        this.rewardThoughtReportResultService.getDetailEovResult(params.eovResultId).subscribe(res => {
          this.buildFormsDetail(res.data);
          this.getListLevelUnit();
        });
      } else {
      }
    });
  }
  get f() {
    return this.formDetail.controls;
  }
  ngOnInit() {
  }

  private buildFormsDetail(data?: any) {
    this.formDetail = this.buildForm(data, this.formconfig, ACTION_FORM.INSERT);
    const filesControl = new FileControl(null);
    if (data && data.attachmentFileBeanList) {
      filesControl.setFileAttachment(data.attachmentFileBeanList);
    }
    this.formDetail.removeControl('files');
    this.formDetail.addControl('files', filesControl);
  }
  
  public goBack() {
    this.router.navigate(['/propaganda/reward-thought-report/', this.eovListId, 'update']);
  }
  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formDetail)) {
      return;
    }
    const formSave = {};
    formSave['effectiveDate'] = this.formDetail.get('effectiveDate').value;
    formSave['eovListOrgId'] = this.formDetail.get('eovListOrgId').value;
    formSave['documentNumber'] = this.formDetail.get('documentNumber').value;
    formSave['documentName'] = this.formDetail.get('documentName').value;
    formSave['result'] = this.formDetail.get('result').value;
    formSave['promulgatedPerson'] = this.formDetail.get('promulgatedPerson').value;
    formSave['orgLevel'] = this.formDetail.get('orgLevel').value;
    formSave['files'] = this.formDetail.get('files').value;
    formSave['eovResultId'] = this.eovResultId;
    formSave['eovListId'] = this.eovListId;
    formSave['listIdFileRemove'] = this.listIdFileRemove;

    this.app.confirmMessage(null, () => {
      const param = CommonUtils.buildParams({ documentNumber: formSave['documentNumber'] });
      this.rewardThoughtReportResultService.checkDuplicateDoc(param).subscribe(res => {
        if (CommonUtils.isNullOrEmpty(res.message)) {
          if(!this.update) {
            this.checkBeforeSave(formSave, formSave['eovListOrgId'], this.eovListId);
          } else {
            this.saveAfterCheck(formSave);
          }
        } else {
          formSave['isExistDocument'] = true;
          const message = res.message;
          this.app.confirmMessageFromAPI(
            message,
            () => {
              if (!this.update) {
                this.checkBeforeSave(formSave, formSave['eovListOrgId'], this.eovListId);
              } else {
                this.saveAfterCheck(formSave);
              }
            },
            () => { }
          );
        }
      })
    }, () => { // on rejected

    })
  }


  getListLevelUnit() {
    if (!CommonUtils.isNullOrEmpty(this.formDetail.value.eovListOrgId)) {
      const param = CommonUtils.buildParams({ eovListOrgId: this.formDetail.value.eovListOrgId });
      this.rewardThoughtReportResultService.getLevel(param).subscribe(res => {
        this.formDetail.get('orgLevelName').setValue(this.translation.translate(res + ''));
        this.formDetail.get('orgLevel').setValue(res);

      })
    } else {
      this.formDetail.get('orgLevelName').setValue('');
      this.formDetail.get('orgLevel').setValue('');
    }
  }

  private checkBeforeSave(formSave: any, eovListOrgId: any, eovListId: any) {
    const param = CommonUtils.buildParams({ eovListOrgId: eovListOrgId, eovListId: eovListId });
    // const param = CommonUtils.buildParams({ eovListId: eovListId });
    this.rewardThoughtReportResultService.checkDuplicate(param).subscribe(res => {
      if (CommonUtils.isNullOrEmpty(res.message)) {
        this.saveAfterCheck(formSave);
      } else {
        formSave['isExistOrg'] = true;
        const message = res.message;
        this.app.confirmMessage(
          message,
          () => { this.saveAfterCheck(formSave) },
          () => { }
        );
      }
    })
  }

  private saveAfterCheck(formSave: any) {
    this.rewardThoughtReportResultService.saveOrUpdateFormFile(formSave).subscribe(res => {
      if (this.rewardThoughtReportResultService.requestIsSuccess(res)) {
        this.router.navigate(['/propaganda/reward-thought-report/', this.eovListId, 'update']);
      }
    })
  }

  changeFile(attachmentFileId: any) {
    this.listIdFileRemove.push(attachmentFileId);
  }
}
