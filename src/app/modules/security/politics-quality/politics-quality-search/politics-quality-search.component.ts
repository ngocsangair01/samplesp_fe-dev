import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS } from '@app/core';
import { HrStorage } from '@app/core/services/HrStorage';
import { PoliticsQualityService } from '@app/core/services/security-guard/politics-quality.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PoliticsQualityFormComponent } from '../politics-quality-form/politics-quality-form.component';

@Component({
  selector: 'politics-quality-search',
  templateUrl: './politics-quality-search.component.html',
  styleUrls: ['./politics-quality-search.component.css']
})
export class PoliticsQualitySearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  currentDate = new Date();
  politicalClassList = [];
  formConfig = {
    organizationId: [null],
    politicalClass: [null],
    employeeCode: [null],
    fullName: [null],
    evaluationFromDate: [new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getTime(), [ValidationService.required]],
    evaluationToDate: [null],
    note: [null],
    isOrganizationId: [false],
    isPoliticalClass: [false],
    isEmployeeCode: [false],
    isFullName: [false],
    isEvaluationFromDate: [false],
    isEvaluationToDate: [false],
    isNote: [false],
  }
  defaultDomain;

  constructor(
    private politicsQualityService: PoliticsQualityService,
    private router: Router,
    private sysCatService: SysCatService,
    private modalService: NgbModal,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.politicsQuality"));
    this.setMainService(this.politicsQualityService);
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.POLITICAL_CLASS).subscribe(
      res => {
        this.politicalClassList = res.data;
        this.politicalClassList.push({ sysCatId: 0, name: 'Không phân loại' });
      }
    );
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('evaluationFromDate', 'evaluationToDate', 'politicsQuality.evaluationToDate')]);
    //Lấy miền dữ liệu mặc định theo nv đăng nhập
    this.defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode("action.view")
      , CommonUtils.getPermissionCode("resource.politicsQuality"));
    if (this.defaultDomain) {
      this.f['organizationId'].setValue(this.defaultDomain);
    }
    this.processSearch(null);
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }

  processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const formData = Object.assign({}, this.formSearch.value);
    const params = CommonUtils.buildParams(CommonUtils.convertData(formData));
    this.politicsQualityService.processExport(params).subscribe(
      res => {
        saveAs(res, 'DS_ChatLuongChinhTri.xlsx');
      }
    );
  }

  prepareImport() {
    this.router.navigate(['security-guard/politics-quality-import']);
  }

  prepareSaveOrUpdate(item?: any) {
    if (item && item.politicsQualityId > 0) {
      this.activeModal(item);
    } else {
      this.activeModal();
    }
  }

  activeModal(data?: any) {
    const modalRef = this.modalService.open(PoliticsQualityFormComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }

      const event = this.getEventDatatable(this.dataTable);
      this.processSearch(event);
    });
  }

  processDelete(item) {
    if (item && item.politicsQualityId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.politicsQualityService.deleteById(item.politicsQualityId)
          .subscribe(res => {
            if (this.politicsQualityService.requestIsSuccess(res)) {
              this.processSearch();
            }
          });
      }, () => {// on rejected

      });
    }
  }
  test1(){
    this.politicsQualityService.test1().subscribe(res =>{
      console.log(res)
    })
  }
  test2(){
    this.politicsQualityService.test2().subscribe(res =>{
      console.log(res)
    })
  }
  test3(){
    this.politicsQualityService.test3().subscribe(res =>{
      console.log(res)
    })
  }
}
