import { MassPositionService } from '@app/core/services/mass-organization/mass-position.service';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core';
import { CategoryService } from '@app/core/services/setting/category.service';
import { CommonUtils } from '@app/shared/services';
@Component({
  selector: 'mass-position-search',
  templateUrl: './mass-position-search.component.html',
  styleUrls: ['./mass-position-search.component.css']
})
export class MassPositionSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  branch: number;
  status: any;
  typeList=[];
  catygoryTypeCode: string;
  formconfig =  {
    massPositionId: [''],
    branch: [''],
    type: [''],
    code:['', [Validators.maxLength(100)]],
    name: ['', [Validators.maxLength(200)]],
    isHighestPosition: [''],
    isType: [false],
    isCode:[false],
    isName: [false],
    isShowHighestPosition: [false],
  }
  constructor(
    private massPositionService: MassPositionService,
    private router: Router,
    private app: AppComponent,
    private categoryService: CategoryService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.massPosition"));
    this.formSearch = this.buildForm({}, this.formconfig);
    this.setMainService(massPositionService);
    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 2) {
      if (subPaths[2] === 'woman') {
        this.branch = 1;
        this.catygoryTypeCode = APP_CONSTANTS.CATEGORY_TYPE_CODE.TO_CHUC_PHU_NU;
      }
      if (subPaths[2] === 'youth') {
        this.branch = 2;
        this.catygoryTypeCode = APP_CONSTANTS.CATEGORY_TYPE_CODE.TO_CHUC_THANH_NIEN;
      }
      if (subPaths[2] === 'union') {
        this.branch = 3;
        this.catygoryTypeCode = APP_CONSTANTS.CATEGORY_TYPE_CODE.TO_CHUC_CONG_DOAN;
      }
    }
    this.formSearch.controls['branch'].setValue(this.branch);
    this.categoryService.findByCategoryTypeCode(this.catygoryTypeCode).subscribe(res => {
      this.typeList = res.data;
    });
    this.processSearch();
  }

  ngOnInit() {
  }
  get f () {
    return this.formSearch.controls;
  }

   public processDelete(item) {
     if (item && item.massPositionId > 0) {
      this.app.confirmDelete(null, () => {
        this.massPositionService.deleteById(item.massPositionId).subscribe(res => {
          if (this.massPositionService.requestIsSuccess(res)) {
            this.processSearch(null);
       }
        })
      }, () => {
  //  rejected
      })
   }
  }


  public prepareSaveOrUpdate(item?: any) {
    if (item && item.massPositionId > 0) {
      if (this.branch === 1) {
        this.router.navigate(['/mass/woman/mass-position-edit/', item.massPositionId]);
      } else if (this.branch === 2) {
        this.router.navigate(['/mass/youth/mass-position-edit/', item.massPositionId]);
      } else if (this.branch === 3) {
        this.router.navigate(['/mass/union/mass-position-edit/', item.massPositionId]);
      }
    } else {
      if (this.branch === 1) {
        this.router.navigate(['/mass/woman/mass-position-add']);
      } else if (this.branch === 2) {
        this.router.navigate(['/mass/youth/mass-position-add']);
      } else if (this.branch === 3) {
        this.router.navigate(['/mass/union/mass-position-add']);
      }
    }
  }

  processView(item) {
    if (item && item.massPositionId > 0) {
      if (this.branch === 1) {
        this.router.navigate(['/mass/woman/mass-position-view/', item.massPositionId]);
      } else if (this.branch === 2) {
        this.router.navigate(['/mass/youth/mass-position-view/', item.massPositionId]);
      } else if (this.branch === 3) {
        this.router.navigate(['/mass/union/mass-position-view/', item.massPositionId]);
      }
    }
  }

  processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }

    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.massPositionService.exportMassPosition(params).subscribe(
      res => {
        if (this.branch === 1) {
          saveAs(res, "Danh_sach_chuc_vu_quan_chung_to_chuc_phu_nu.xlsx");
        } else if (this.branch === 2) {
          saveAs(res, "Danh_sach_chuc_vu_quan_chung_to_chuc_thanh_nien.xlsx");
        } else if (this.branch === 3) {
          saveAs(res, "Danh_sach_chuc_vu_quan_chung_to_chuc_cong_doan.xlsx");
        }
      }
    )
  }
}
