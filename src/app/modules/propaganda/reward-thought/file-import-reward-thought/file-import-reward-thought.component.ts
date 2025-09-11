import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute} from '@angular/router';
import { FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { RewardThoughtService } from '@app/core/services/propaganda/reward-thought.service';

@Component({
  selector: 'file-import-reward-thought.component',
  templateUrl: './file-import-reward-thought.component.html'
})
export class RewardThoughtImportManageComponent extends BaseComponent implements OnInit {
  formImport: FormGroup;
  formConfig = {
    fileImport: [null, ValidationService.required]
  };
  public dataError: any;
  constructor(
    public activeModal: NgbActiveModal,
    private app: AppComponent,
    public actr: ActivatedRoute,
    private rewardThoughtService: RewardThoughtService
  ) {
    super();
    this.formImport = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {}
  get f() {
    return this.formImport.controls;
  }
  processDownloadTemplate() {
    this.rewardThoughtService.downloadTemplateImport().subscribe(res => {
      saveAs(res, 'Template_ImportLoaiBieuHienTuTuong.xls');
    });
  }
  processImport() {
    this.dataError = null;
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.rewardThoughtService.processImport(this.formImport.value).subscribe(res => {
        if (res.type == 'SUCCESS') {
          this.dataError = null;
          this.activeModal.close(res)
        } else if (res.type == 'ERROR') {
          this.dataError = res.data;
        }
      })
    }, () => {
      // on rejected
    });
  }
}
