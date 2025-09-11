
import { ActivatedRoute } from '@angular/router';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { HelperService } from '@app/shared/services/helper.service';
import { AppComponent } from '@app/app.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ArmyProposedTemplateService } from '@app/core/services/employee/army-proposed-template.service';
import { EmpArmyProposedReportService } from '@app/core/services/employee/emp-army-proposed-report.service';

@Component({
  selector: 'emp-army-proposed-export',
  templateUrl: './emp-army-proposed-export.component.html',
  styleUrls: ['./emp-army-proposed-export.component.css']
})
export class EmpArmyProposedExportComponent extends BaseComponent implements OnInit {


  reportForm: any;
  formSave: FormGroup;
  formSearch: FormGroup;
  listConfig: any;
  isUpdate: boolean = false;
  isInsert: boolean = false;
  selectedGop: any;
  isCheck = false;
  constructor(
    public activeModal: NgbActiveModal,
    private empArmyProposedReportService: EmpArmyProposedReportService,
    private armyProposedTemplateService: ArmyProposedTemplateService,
    public actr: ActivatedRoute,
    public app: AppComponent,
    private helperService: HelperService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.empArmyProposed"));
    this.setMainService(empArmyProposedReportService);
  }

  ngOnInit() {
    this.armyProposedTemplateService.findByType(this.reportForm, this.formSearch.get('year').value).subscribe(res => {
      this.listConfig = res.data;
    });
   }

  // quay lai
  public goBack() {
    this.activeModal.close();
  }

  // them moi or sua
  public exportConfigTemplate() {
    if (CommonUtils.isNullOrEmpty(this.selectedGop)) {
      this.isCheck = true;
      setTimeout(() => {
        this.isCheck = false
      }, 3000);
      return;
    }
    const data:any = {...this.formSearch.value};
    data.listArmyProposedTemplateId= this.selectedGop.map(el => el.armyProposedTemplateId);
    data.reportForm = this.reportForm;
    // const data = {
    //   listArmyProposedTemplateId: this.selectedGop.map(el => el.armyProposedTemplateId),
    // }

    this.empArmyProposedReportService.exportConfigTemplate(data);
  }

}
