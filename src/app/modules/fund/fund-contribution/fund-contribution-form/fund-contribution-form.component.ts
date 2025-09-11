import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, INPUT_TYPE } from '@app/core';
import { FundContributionService } from '@app/core/services/fund/fund-contribution.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { FileControl } from '@app/core/models/file.control';

import _ from 'lodash';
@Component({
  selector: 'fund-contribution-form',
  templateUrl: './fund-contribution-form.component.html',
  styleUrls: ['./fund-contribution-form.component.css']
})
export class FundContributionFormComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  fundTypeList: any;
  fundContributionId: any;
  fundManagementId: any;
  isView = false;
  isUpdate = false;
  isInsert = false;
  lstFormOrgRelationConfig: FormArray;
  lstFormNoteFileConfig: FormArray;
  public type: INPUT_TYPE; // text, number, text-area
  employeeId: number;
  formConfig = {
    fundContributionId:[''],
    //tên quỹ
    fundName:['', [ValidationService.required]],
    fundManagementId:[''],
    //loại quỹ 
    fundTypeId:['', [ValidationService.required]],
    //tổng số người nộp
    totalMember:['',[Validators.maxLength(10), ValidationService.positiveInteger ]],
    // tổng số tiền
    totalMoney: ['', [ValidationService.positiveInteger]],
    //người nộp
    employeeId: ['', [ValidationService.required]],
    // nội dung chuyển tiền
    description: [''],
    //ngày nộp
    contributedDate: ['', [ValidationService.required, ValidationService.beforeCurrentDate]],
    //ghi chú 
    content:['', [Validators.maxLength(1000)]],
    note:['', [Validators.maxLength(1000)]],
    //tên đơn vị nộp
    organizationId:['', [ValidationService.required]],
    fundOrganizationId:['', [ValidationService.required]],
  }
  formOrgRelationConfig = {
    contributedMonth: ['', [ValidationService.required]],
    contributedMoney:['', [ValidationService.required, ValidationService.positiveNumber,Validators.maxLength(15), Validators.min(1)]],
    contributedMember:['', [ValidationService.required, ValidationService.positiveInteger, Validators.maxLength(10)]],
  };
  formNoteFileConfig = {
    fundContributionNoteFileId: [],
    fundContributionId: [],
    name: ['', [ValidationService.maxLength(200)]],
    files: new FileControl(null),
  };
  constructor(
    private router: Router,
    private fundContributionService: FundContributionService,
    public actr: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private app: AppComponent,
    
  ) {
    super(null, CommonUtils.getPermissionCode("resource.fundManagement"));
    this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          const params = this.actr.snapshot.params;
          if (params) {
            this.fundContributionId = params.id;
          }else {
            this.setFormValue({});
          }
        }
      });
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (this.activatedRoute.snapshot.paramMap.get('view') === 'view') {
      this.isView = true;
    }
    if (subPaths.length > 2) {
      this.isUpdate = subPaths[2] === 'fund-contribution-edit';
      this.isInsert = subPaths[2] === 'fund-contribution-add';
    }
    this.setFormValue(this.fundContributionId);
  }

  get f() {
    return this.formSave.controls;
  }

  public goBack() {
    this.router.navigate(['/fund/fund-contribution']);
  }

  public goView(fundContributionId: any) {
    this.router.navigate([`/fund/fund-contribution/fund-contribution-view/${fundContributionId}/view`]);
  }

  /**
   * buildForm
   */
   private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
  }

  private buildFormSaveConfig(list?: any) {
    if (!list || list.length == 0) {
      this.lstFormOrgRelationConfig = new FormArray([this.makeDefaultFormOrgRelationConfig()]);
    } else {
      const controls = new FormArray([]);
      for (const i in list) {
        const formTableConfig = list[i];
        // Gán giá trị rỗng "0" cho số tiền đầu kỳ
        if(!formTableConfig.contributedMoney){
          formTableConfig.contributedMoney = "0";
        }
        const group = this.makeDefaultFormOrgRelationConfig();
        group.patchValue(formTableConfig);
        controls.push(group);
      }
      this.lstFormOrgRelationConfig = controls;
    }
  }

  private buildFormNoteFileSaveConfig(list?: any) {
    if (!list || list.length == 0) {
      this.lstFormNoteFileConfig = new FormArray([this.makeDefaultFormNoteFileConfig()]);
    } else {
      const controls = new FormArray([]);
      for (const i in list) {
        const group = this.buildFile(list[i]);
        controls.push(group);
      }
      this.lstFormNoteFileConfig = controls;
    }
  }

  buildFile(data): FormGroup {
    const group = this.makeDefaultFormNoteFileConfig();
    const filesControl = new FileControl(null);
    if (data && data.fileAttachment && data.fileAttachment.fileContribution) {
      filesControl.setFileAttachment(data.fileAttachment.fileContribution);
    }
    group.patchValue(data);
    group.setControl('files', filesControl);
    return group;
  }
  
  private makeDefaultFormOrgRelationConfig(): FormGroup {
    const formGroup = this.buildForm({}, this.formOrgRelationConfig);
    return formGroup;
  }

  private makeDefaultFormNoteFileConfig(): FormGroup {
    const formGroup = this.buildForm({}, this.formNoteFileConfig);
    return formGroup;
  }

  /**
   * setFormValue
   * param data
   */
   public setFormValue(data?: any) {
    //lay fund type
    this.fundContributionService.getAllFundType().subscribe(res => {
      this.fundTypeList = res.data;
    });
    this.buildForms({});
    this.buildFormSaveConfig();
    this.buildFormNoteFileSaveConfig();
    if (data && data > 0) {
      this.fundContributionService.findOneFundContribution({ fundContributionId: data })
        .subscribe(res => {
          this.buildForms(res.data.fundContributionFrom);
          this.buildFormSaveConfig(res.data.lstformOrgRelationConfig);
          this.buildFormNoteFileSaveConfig(res.data.lstFormNoteFileConfig);
          this.total();
          this.totalMember();
          this.setDataForm();
        });
      } 
  }

  public addRow(index: number, item: FormGroup) {
    const controls = this.lstFormOrgRelationConfig as FormArray;
    controls.insert(index + 1, this.makeDefaultFormOrgRelationConfig());
  }

  public removeRow(index: number, item: FormGroup) {
    const controls = this.lstFormOrgRelationConfig as FormArray;
    if (controls.length === 1) {
      this.buildFormSaveConfig();
      const group = this.makeDefaultFormOrgRelationConfig();
      controls.push(group);
      this.lstFormOrgRelationConfig = controls;
    }
    controls.removeAt(index);
    this.total();
    this.totalMember();
  }

  public addRowFile(item?) {
    const controls = this.lstFormNoteFileConfig as FormArray;
    const rowInsert = this.buildFile({});
    controls.insert(item ? controls.controls.indexOf(item) + 1 : controls.length, rowInsert);
  }

  public removeRowFile(item?) {
    const index = this.lstFormNoteFileConfig.controls.indexOf(item);
    const controls = this.lstFormNoteFileConfig as FormArray;
    if (controls.length === 0) {
      this.buildFormNoteFileSaveConfig(null);
    }
    controls.removeAt(index);
    if (this.lstFormNoteFileConfig.controls.length === 0) {
      this.buildFormNoteFileSaveConfig(null)
    }
  }


  validateBeforeSave() {
    const isValidForm = CommonUtils.isValidForm(this.formSave);
    const isValidFormArray = CommonUtils.isValidForm(this.lstFormOrgRelationConfig);
    const isValidFormNoteFileArray = CommonUtils.isValidForm(this.lstFormNoteFileConfig);
    return isValidForm && isValidFormArray && isValidFormNoteFileArray;
  }

  processSaveOrUpdate() {
    if (!this.validateBeforeSave()) {
      return;
    }
    const formInput = {};
    formInput['fundContributionFrom'] = this.formSave.value;
    formInput['lstformOrgRelationConfig'] = this.lstFormOrgRelationConfig.value;
    formInput['lstFormNoteFileConfig'] = this.lstFormNoteFileConfig.value;
    this.app.confirmMessage(null, () => { // on accepted
      this.fundContributionService.saveOrUpdateFormFile(formInput)
        .subscribe(res => {
          if (this.fundContributionService.requestIsSuccess(res) && res.data && res.data.fundContributionId) {
            this.goView(res.data.fundContributionId);
          }
        });
    }, () => {
    });
  }
  
   public setDataForm() {
    //Xử lý hiển thị đơn vị
    if(this.formSave.controls['fundTypeId'].value != null && this.formSave.controls['fundTypeId'].value != "" && this.formSave.controls['fundOrganizationId'].value != null && this.formSave.controls['fundOrganizationId'].value != ""){
      this.fundContributionService.findOneByTypeAndOrganization({fundTypeId: this.formSave.controls['fundTypeId'].value, organizationId: this.formSave.controls['fundOrganizationId'].value})
        .subscribe(res =>{
          if (res.data != null) {
            this.formSave.controls['fundName'].setValue(res.data.name);
            this.formSave.controls['fundManagementId'].setValue(res.data.fundManagementId);
          }else{
            this.formSave.controls['fundName'].setValue(null);
            this.formSave.controls['fundManagementId'].setValue(null);
          }
        });
    }else{
      this.formSave.controls['fundName'].setValue(null);
      this.formSave.controls['fundManagementId'].setValue(null);
    }
  }
  
  // cộng tổng tiền
  public total(){
    const cstSum = this.lstFormOrgRelationConfig.value.reduce((sum, item) => sum + Number(item.contributedMoney),0);
    this.formSave.controls['totalMoney'].setValue(Number(cstSum));
  }

  // cộng tổng tiền
  public totalMember(){
    const cstSumMember = this.lstFormOrgRelationConfig.value.reduce((sum, item) => sum + Number(item.contributedMember),0);
    this.formSave.controls['totalMember'].setValue(Number(cstSumMember));
  }

  navigate() {
    this.router.navigate(['/fund/fund-contribution/fund-contribution-edit', this.fundContributionId]);
  }
}