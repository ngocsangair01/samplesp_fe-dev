import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { DeathGratuityService } from '@app/core/services/employee/death-gratuity-report.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'death-gratuity-report',
  templateUrl: './death-gratuity-report.component.html'
})
export class DeathGratuityReportComponent extends BaseComponent implements OnInit {

  formExport: FormGroup;
  formConfig = {
    organizationId: ['', [ValidationService.required]],
    fromDate: ['', [Validators.required]],
    toDate: ['', [Validators.required]],
  };
  
  constructor(private deathGratuityService: DeathGratuityService) {
    super(null, CommonUtils.getPermissionCode("resource.requestDemocraticMeeting"));
    this.formExport = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
  }

  get f() {
    return this.formExport.controls;
  }

  /**
   * Báo cáo tử tuất
   */
  processReportDeathGratuity() {
    if (!CommonUtils.isValidForm(this.formExport)) {
      return;
    }
    this.deathGratuityService.processReportDeathGratuity(this.formExport.value).subscribe(
      res => {
        saveAs(res, 'Báo cáo tử tuất.xlsx');
      }
    )
  }
}
