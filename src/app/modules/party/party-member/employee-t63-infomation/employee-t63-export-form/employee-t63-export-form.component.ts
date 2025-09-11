import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { EmployeeT63InfomationService } from '@app/core/services/employee/employee_t63_infomation.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'employee-t63-export-form',
  templateUrl: './employee-t63-export-form.component.html',
  styleUrls: ['./employee-t63-export-form.component.css']
})
export class EmployeeT63ExportFormComponent extends BaseComponent implements OnInit {
  formExport: FormGroup;
  formConfig = {
    employeeId: [null, [Validators.required]],
    suggest: [null, [Validators.maxLength(73)]],
  };

  constructor(
    private employeeT63InfomationService: EmployeeT63InfomationService,
    public activeModal: NgbActiveModal
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeT63Information"));
    this.formExport = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
  }

  get f() {
    return this.formExport.controls;
  }

  setFormValue(employeeId) {
    this.formExport = this.buildForm({ employeeId: employeeId }, this.formConfig);
  }

  processExportReport() {
    if (!CommonUtils.isValidForm(this.formExport)) {
      return;
    }
    this.employeeT63InfomationService.export(this.formExport.value).subscribe(
      res => {
        saveAs(res, 'ctct_bao_cao_tom_tat_ly_lich.docx');
        this.activeModal.close();
      }
    );
  }
}
