import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core';
import { HrStorage } from '@app/core/services/HrStorage';
import { PropagandaRewardFormService } from '@app/core/services/propaganda/propaganda-reward-form.service';
import { RewardDecideService } from '@app/core/services/propaganda/reward-decide.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { AppParamService } from './../../../../core/services/app-param/app-param.service';

@Component({
  selector: 'reward-decide-form',
  templateUrl: './reward-decide-form.component.html'
})
export class RewardDecideFormComponent extends BaseComponent implements OnInit {

  isView: boolean = false;
  isEdit: boolean = false;
  rewardTypeList: any;
  rewardFormList: any;
  residentStatusList: any;
  baseSalary: any;//Luong co ban lay tu app_param
  rewardProposalList: any; // lua chon to trinh
  propagandaRewardDecideId: any;
  payFormType: any;
  formSave: FormGroup;
  //Form khen thuong tap the
  formRewardGroup: FormArray;
  //Form khen thuong CBCNV
  formRewardEmployee: FormArray;
  //Form khen thuong Vang Lai
  formRewardHaunt: FormArray;
  //Form khen thuong Khong Cu Tru
  formRewardHomeLess: FormArray;
  paymentModeList = APP_CONSTANTS.PAYMENT_MODE_LIST; // Hình thức thanh toán

  private operationKey = 'action.view';
  private adResourceKey = 'resource.propaganda';
  private defaultDomain: any;

  //Form Config Them Moi Quyet Dinh
  formConfig = {
    propagandaRewardDecideId: [''],
    organizationId: ['', ValidationService.required],
    employeeId: ['', ValidationService.required],
    rewardDecideCode: ['', ValidationService.required, ValidationService.maxLength(100)],
    decideDate: ['', ValidationService.required],
    totalAmountReward: ['', [ValidationService.maxLength(15)]],
    status: [''],
    content: ['', [ValidationService.required, ValidationService.maxLength(1000)]],
    lstPropagandaRewardProposalId: ['', ValidationService.required],
    emailAccountant: ['', [ValidationService.required, ValidationService.emailFormat, ValidationService.maxLength(50)]],//Email kế toán
    paymentMode: ['', [ValidationService.required]],// Hình thức thanh toán
  };
  constructor(public actr: ActivatedRoute
    , private appParamService: AppParamService
    , private formBuilder: FormBuilder
    , private router: Router
    , private app: AppComponent
    , private propagandaRewardFormService: PropagandaRewardFormService
    , private rewardDecideService: RewardDecideService) {
    super(null, CommonUtils.getPermissionCode("resource.propaganda"));
    this.payFormType = APP_CONSTANTS.PAYMENT_MODE_LIST;

    //Lấy miền dữ liệu mặc định theo nv đăng nhập
    this.defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
      , CommonUtils.getPermissionCode(this.adResourceKey));

