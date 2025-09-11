import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import {
  ACTION_FORM,
} from '@app/core';
import { AppComponent } from '@app/app.component';
import { DialogService } from 'primeng/api';
import { HelperService } from '@app/shared/services/helper.service';
import { Router } from '@angular/router';
import { TranslationService } from 'angular-l10n';
import { EmpThoroughContentService } from '@app/core/services/thorough-content/emp-thorough-content.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'unconfirmed-employee-list',
  templateUrl: './unconfirmed-employee-list.component.html',
  styleUrls: ['./unconfirmed-employee-list.component.css']
})
export class UnconfirmedEmployeeListComponent extends BaseComponent implements OnInit {
  viewMode;
  formGroup: FormGroup;
  header = "Danh sách chưa xác nhận";
  isCreate = false;
  isMobileScreen: boolean = false;

  formSearch: FormGroup;
  formSearchConfig = {
    thoroughContentId: [null],
    organizationId: [null],
    status: [{ id: 0, name: this.translation.translate('label.progress-track.status-0') }],

    first: [0],
    limit: [10],
  };

  statusOptions = [{ id: 0, name: this.translation.translate('label.progress-track.status-0') },
  { id: 1, name: this.translation.translate('label.progress-track.status-1') }];

  tableColumnsConfig = [
    {
      header: "common.table.index",
      width: "50px"
    },
    {
      name: "employeeCode",
      header: "common.label.partymembersCode",
      width: "200px"
    },
    {
      name: "fullName",
      header: "common.label.employeeName",
      width: "200px"
    },
    {
      name: "partyOrganizationName",
      header: "common.label.unit",
      width: "200px"
    },
  ];

  constructor(
    private app: AppComponent,
    public dialogService: DialogService,
    public helperService: HelperService,
    private router: Router,
    private service: EmpThoroughContentService,
    public translation: TranslationService,
    public modalService: NgbModal
  ) {
    super();
    this.setMainService(this.service);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;

    this.formSearch = this.buildForm({}, this.formSearchConfig, ACTION_FORM.VIEW);

    if (history.state.thoroughContentId && history.state.organizationId) {
      this.formSearch.get('thoroughContentId').setValue(history.state.thoroughContentId);
      this.formSearch.get('organizationId').setValue(history.state.organizationId);

      this.search();
    }
  }

  ngOnInit() {
  }

  previous() {
    this.router.navigateByUrl('/employee/progress-track');
  }

  get f() {
    return this.formGroup.controls;
  }

  cloneFormGroup(formGroup: FormGroup): FormGroup {
    const copiedControls = {};
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.controls[controlName];
      copiedControls[controlName] = new FormControl(control.value);
    });
    return new FormGroup(copiedControls);
  }

  search(event?) {
    if(event){
      this.formSearch.value['first'] = event.first;
      this.formSearch.value['limit'] = event.rows;
    }
    this.service.search(this.formSearch.value, event).subscribe(res => {
      this.resultList = res;
    });
  }
}
