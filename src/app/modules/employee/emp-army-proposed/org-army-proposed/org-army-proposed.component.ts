import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM } from '@app/core';
import { EmpArmyProposedService } from '@app/core/services/employee/emp-army-proposed.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'org-army-proposed',
  templateUrl: './org-army-proposed.component.html',
  styleUrls: ['./org-army-proposed.component.css']
})
export class OrgArmyProposedComponent extends BaseComponent implements OnInit {

  formSave: any;

  formConfig = {
    organizationId: [''],
    signerPosition: ['Bí thư', Validators.required],
    dateMeeting: ['', Validators.required],
    year: ['']
  }

  constructor(private router: Router,
    public activeModal: NgbActiveModal,
    private empArmyProposedService: EmpArmyProposedService,
    public actr: ActivatedRoute,
    public app: AppComponent,
    private helperService: HelperService) { 
    super(null, CommonUtils.getPermissionCode("resource.appParams"));
    this.setMainService(empArmyProposedService);
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
  }

  public processSign(event?): void {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }

    this.empArmyProposedService.checkSign(this.formSave.get('organizationId').value).subscribe(res => {
      const params = this.formSave ? this.formSave.value : null;
      if (res.data > 0) {
        this.app.confirmMessage("label.empArmyProposed.confirmSign", () => {// on accepted
          params.isUpdateStatus = true;
          this.empArmyProposedService.processSign(params, event).subscribe(res => {
            this.activeModal.close();
            if (res.data.signDocumentId > 0) {
              this.activeModal.close();
              this.router.navigate(["/voffice-signing/emp-army-proposed/", res.data.signDocumentId]);
            }
          });
        }, () => {// on rejected
          this.activeModal.close();
        });
      } else {
        this.empArmyProposedService.processSign(params, event).subscribe(res => {
          if (res.data.signDocumentId > 0) {
            this.activeModal.close();
            this.router.navigate(["/voffice-signing/emp-army-proposed/", res.data.signDocumentId]);
          }
        });
      }
    })

  }

  // quay lai
  public goBack() {
    this.activeModal.close()
  }

  get f() {
    return this.formSave.controls;
  }

  public setFormValue(data?: any) {
    if (data) {
      this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.VIEW);
    }
  }
}