    this.buildFromReward({});
    this.buildFormRewardGroup(null);//build form khen thuong tap the
    this.buildFormRewardEmployee(null);//build form khen thuong CBCNV
    this.buildFormRewardHaunt(null);//build form khen thuong Vang Lai
    this.buildFormRewardHomeLess(null);//build form khen thuong Khong Cu Tru
    this.rewardTypeList = APP_CONSTANTS.REWARD_TYPE_LIST;
    this.residentStatusList = APP_CONSTANTS.RESIDENT_STATUS_LIST;
    this.propagandaRewardFormService.getAllPropagandaRewardForm().subscribe(res => {
      this.rewardFormList = res.data;
    });
    this.appParamService.appParams(APP_CONSTANTS.APP_PARAM_TYPE.BASE_SALARY).subscribe(res => {
      this.baseSalary = res.data[0].parValue;
    });
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.propagandaRewardDecideId = params.id;
        }
      }
    });
  }

  ngOnInit() {
    if (this.propagandaRewardDecideId) {
      this.rewardDecideService.findOne(this.propagandaRewardDecideId).subscribe(res => {
        this.buildFromReward(res.data.propagandaRewardDecideBean);
        if (this.formSave.value && this.formSave.value.organizationId) {
          this.getRewardProposalList(this.formSave.value.organizationId);
        }
        this.buildFormRewardGroup(res.data.listRewardGroupBean);//build form khen thuong tap the
        this.buildFormRewardEmployee(res.data.listRewardEmployeeBean);//build form khen thuong CBCNV
        this.buildFormRewardHaunt(res.data.listRewardHauntBean);//build form khen thuong Vang Lai
        this.buildFormRewardHomeLess(res.data.listRewardHomelessBean);//build form khen thuong Khong Cu Tru
        this.mathTotalAmountReward();
      })
    } else if (this.defaultDomain) {
      this.getRewardProposalList(this.defaultDomain);
    }

    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 3) {
      if (subPaths[3] == 'view') {
        this.isView = true;
      } else {
        this.isView = false;
        if (subPaths[3] == 'edit') {
          this.isEdit = true;
        } else {
          this.isEdit = false;
        }
      }
    }
  }

  public goBack() {
    this.router.navigate(['/propaganda/reward-decide']);
  }

  get f() {
    return this.formSave.controls;
  }
  /**
   * lay danh sach to trinh khen thuong
   */
  public getRewardProposalList(organizationId: number) {
    let id = 0;
    if (this.propagandaRewardDecideId) {
      id = this.propagandaRewardDecideId;
    }
    const param = CommonUtils.buildParams({ propagandaRewardDecideId: id, organizationId: organizationId });
    this.rewardDecideService.getRewardProposalList(param)
      .subscribe(res => {
        this.rewardProposalList = res;
      })
  }

  /**
   * lay danh sach to trinh khen thuong
   */
  public onChangeGetRewardProposalList(event?: any) {
    let id = 0;
    if (this.propagandaRewardDecideId) {
      id = this.propagandaRewardDecideId;
    }
    const param = CommonUtils.buildParams({ propagandaRewardDecideId: id, organizationId: event.organizationId });
    this.rewardDecideService.getRewardProposalList(param)
      .subscribe(res => {
        this.rewardProposalList = res;
      });
  }

  /**
   * On change khi chọn tờ trình
   */
  public processAutoFindRecord(event?: any) {
    this.formSave.controls['lstPropagandaRewardProposalId'].setValue(event);
    this.formSave.controls['totalAmountReward'].setValue(0);
    setTimeout(() => {
      this.rewardDecideService.findRewardTableByProgandaRewardId(this.formSave.value).subscribe(res => {
        this.buildFormRewardGroup(res.data.listRewardGroupBean);//build form khen thuong tap the
        this.buildFormRewardEmployee(res.data.listRewardEmployeeBean);//build form khen thuong CBCNV
        this.buildFormRewardHaunt(res.data.listRewardHauntBean);//build form khen thuong Vang Lai
        this.buildFormRewardHomeLess(res.data.listRewardHomelessBean);//build form khen thuong Khong Cu Tru
        this.mathTotalAmountReward();
      });
    }, 500);
  }

  public buildFromReward(data?: any) {
    this.formSave = this.buildForm(data, this.formConfig);
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
    const controls = new FormArray([]);
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
      propagandaRewardGroupId: [null],
      rewardProposalCode: [],
      organizationId: [null],
      rewardGroup: [null],
      organizationName: [null],
      achievementsCommended: [null],
      rewardFormId: [null],
      totalAmountReward: [null],
      paymentPeriod: [null],
      paymentMode: [null],
    });
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
    const controls = new FormArray([]);
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
      rewardProposalCode: [''],
      propagandaRewardMemberId: [null],
      employeeId: [null],
      memberName: [null],
      rewardFormId: [null],
      rewardReason: [null],
      residentStatus: [null],
      taxCode: [null],
      idNumber: [null],
      idNumberDate: [null],
      idNumberPlace: [null],
      accountNumber: [null],
      bankName: [null],
      addressPhone: [null],
      totalAmountPayment: [null],
      paymentPeriod: [null],
      note: [null],
    });
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
    const controls = new FormArray([]);
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
      rewardProposalCode: [''],
      propagandaRewardMemberId: [null],
      memberName: [null],
      rewardFormId: [null],
      rewardReason: [null],
      national: [null],
      residentStatus: [1],
      taxCode: [null],
      idNumber: [null],
      idNumberDate: [null],
      idNumberPlace: [null],
      accountNumber: [null],
      bankName: [null],
      addressPhone: [null],
      totalAmountPayment: [null],
      paymentPeriod: [null],
      note: [null],
    });
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
    const controls = new FormArray([]);
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
      rewardProposalCode: [''],
      propagandaRewardMemberId: [null],
      memberName: [null],
      rewardFormId: [null],
      rewardReason: [null],
      national: [null],
      residentStatus: [2],
      taxCode: [null],
      idNumber: [null],
      idNumberDate: [null],
      idNumberPlace: [null],
      accountNumber: [null],
      bankName: [null],
      addressPhone: [null],
      totalAmountPayment: [null],
      paymentPeriod: [null],
      note: [null],
    });
  }

  public processSaveOrUpdate() {
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
    formSave['propagandaRewardDecideForm'] = this.formSave.value;
    formSave['propagandaRewardGroupFormList'] = this.formRewardGroup.value;
    formSave['propagandaRewardEmployeeFormList'] = this.formRewardEmployee.value;
    formSave['propagandaRewardHauntFormList'] = this.formRewardHaunt.value;
    formSave['propagandaRewardMemberHomelessFormList'] = this.formRewardHomeLess.value;
    this.app.confirmMessage(null,
      () => { // accept
        this.rewardDecideService.saveOrUpdate(formSave).subscribe(
          res => {
            if (this.rewardDecideService.requestIsSuccess(res)) {
              this.goBack();
            }
          }
        );
      }, () => { } // reject
    );
  }

  mathTotalAmountReward() {
    let totalAmountPayment: number = 0;
    let totalAmountPersonalTax: number = 0;
    //Tính tổng số tiến thưởng form Dơn vi
    let formRewardGroup = this.formRewardGroup.value;
    formRewardGroup.forEach(element => {
      let totalAmount: number = 0;
      if (element.totalAmountReward != null) {
        totalAmount = parseInt(element.totalAmountReward);
      }
      totalAmountPayment += totalAmount;
    });
    //Tính tổng số tiến thưởng form CBCNV
    let formRewardEmployee = this.formRewardEmployee.value;
    formRewardEmployee.forEach(element => {
      let totalAmount: number = 0;
      if (element.totalAmountPayment != null) {
        totalAmount = parseInt(element.totalAmountPayment);
      }
      totalAmountPayment += totalAmount;
    });
    //Tính tổng số tiến thưởng form Vang Lai
    let formRewardHaunt = this.formRewardHaunt.value;
    formRewardHaunt.forEach(element => {
      let totalAmount: number = 0;
      let totalTax: number = 0;
      if (element.totalAmountPayment != null) {
        totalAmount = parseInt(element.totalAmountPayment);
      }
      totalAmountPayment += totalAmount;
      totalAmountPersonalTax += totalTax;
    });
    //Tính tổng số tiến thưởng form Khong cu tru
    let formRewardHomeLess = this.formRewardHomeLess.value;
    formRewardHomeLess.forEach(element => {
      let totalAmount: number = 0;
      let totalTax: number = 0;
      if (element.totalAmountPayment != null) {
        totalAmount = parseInt(element.totalAmountPayment);
      }
      totalAmountPayment += totalAmount;
    });
    this.formSave.get('totalAmountReward').setValue(totalAmountPayment);
  }
}
