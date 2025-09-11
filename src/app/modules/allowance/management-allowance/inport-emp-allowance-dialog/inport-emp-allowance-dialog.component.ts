import { Component, OnInit } from '@angular/core';
import { BaseControl } from '@app/core/models/base.control';
import { DynamicDialogConfig } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/api';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { DynamicApiService } from '@app/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup } from '@angular/forms';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { CatAllowanceService } from '@app/core/services/allowance/cat-allowance.service';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import { AllowanceService } from '@app/core/services/allowance/allowance.service';

@Component({
  templateUrl: './inport-emp-allowance-dialog.component.html',
})
export class InportEmpAllowanceDialogComponent extends BaseComponent implements OnInit {

  formConfig = {
    catAllowance: [null, ValidationService.required],
    file: [null, ValidationService.required],
  }

  form: FormGroup;
  catAllowanceOptions;


  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private service: AllowanceService,
    private dynamicApiService: DynamicApiService,
    private fileStorageService : FileStorageService,
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.buildForm('', this.formConfig)
    this.dynamicApiService.getByCode('get-cat-allowance')
      .subscribe(res => {
        this.catAllowanceOptions = res;
      })
  }
  downloadTemplate(){
    this.service.downloadTemplate()
    .subscribe(res => {
      saveAs(res, "template.xls")
    })
  }

  save() {
    if (CommonUtils.isValidForm(this.form)) {
      let data ={
        catAllowanceId: this.form.value.catAllowance.id,
        file: this.form.value.file
      }
      this.service.import(data)
      .subscribe(res => {
        if (res.type == "ERROR"){
          this.service.downloadErrorFile(res.data).subscribe(res => {
            saveAs(res, "Lỗi.xls")
          })
        }else{
          if (res.type == "SUCCESS")
            this.ref.close(true)
        }
      })

    }
  }

}
