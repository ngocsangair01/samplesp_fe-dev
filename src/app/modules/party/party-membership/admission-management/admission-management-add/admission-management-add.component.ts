import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FileControl } from '@app/core/models/file.control';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { MultiFileChooserV2Component } from '@app/shared/components/file-chooser/multi-file-chooser-v2.component';
import { ValidationService } from '@app/shared/services';

@Component({
  selector: 'admission-management-add',
  templateUrl: './admission-management-add.component.html',
  styleUrls: ['./admission-management-add.component.css']
})
export class AdmissionManagementAddComponent extends BaseComponent implements OnInit {

  @ViewChild('multiFileAttachedChooser') multiFileAttachedChooser: MultiFileChooserV2Component;

  formGroup: FormGroup;

  formConfig = {
    admissionBatchName: [null, ValidationService.required], // Tên đợt kết nạp
    admissionDate: [null, ValidationService.required], // Ngày kết nạp
    deadlineDate: [null, ValidationService.required], // Thời hạn hoàn thành hồ sơ
    partyOrganizationId: [null],
    createdDate: [null],
    fileAttachedList: [],
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    super();
    this.formGroup = this.fb.group({
      ...this.formConfig,
      informationFormName: this.fb.array([])
    });
    this.addInformationForm();
    const filesAttachedControl = new FileControl(null);
    this.formGroup.addControl('fileAttachedList', filesAttachedControl);

  }

  ngOnInit() {
  }

  // Getter
  get informationFormName(): FormArray {
    return this.formGroup.get('informationFormName') as FormArray;
  }

  addInformationForm() {
    const group = this.fb.group({
      formName: ['', ValidationService.required],
      requiredProfile: [false],
      fileImport: [null, ValidationService.required]
    });
    this.informationFormName.push(group);
  }

  removeItem(index) {
    this.informationFormName.removeAt(index);
  }

  get f() {
    return this.formGroup.controls;
  }

  previous() {
    this.router.navigateByUrl('/party-organization/admission_management');
  }

  save() { }

}
