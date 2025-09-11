import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core';
import { MassPositionService } from '@app/core/services/mass-organization/mass-position.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'mass-position-add',
  templateUrl: './mass-position-add.component.html',
  styleUrls: ['./mass-position-add.component.css']
})
export class MassPositionAddComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  massPositionId;
  branch: number;
  categoryTypeCode: string;
  isView: boolean = false;
  isInsert: boolean = false;
  isUpdate: boolean = false;
  typeList=[];
  formconfig =  {
    massPositionId:  [''],
    branch: ['', [ValidationService.required]],
    type: ['', [ValidationService.required]],
    code:['', [ValidationService.required, Validators.maxLength(100)]],
    name: ['', [ValidationService.required, Validators.maxLength(200)]],
    isHighestPosition: [''],
    description: ['', [Validators.maxLength(1000)]]
  }

  constructor(
    private massPositionService: MassPositionService,
    private router: Router,
    public app: AppComponent,
    public actr: ActivatedRoute,
    private categoryService: CategoryService,
  ) { 
    super(null, CommonUtils.getPermissionCode("resource.massPosition"));
    this.formSave = this.buildForm({}, this.formconfig);
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
        const params = this.actr.snapshot.params;
        if (params) {
          this.massPositionId = params.id;
        }
    });
    const subPaths = this.router.url.split('/');
    this.isView = subPaths[3] === 'mass-position-view';
    this.isInsert = subPaths[3] === 'mass-position-add';
    this.isUpdate = subPaths[3] === 'mass-position-edit';
    if (subPaths.length >= 2) {
      if (subPaths[2] === 'woman') {
        this.branch = 1;
        this.categoryTypeCode = APP_CONSTANTS.CATEGORY_TYPE_CODE.TO_CHUC_PHU_NU;
      }
      if (subPaths[2] === 'youth') {
        this.branch = 2;
        this.categoryTypeCode = APP_CONSTANTS.CATEGORY_TYPE_CODE.TO_CHUC_THANH_NIEN;
      }
      if (subPaths[2] === 'union') {
        this.branch = 3;
        this.categoryTypeCode = APP_CONSTANTS.CATEGORY_TYPE_CODE.TO_CHUC_CONG_DOAN;
      }
    }
    this.formSave.controls['branch'].setValue(this.branch);
    this.categoryService.findByCategoryTypeCode(this.categoryTypeCode).subscribe(res => {
      this.typeList = res.data;
    });
  }

  ngOnInit() {
    this.setFormValue(this.massPositionId);
  }
  get f (){
    return this.formSave.controls;
  }
  public buildForms(data ?:any) {
    this.formSave = this.buildForm(data, this.formconfig);
  }

 public setFormValue(data ?:any) {
    if (data && data > 0) {
     this.massPositionService.findOne(data)
    .subscribe(res => {
     this.buildForms(res.data);
   })
   }
 }

  // quay lai
  public goBack() {
    if (this.branch === 1) {
      this.router.navigate(['/mass/woman/mass-position']);
    } else if (this.branch === 2) {
      this.router.navigate(['/mass/youth/mass-position']);
    } else if (this.branch === 3) {
      this.router.navigate(['/mass/union/mass-position']);
    }
  }
  public goView(massPositionId: any) {
    if (this.branch === 1) {
      this.router.navigate([`/mass/woman/mass-position-view/${massPositionId}`]);
    } else if (this.branch === 2) {
      this.router.navigate([`/mass/youth/mass-position-view/${massPositionId}`]);
    } else if (this.branch === 3) {
      this.router.navigate([`/mass/union/mass-position-view/${massPositionId}`]);
    }
  }
  // them moi or sua
  processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accept
      if (!CommonUtils.isValidForm(this.formSave)) {
        return;
      } else {
        this.massPositionService.saveOrUpdate(this.formSave.value)
        .subscribe(res => {
          if (this.massPositionService.requestIsSuccess(res) && res.data && res.data.massPositionId) {
            this.goView(res.data.massPositionId);
          }
        });
      }
    }, () => {}
    );
  }

  navigate() {
    if (this.branch === 1) {
      this.router.navigate(['/mass/woman/mass-position-edit/', this.massPositionId]);
    } else if (this.branch === 2) {
      this.router.navigate(['/mass/youth/mass-position-edit/', this.massPositionId]);
    } else if (this.branch === 3) {
      this.router.navigate(['/mass/union/mass-position-edit/', this.massPositionId]);
    }
  }
}

