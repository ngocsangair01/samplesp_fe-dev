import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import {ACTION_FORM, DEFAULT_MODAL_OPTIONS} from '@app/core';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {PersonnelKeyService} from "@app/core/services/security-guard/personnel-key.service";
import {
  PersonnelKeyFormComponent
} from "@app/modules/security/personnel-key/personnel-key-form/personnel-key-form.component";
import {CommonUtils} from "@app/shared/services";

@Component({
  selector: 'personnel-key-search',
  templateUrl: './personnel-key-search.component.html',
  styleUrls: ['./personnel-key-search.component.css']
})
export class PersonnelKeySearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  currentDate = new Date();
  formConfig = {
    organizationId: [null],
    employeeId: [null],
    positionId: [null],
    isOrganizationId: [false],
    isEmployeeId: [false],
    isPositionId: [false]
  }
  defaultDomain;

  constructor(
    private personnelKeyService: PersonnelKeyService,
    private router: Router,
    private sysCatService: SysCatService,
    private modalService: NgbModal,
    private app: AppComponent
  ) {
    // super(null, CommonUtils.getPermissionCode("resource.personnelKey"));
    super();
    this.setMainService(this.personnelKeyService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW);
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
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.personnelKeyService.export(params).subscribe(res => {
      saveAs(res, 'Danh_sach_nhan_su_vi_tri_trong_yeu.xlsx');
    });
  }

  prepareImport() {
    this.router.navigate(['security-guard/personnel-key-import']);
  }

  processCreate() {
    this.router.navigate(['security-guard/personnel-key-form']);
  }

  /**
   * update lại trạng thái trường is_key_position trong work_process
   * @param item
   */
  processDeleteVTTTY(item) {
    if(item && item.workProcessId > 0){
      if(item.isCategory === 1){
        this.app.warningMessage("message.warning.notDeleteVTTY", "Cán bộ nhân viên này thuộc nhóm chức danh quản lý. Bạn không thể xóa bỏ vị trí trọng yếu!")
      }else{
        this.app.confirmDelete(null, () => {// on accepted
          this.personnelKeyService.deleteById(item.workProcessId)
              .subscribe(res => {
                if (this.personnelKeyService.requestIsSuccess(res)) {
                  this.processSearch();
                }
              });
        }, () => {// on rejected

        });
      }
    }
  }
}
