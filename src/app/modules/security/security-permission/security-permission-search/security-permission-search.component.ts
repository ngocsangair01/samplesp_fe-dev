import { Component, OnInit } from '@angular/core';
import { SecurityPermissionService } from '@app/core/services/security/security-permission.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'security-permission-search',
  templateUrl: './security-permission-search.component.html',
})
export class SecurityPermissionSearchComponent extends BaseComponent implements OnInit {

  constructor(
    private securityPermissionService: SecurityPermissionService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.securityProtection"));
    this.setMainService(securityPermissionService);
    this.formSearch = this.buildForm({}, {});
    this.processSearch(null);
  }

  ngOnInit() {
  }

  processExport() {
    this.securityPermissionService.processExport().subscribe(
      res => {
        saveAs(res, 'ctct_danh_sach_phan_quyen_vao_he_thong_BVAN.xlsx');
      }
    );
  }
}
