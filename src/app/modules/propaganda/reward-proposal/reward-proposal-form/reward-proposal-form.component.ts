import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { FormGroup, FormArray, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { RewardProposalService } from '@app/core/services/propaganda/reward-proposal.service';
import { FileControl } from '@app/core/models/file.control';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { PropagandaRewardFormService } from '@app/core/services/propaganda/propaganda-reward-form.service';
import { HelperService } from '@app/shared/services/helper.service';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { HrStorage } from '@app/core/services/HrStorage';

@Component({
  selector: 'reward-proposal-form',
  templateUrl: './reward-proposal-form.component.html'
})
export class RewardProposalFormComponent extends BaseComponent implements OnInit {
  propagandaRewardProposalId: number;
  isView: boolean = false;
  isEdit: boolean = false;
  isSignVoffice = true;
  rewardTypeList: any;
  payFormType: any;
  rewardFormList: any;
  residentStatusList: any;
  orgCodeList: any;
  deptCodeList: any;
  formSave: FormGroup;
  baseSalary: any;//Luong co ban lay tu app_param
  dataError: any; //Danh sach loi khi import
  //Form khen thuong tap the
  formRewardGroup: FormArray;
  //Form khen thuong CBCNV
  formRewardEmployee: FormArray;
  //Form khen thuong Vang Lai
  formRewardHaunt: FormArray;
  //Form khen thuong Khong Cu Tru
  formRewardHomeLess: FormArray;
  //Form Config Them Moi To Trinh
  private operationKey = 'action.view';
  private adResourceKey = 'resource.propaganda';
  private defaultDomain: any;
  formConfig = {
    propagandaRewardProposalId: [''],
    organizationId: ['', [ValidationService.required]],
    orgCode: ['', [ValidationService.required, ValidationService.maxLength(100)]],
    deptCode: ['', [ValidationService.required]],
    employeeId: ['', [ValidationService.required]],
    rewardProposalType: ['', [ValidationService.required]],
    rewardProposalCode: ['', [ValidationService.maxLength(150)]],
    proposalDate: ['', [ValidationService.required]],
    totalAmountReward: ['', [ValidationService.maxLength(15)]],
    documentNumber: ['', [ValidationService.maxLength(100)]],
    content: ['', [ValidationService.required, ValidationService.maxLength(1000)]],
    approvalDate: [''],
    status: ['0'],
    reportNumber: ['', ValidationService.maxLength(100)],
    proposalMonth: [''],
    isSignVoffice: [true]
  };

  constructor(public actr: ActivatedRoute
    , private appParamService: AppParamService
    , private formBuilder: FormBuilder
    , private activatedRoute: ActivatedRoute
    , private router: Router
    , private app: AppComponent
    , private propagandaRewardFormService: PropagandaRewardFormService
    , private rewardProposalService: RewardProposalService
    , private helperService: HelperService) {
    super(null, CommonUtils.getPermissionCode("resource.propaganda"));
    this.setMainService(RewardProposalService);

    this.buildForm({}, this.formConfig);
    this.buildFromReward({});
    this.buildFormRewardGroup(null);//build form khen thuong tap the
    this.buildFormRewardEmployee(null);//build form khen thuong CBCNV
    this.buildFormRewardHaunt(null);//build form khen thuong Vang Lai
    this.buildFormRewardHomeLess(null);//build form khen thuong Khong Cu Tru

    this.defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey), CommonUtils.getPermissionCode(this.adResourceKey));

    this.payFormType = APP_CONSTANTS.PAYMENT_MODE_LIST;
    this.residentStatusList = APP_CONSTANTS.RESIDENT_STATUS_LIST;
    this.propagandaRewardFormService.getAllValidityPropagandaRewardForm().subscribe(res => {
      this.rewardFormList = res.data;
    });
    this.rewardProposalService.getOrgCodeList().subscribe(res => {
      if (this.rewardProposalService.requestIsSuccess(res)) {
        res.data.forEach(element => {
          element.name = element.code + " - " + element.name;
        });
        this.orgCodeList = res.data;
      }
    });
    this.appParamService.appParams('BASE_SALARY').subscribe(res => {
      this.baseSalary = res.data[0].parValue;
    });
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.propagandaRewardProposalId = params.id;
          if (params.id != null) {
            this.isEdit = true;
          }
        }
      }
    });
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.paramMap.get('view') === 'view') {
      this.isView = true;
    }
    this.helperService.CHANGE_FILE.subscribe(data => {
      if (data === 'reward-proposal') {
        this.readFileImport();
      } else if (data === 'delete') {
      }
    });
    if (this.propagandaRewardProposalId) {
      this.setFormValue(this.propagandaRewardProposalId);
    } else if (this.defaultDomain) {
      this.rewardProposalService.checkingOrgDomainToGetRewardProposalType(this.defaultDomain).subscribe(res => {
        if (res.data === APP_CONSTANTS.REWARD_PROPOSAL_TYPE.BRANCH) {
          this.rewardTypeList = APP_CONSTANTS.REWARD_TYPE_LIST;
        } else if (res.data === APP_CONSTANTS.REWARD_PROPOSAL_TYPE.GROUP) {
          this.rewardTypeList = APP_CONSTANTS.REWARD_TYPE_GROUP_LIST;
        } else if (res.data === APP_CONSTANTS.REWARD_PROPOSAL_TYPE.CORPORATIONS) {
          this.rewardTypeList = APP_CONSTANTS.REWARD_TYPE_COMPANY_LIST;
        }
      })
    }
  }

  get f() {
    return this.formSave.controls;
  }

  public getRewardProposalTypeList(event?: any) {
    if (event && event.organizationId > 0) {
      this.rewardProposalService.checkingOrgDomainToGetRewardProposalType(event.organizationId).subscribe(res => {
        if (res.data === APP_CONSTANTS.REWARD_PROPOSAL_TYPE.BRANCH) {
          this.rewardTypeList = APP_CONSTANTS.REWARD_TYPE_LIST;
        } else if (res.data === APP_CONSTANTS.REWARD_PROPOSAL_TYPE.GROUP) {
          this.rewardTypeList = APP_CONSTANTS.REWARD_TYPE_GROUP_LIST;
        } else if (res.data === APP_CONSTANTS.REWARD_PROPOSAL_TYPE.CORPORATIONS) {
          this.rewardTypeList = APP_CONSTANTS.REWARD_TYPE_COMPANY_LIST;
        }
      })
    }
  }

  public buildFromReward(data?: any) {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
    const rewardFile = new FileControl(null);
    this.formSave.addControl('rewardFile', rewardFile);
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.democraticMeetingId > 0) {
      this.router.navigate(['/propaganda/reward-proposal-edit/', item.democraticMeetingId]);
    }
    this.router.navigate(['/propaganda/reward-proposal-add']);
  }

  public goBack() {
    this.router.navigate(['/propaganda/reward-proposal']);
  }

  /**
   * them ban ghi khen thuong tap the
   * addEmp
   * param index
   * param item
   */
  public addRewardGroup() {
    const controls = this.formRewardGroup as FormArray;
    controls.insert(controls.length, this.makeDefaultRewardGroupForm());
  }

  /**
   * xoa ban ghi khen thuong tap the
   * removeEmp
   * param index
   * param item
   */
  public removeRewardGroup(index: number, item: FormGroup) {
    const controls = this.formRewardGroup as FormArray;
    if (controls.length === 0) {
      this.buildFormRewardGroup(null);
    }
    controls.removeAt(index);
    this.mathTotalAmountReward();
  }

  /**
   * build form khen thuong tap the
   * @param listRewardGroup 
   */
  private buildFormRewardGroup(listRewardGroup?: any) {
    let isValue = true;
    if (!listRewardGroup) {
      listRewardGroup = [{}];
      isValue = false;
    }
    let controls = new FormArray([]);
    if (this.formRewardGroup && this.formRewardGroup.length > 0) {
      controls = this.formRewardGroup;
    }
    if (isValue) {
      for (const emp of listRewardGroup) {
        const group = this.makeDefaultRewardGroupForm();
        group.patchValue(emp);
        controls.push(group);
      }
    }
    this.formRewardGroup = controls;
  }

  /**
   * Build phan tu khen thuong tap the
   * makeDefaultEmpsForm
   */
  private makeDefaultRewardGroupForm(): FormGroup {
    return this.formBuilder.group({
      organizationId: [null, Validators.compose([Validators.required])],
      rewardGroup: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      organizationName: [null, Validators.compose([Validators.required, ValidationService.maxLength(255)])],
      achievementsCommended: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      rewardFormId: [null, Validators.compose([Validators.required])],
      totalAmountReward: [null, Validators.compose([Validators.required, ValidationService.positiveInteger, Validators.maxLength(15)
        , Validators.min(0)])],
      paymentPeriod: [null, [Validators.required]]
    });
  }

  /**
   * them ban ghi khen thuong CBCNV
   * addEmp
   * param index
   * param item
   */
  public addRewardEmployee() {
    const controls = this.formRewardEmployee as FormArray;
    controls.insert(controls.length, this.makeDefaultRewardEmployeeForm());
  }

  /**
   * xoa ban ghi khen thuong CBCNV
   * removeEmp
   * param index
   * param item
   */
  public removeRewardEmployee(index: number) {
    const controls = this.formRewardEmployee as FormArray;
    if (controls.length === 0) {
      this.buildFormRewardEmployee(null);
    }
    controls.removeAt(index);
    this.mathTotalAmountReward();

  }

  /**
   * build form khen thuong CBCNV
   * @param listRewardEmployee 
   */
  private buildFormRewardEmployee(listRewardEmployee?: any) {
    let isValue = true;
    if (!listRewardEmployee) {
      listRewardEmployee = [{}];
      isValue = false;
    }
    let controls = new FormArray([]);
    if (this.formRewardEmployee && this.formRewardEmployee.length > 0) {
      controls = this.formRewardEmployee;
    }
    if (isValue) {
      for (const emp of listRewardEmployee) {
        const group = this.makeDefaultRewardEmployeeForm();
        group.patchValue(emp);
        controls.push(group);
      }
    }
    this.formRewardEmployee = controls;
  }

  /**
   * Build phan tu khen thuong CBCNV
   * makeDefaultEmpsForm
   */
  private makeDefaultRewardEmployeeForm(): FormGroup {
    return this.formBuilder.group({
      employeeId: [null, Validators.compose([Validators.required])],
      memberName: [null, Validators.compose([ValidationService.maxLength(255)])],
      rewardFormId: [null, Validators.compose([Validators.required])],
      rewardReason: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      residentStatus: [null, Validators.compose([Validators.required])],
      taxCode: [null, [Validators.maxLength(255)]],
      idNumber: [null, [Validators.maxLength(255)]],
      idNumberDate: [null],
      idNumberPlace: [null, [Validators.maxLength(255)]],
      accountNumber: [null],
      bankName: [null],
      addressPhone: [null, Validators.compose([ValidationService.maxLength(500)])],
      totalAmountPayment: [null, Validators.compose([Validators.required, ValidationService.positiveInteger, ValidationService.maxLength(15)
        , Validators.min(0)])],
      paymentPeriod: [null, Validators.compose([Validators.required, ValidationService.maxLength(200)])],
      note: [null, Validators.compose([ValidationService.maxLength(1000)])],
    });
  }

  /* them ban ghi khen thuong Vang Lai
     * addEmp
     * param index
     * param item
     */
  public addRewardHaunt() {
    const controls = this.formRewardHaunt as FormArray;
    controls.insert(controls.length, this.makeDefaultRewardHauntForm());
  }

  /**
   * xoa ban ghi khen thuong Vang Lai
   * removeEmp
   * param index
   * param item
   */
  public removeRewardHaunt(index: number) {
    const controls = this.formRewardHaunt as FormArray;
    if (controls.length === 0) {
      this.buildFormRewardHaunt(null);
    }
    controls.removeAt(index);
    this.mathTotalAmountReward();
  }

  /**
   * build form khen thuong Vang Lai
   * @param listRewardHaunt 
   */
  private buildFormRewardHaunt(listRewardHaunt?: any) {
    let isValue = true;
    if (!listRewardHaunt) {
      listRewardHaunt = [{}];
      isValue = false;
    }
    let controls = new FormArray([]);
    if (this.formRewardHaunt && this.formRewardHaunt.length > 0) {
      controls = this.formRewardHaunt;
    }
    if (isValue) {
      for (const emp of listRewardHaunt) {
        const group = this.makeDefaultRewardHauntForm();
        group.patchValue(emp);
        controls.push(group);
      }
    }
    this.formRewardHaunt = controls;
  }

  /**
   * make form khen thuong Vang Lai
   */
  private makeDefaultRewardHauntForm(): FormGroup {
    return this.formBuilder.group({
      memberName: [null, Validators.compose([ValidationService.maxLength(255)])],
      rewardFormId: [null, Validators.compose([Validators.required])],
      rewardReason: [null, Validators.compose([Validators.required, ValidationService.maxLength(255)])],
      national: [null, Validators.compose([Validators.required, ValidationService.maxLength(255)])],
      residentStatus: [1, Validators.compose([Validators.required])],
      taxCode: [null, Validators.compose([Validators.required, ValidationService.maxLength(255)])],
      idNumber: [null, Validators.compose([ValidationService.maxLength(255)])],
      idNumberDate: [null, Validators.compose([ValidationService.beforeCurrentDate])],
      idNumberPlace: [null, Validators.compose([ValidationService.maxLength(255)])],
      accountNumber: [null],
      bankName: [null],
      addressPhone: [null, Validators.compose([ValidationService.maxLength(500)])],
      totalAmountPayment: [null, Validators.compose([Validators.required, ValidationService.positiveInteger, ValidationService.maxLength(15)
        , Validators.min(0)])],
      paymentPeriod: [null, Validators.compose([Validators.required, ValidationService.maxLength(200)])],
      note: [null, Validators.compose([ValidationService.maxLength(1000)])],
    });
  }

  /**
   * them ban ghi khen thuong Khong Cu Tru
   * addEmp
   * param index
   * param item
   */
  public addRewardHomeLess() {
    const controls = this.formRewardHomeLess as FormArray;
    controls.insert(controls.length, this.makeDefaultRewardHomeLessForm());
  }

  /**
   * xoa ban ghi khen thuong Khong Cu Tru
   * removeEmp
   * param index
   * param item
   */
  public removeRewardHomeLess(index: number, item: FormGroup) {
    const controls = this.formRewardHomeLess as FormArray;
    if (controls.length === 0) {
      this.buildFormRewardHomeLess(null);
    }
    controls.removeAt(index);
    this.mathTotalAmountReward();
  }

  /**
   * build form khen thuong Khong Cu Tru
   * @param listRewardHomeLess 
   */
  private buildFormRewardHomeLess(listRewardHomeLess?: any) {
    let isValue = true;
    if (!listRewardHomeLess) {
      listRewardHomeLess = [{}];
      isValue = false;
    }
    let controls = new FormArray([]);
    if (this.formRewardHomeLess && this.formRewardHomeLess.length > 0) {
      controls = this.formRewardHomeLess;
    }
    if (isValue) {
      for (const emp of listRewardHomeLess) {
        const group = this.makeDefaultRewardHomeLessForm();
        group.patchValue(emp);
        controls.push(group);
      }
    }
    this.formRewardHomeLess = controls;
  }

  /**
   * make form khen thuong Khong Cu Tru
   */
  private makeDefaultRewardHomeLessForm(): FormGroup {
    return this.formBuilder.group({
      memberName: [null, Validators.compose([Validators.required, ValidationService.maxLength(255)])],
      rewardFormId: [null, Validators.compose([Validators.required])],
      rewardReason: [null, Validators.compose([Validators.required, ValidationService.maxLength(255)])],
      national: [null, Validators.compose([Validators.required, ValidationService.maxLength(255)])],
      residentStatus: [2, Validators.compose([Validators.required])],
      taxCode: [null, Validators.compose([ValidationService.maxLength(255)])],
      idNumber: [null, Validators.compose([Validators.required, ValidationService.maxLength(255)])],
      idNumberDate: [null, Validators.compose([Validators.required, ValidationService.beforeCurrentDate])],
      idNumberPlace: [null, Validators.compose([Validators.required, ValidationService.maxLength(255)])],
      accountNumber: [null],
      bankName: [null],
      addressPhone: [null, Validators.compose([Validators.required, ValidationService.maxLength(500)])],
      totalAmountPayment: [null, Validators.compose([Validators.required, ValidationService.positiveInteger, ValidationService.maxLength(15)
        , Validators.min(0)])],
      paymentPeriod: [null, Validators.compose([Validators.required, ValidationService.maxLength(200)])],
      note: [null, Validators.compose([ValidationService.maxLength(1000)])],
    });
  }

  processSaveOrUpdate() {
    let invalid = false;
    if (!CommonUtils.isValidForm(this.formSave)) {
      invalid = true;
    }
    if (!CommonUtils.isValidForm(this.formRewardGroup)) {
      invalid = true;
    }
    if (!CommonUtils.isValidForm(this.formRewardEmployee)) {
      invalid = true;
    }
    if (!CommonUtils.isValidForm(this.formRewardHaunt)) {
      invalid = true;
    }
    if (!CommonUtils.isValidForm(this.formRewardHomeLess)) {
      invalid = true;
    }
    if (invalid) {
      return;
    }
    //Luu form chung GeneralForm
    const formSave = {};
    formSave['propagandaRewardProposalForm'] = this.formSave.value;
    formSave['propagandaRewardGroupFormList'] = this.formRewardGroup.value;
    formSave['propagandaRewardEmployeeFormList'] = this.formRewardEmployee.value;
    formSave['propagandaRewardHauntFormList'] = this.formRewardHaunt.value;
    formSave['propagandaRewardMemberHomelessFormList'] = this.formRewardHomeLess.value;

    if (formSave['propagandaRewardGroupFormList'].length == 0 &&
      formSave['propagandaRewardEmployeeFormList'].length == 0 &&
      formSave['propagandaRewardHauntFormList'].length == 0 &&
      formSave['propagandaRewardMemberHomelessFormList'].length == 0) {
      this.app.warningMessage("inValidAllTab");
      return;
    }
    this.app.confirmMessage(null,
      () => { // accept
        this.rewardProposalService.saveOrUpdateFormFile(formSave).subscribe(
          res => {
            if (res.type === 'WARNING') {
              this.formSave.controls['rewardProposalCode'].setValue(res.data);
            }
            if (this.rewardProposalService.requestIsSuccess(res)) {
              this.goBack();
            }
          }
        );
      }, () => { } // reject
    );
  }

  //doc bieu mau import
  readFileImport() {
    if (this.formSave.get('rewardFile').value == null) {
      return;
    }

    this.rewardProposalService.readFileImport(this.formSave.value).subscribe(
      res => {
        this.formRewardGroup = new FormArray([]);
        this.formRewardEmployee = new FormArray([]);
        this.formRewardHaunt = new FormArray([]);
        this.formRewardHomeLess = new FormArray([]);

        if (this.rewardProposalService.requestIsSuccess(res)) {
          this.buildFormRewardGroup(res.data.listRewardGroup);//build form khen thuong tap the
          this.buildFormRewardEmployee(res.data.listRewardEmployee);//build form khen thuong CBCNV
          this.buildFormRewardHaunt(res.data.listRewardHaunt);//build form khen thuong Vang Lai
          this.buildFormRewardHomeLess(res.data.listRewardHomeless);//build form khen thuong Khong Cu Tru
          this.mathTotalAmountReward();

          this.dataError = null;
        } else {
          this.mathTotalAmountReward();
          this.dataError = res.data.errorList;
        }
      }
    );
  }

  //Tinh tong tien Thanh toan va tien thue tren Form khen thuong chung
  mathTotalAmountReward() {
    let totalAmountPayment = 0;
    let formRewardGroup = this.formRewardGroup.value;
    //Tinh tien form khen thuong tap the
    formRewardGroup.forEach(element => {
      let totalAmount = 0;
      if (element.totalAmountReward != null && element.totalAmountReward != '') {
        if (element.totalAmountReward.toString().includes(".")) {
          totalAmount = 0;
        } else {
          totalAmount = parseInt(element.totalAmountReward);
        }
      }
      totalAmountPayment += totalAmount;
    });
    let formRewardEmployee = this.formRewardEmployee.value;
    //Tinh tien form khen thuong CBCNV
    formRewardEmployee.forEach(element => {
      let totalAmount = 0;
      if (element.totalAmountPayment != null) {
        if (element.totalAmountPayment.toString().includes(".")) {
          totalAmount = 0;
        } else {
          totalAmount = parseInt(element.totalAmountPayment);
        }
      }
      totalAmountPayment += totalAmount;
    });
    //Tinh tien form khen thuong vang lai
    let formRewardHaunt = this.formRewardHaunt.value;
    formRewardHaunt.forEach(element => {
      let totalAmount = 0;
      if (element.totalAmountPayment != null) {
        if (element.totalAmountPayment.toString().includes(".")) {
          totalAmount = 0;
        } else {
          totalAmount = parseInt(element.totalAmountPayment);
        }
      }
      totalAmountPayment += totalAmount;
    });
    //Tinh tien form khen thuong khong cu tru
    let formRewardHomeLess = this.formRewardHomeLess.value;
    formRewardHomeLess.forEach(element => {
      let totalAmount = 0;
      if (element.totalAmountPayment != null) {
        if (element.totalAmountPayment.toString().includes(".")) {
          totalAmount = 0;
        } else {
          totalAmount = parseInt(element.totalAmountPayment);
        }
      }
      totalAmountPayment += totalAmount;
    });
    this.formSave.get('totalAmountReward').setValue(totalAmountPayment);
  }


  //Tai bieu mau import
  processDownloadTemplate() {
    const credentials = Object.assign({}, this.formSave.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.rewardProposalService.downloadTemplateImport(params).subscribe(res => {
      saveAs(res, 'template_propaganda_import.xls');
    });
  }

  getRewardProposalCode(event) {
    if (event) {
      const param = CommonUtils.buildParams({ deptCode: event });
      this.rewardProposalService.getRewardProposalCode(param).subscribe(res => {
        this.formSave.get('rewardProposalCode').setValue(res.data);
      });
    } else {
      this.formSave.get('rewardProposalCode').setValue("");
    }
  }

  /**
   * setFormValue
   * param data
   */
  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.rewardProposalService.findOne(data)
        .subscribe(res => {
          this.getDeptCodeList(res.data.propagandaRewardProposalBO.orgCode);
          this.buildFromReward(res.data.propagandaRewardProposalBO);
          if (res.data.propagandaRewardProposalBO && res.data.propagandaRewardProposalBO.organizationId) {
            this.rewardProposalService.checkingOrgDomainToGetRewardProposalType(res.data.propagandaRewardProposalBO.organizationId).subscribe(res => {
              if (res.data === APP_CONSTANTS.REWARD_PROPOSAL_TYPE.BRANCH) {
                this.rewardTypeList = APP_CONSTANTS.REWARD_TYPE_LIST;
              } else if (res.data === APP_CONSTANTS.REWARD_PROPOSAL_TYPE.GROUP) {
                this.rewardTypeList = APP_CONSTANTS.REWARD_TYPE_GROUP_LIST;
              } else if (res.data === APP_CONSTANTS.REWARD_PROPOSAL_TYPE.CORPORATIONS) {
                this.rewardTypeList = APP_CONSTANTS.REWARD_TYPE_COMPANY_LIST;
              }
            })
          }
          this.buildFormRewardGroup(res.data.listRewardGroup);//build form khen thuong tap the
          this.buildFormRewardEmployee(res.data.listRewardEmployee);//build form khen thuong CBCNV
          this.buildFormRewardHaunt(res.data.listRewardHaunt);//build form khen thuong Vang Lai
          this.buildFormRewardHomeLess(res.data.listRewardHomeless);//build form khen thuong Khong Cu Tru
          this.mathTotalAmountReward();
          const rewardFile = new FileControl(null);
          if (res.data.fileAttachment.rewardFile) {
            rewardFile.setFileAttachment(res.data.fileAttachment.rewardFile);
          }
          this.formSave.removeControl('rewardFile');
          this.formSave.addControl('rewardFile', rewardFile);
        });
    }
  }

  /**
    * loadUserVoffice
    */
  public loadData(data, item: any) {
    if (data && data.selectField > 0) {
      this.rewardProposalService.getEmpInfo(data.selectField).subscribe(res => {
        item.controls['memberName'].setValue(res.data.employeeName);
        item.controls['taxCode'].setValue(res.data.taxNumber);
        item.controls['idNumber'].setValue(res.data.personalIdNumber);
        item.controls['idNumberDate'] = new FormControl();
        item.controls['idNumberDate'].setValue(res.data.personalIdIssuedDate);
        item.controls['idNumberPlace'].setValue(res.data.personalIdIssuedPlace);
        item.controls['addressPhone'].setValue(res.data.currentAddress + "," + res.data.mobileNumber);
      });
    }
  }

  formatNumber(control: AbstractControl) {
    let stringValue: string;
    if (control.value) {
      stringValue = control.value.toString();
    } else {
      stringValue = "0";
    }
    if (stringValue) {
      if (stringValue.length == 17) {
        stringValue = "999999999999999";
      } else if (stringValue.length >= 15) {
        stringValue = stringValue.substring(0, 15);
      }
      control.setValue(parseInt(stringValue));
    }
  }

  onChangeOrgCode(event) {
    this.formSave.get('rewardProposalCode').setValue("");
    if (event) {
      this.getDeptCodeList(event);
    } else {
      this.deptCodeList = [];
    }
  }

  getDeptCodeList(orgCode) {
    this.rewardProposalService.getDeptCodeListByOrgCode(orgCode).subscribe(res => {
      if (this.rewardProposalService.requestIsSuccess(res)) {
        res.data.forEach(element => {
          element.name = element.code + " - " + element.name;
        });
        this.deptCodeList = res.data;
      }
    });
  }
}