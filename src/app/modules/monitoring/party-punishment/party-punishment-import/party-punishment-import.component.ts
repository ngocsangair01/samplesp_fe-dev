import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { PartyPunishmentService } from '@app/core/services/monitoring/party-punishment.service';

@Component({
  selector: 'party-punishment-import',
  templateUrl: './party-punishment-import.component.html'
})
export class PartyPunishmentImportComponent extends BaseComponent implements OnInit {

  formImport: FormGroup;
  formConfig = {
    decideLevelId: ['', [ValidationService.required]]
  };
  public dataError: any;
  constructor(
    private app: AppComponent,
    private router: Router,
    public actr: ActivatedRoute,
    public partyPunishmentService: PartyPunishmentService
  ) {
    super(actr, CommonUtils.getPermissionCode("resource.partyPunishment"));
    this.formImport = this.buildForm({}, this.formConfig);
    this.formImport.addControl('fileImport', new FileControl(null, ValidationService.required));
  }

  ngOnInit() {
  }

  get f() {
    return this.formImport.controls;
  }

  processImport() {
    this.dataError = null;
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.partyPunishmentService.processImport(this.formImport.value)
      .subscribe(res => {
        if (res.type == 'SUCCESS') {
          this.dataError = null;
          this.goBack();
        } else if (res.type == 'ERROR') {
          this.dataError = res.data;
        }
      });
    }, () => {
      // on rejected
    });
  }

  processDownloadTemplate() {
    this.partyPunishmentService.downloadTemplateImport()
    .subscribe(res => {
      saveAs(res, 'Template_BM_KyLuatToChucDang.xls');
    });
  }

  public goBack() {
    this.router.navigate(['/monitoring-inspection/party-punishment-management']);
  }
}
