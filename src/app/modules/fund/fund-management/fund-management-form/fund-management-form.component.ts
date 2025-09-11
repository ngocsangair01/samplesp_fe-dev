import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM } from '@app/core';
import { FundManagementService } from '@app/core/services/fund/fund-management.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';


@Component({
  selector: 'fund-management-form',
  templateUrl: './fund-management-form.component.html',
  styleUrls: ['./fund-management-form.component.css']
})
export class FundManagementFormComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  fundTypeList: any;
  fundManagementId: any;
  isView = false;
  isUpdate = false;
  isInsert = false;
  operationKey = 'action.view';
  adResourceKey = 'resource.fundManagement';
  formConfig = {
    fundManagementId: [''],
    name: ['', [ValidationService.required, Validators.maxLength(255)]],
    organizationId: ['', [ValidationService.required]],
    fundTypeId: ['', [ValidationService.required]],
    beginningMoney: ['', [ValidationService.required, ValidationService.integer, Validators.maxLength(15)]],
    accountNumber: ['', [ValidationService.required, Validators.maxLength(200)]],
    listIdOrg: [''],
  };
  constructor(
    private router: Router,
    private fundManagementService: FundManagementService,
    public actr: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private app: AppComponent,
    private fb: FormBuilder,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.fundManagement"));
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.fundManagementId = params.id;
        } else {
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
      this.isUpdate = subPaths[2] === 'fund-management-edit';
      this.isInsert = subPaths[2] === 'fund-management-add';
    }
    this.setFormValue(this.fundManagementId);
  }
  get f() {
    return this.formSave.controls;
  }

  public goBack() {
    this.router.navigate(['/fund/fund-management']);
  }

  public goView(fundManagementId: any) {
    this.router.navigate([`/fund/fund-management/fund-management-view/${fundManagementId}/view`]);
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
    this.formSave.controls['listIdOrg'] = new FormArray([]);
  }

  /**
   * setFormValue
   * param data
   */
  public setFormValue(data?: any) {
    this.buildForms({});
    if (data && data > 0) {
      this.fundManagementService.findOneFundManagement({ fundManagementId: data})
        .subscribe(res => {
          this.buildForms(res.data);
          // Gán giá trị rỗng cho số tiền đầu kỳ
          if(!res.data.beginningMoney){
            this.f["beginningMoney"].setValue("0");
          }
          this.formSave.controls['listIdOrg'] = new FormArray([]);
          //load danh sach don vi can nop
          if (res.data.listIdOrg && res.data.listIdOrg.length > 0) {
            this.formSave.setControl('listIdOrg', this.fb.array(res.data.listIdOrg.map(item => item) || []));
          }
        });
    }
    //lay fund type
    this.fundManagementService.getAllFundType().subscribe(res => {
      this.fundTypeList = res.data;
    });
  }

  /**
   * Hàm lưu form
   * @returns 
   */
  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.formSave.value['listIdOrg'] = this.formSave.get('listIdOrg').value;
    this.app.confirmMessage(null, () => { // on accepted
      this.fundManagementService.saveOrUpdateFormFile(this.formSave.value)
        .subscribe(res => {
          if (this.fundManagementService.requestIsSuccess(res) && res.data && res.data.fundManagementId) {
            this.goView(res.data.fundManagementId);
          }
        });
    }, () => {

    });
  }

  navigate() {
    this.router.navigate(['/fund/fund-management/fund-management-edit', this.fundManagementId]);
  }
}