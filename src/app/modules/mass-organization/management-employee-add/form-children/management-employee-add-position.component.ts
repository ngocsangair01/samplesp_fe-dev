import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormArray, FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTION_FORM } from '@app/core';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { SortEvent } from 'primeng/api';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { MassPositionService } from '@app/core/services/mass-organization/mass-position.service';
import * as moment from 'moment';

@Component({
  selector: 'management-employee-add-position',
  templateUrl: './management-employee-add-position.component.html',
  styleUrls: ['./management-employee-add-position.component.css']
})
export class ManagementEmployeeAddPositionComponent extends BaseComponent implements OnInit {
  formPosition: FormArray;
  numIndex = 1;
  branch: any;
  bo: any;
  filterCondition: string;
  orderField: string;
  view: boolean;
  nameData: string;

  @Output() onRefresh: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private app: AppComponent,
    public actr: ActivatedRoute,
    public appParamService: AppParamService,
    private massPositionService: MassPositionService
  ) {
    super(actr, CommonUtils.getPermissionCode("resource.massMember"), ACTION_FORM.INSERT);
    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 2) {
      if (subPaths[2] === 'women') {
        this.branch = 1;
        this.nameData = 'women';
      }
      if (subPaths[2] === 'youth') {
        this.branch = 2;
        this.nameData = 'youth';
      }
      if (subPaths[2] === 'union') {
        this.branch = 3;
        this.nameData = 'union'
      }
    }
    this.filterCondition = " AND obj.branch = " + this.branch;
    this.buildFormPosition();
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 4) {
      if (subPaths[4] == 'view') {
        this.view = true;
      } else {
        this.view = false;
      }
    }
    this.orderField = "obj.code, obj.name";
  }

  /**
   * initPositionForm: form Parent call formChild
   */
  public initPositionForm(listData?: any) {
    this.buildFormPosition(listData);
  }

  /**
   * makeDefaultForm
   */
  private makeDefaultForm(): FormGroup {
    const group = {
      employeeId: [null],
      branch: [this.branch],
      massMemberId: [null],
      massOrganizationId: [null, ValidationService.required],
      massPositionId: [null, ValidationService.required],
      effectiveDate: [null, ValidationService.required],
      expiredDate: [null],
      isHighest: [false],
      sortOrder: [this.numIndex]
    };
    if (this.view) {
      return this.buildForm({}, group, ACTION_FORM.VIEW);
    } else {
      return this.buildForm(
        {},
        group,
        ACTION_FORM.UPDATE,
        [ValidationService.notAffter('effectiveDate', 'expiredDate', 'generalStandard.expiredDate')]
      );
    }
  }

  public buildFormPosition(listData?: any) {
    const controls = new FormArray([]);
    if ((!listData || listData.length === 0) && !this.view) {
      const group = this.makeDefaultForm();
      controls.push(group);
    } else {
      for (const i in listData) {
        const param = listData[i];
        const group = this.makeDefaultForm();
        group.patchValue(param);
        controls.push(group);
        this.numIndex++;
      }
    }

    this.formPosition = controls;
  }

  /**
   * addGroup
   * param index
   * param item
   */
  public add() {
    const controls = this.formPosition as FormArray;
    if (controls.length > 0) {
      this.numIndex++;
    }
    controls.insert(controls.length, this.makeDefaultForm());
    this.sortDataTable();
  }

  /**
   * removeGroup
   * param index
   * param item
   */
  public remove(index: number) {
    const controls = this.formPosition as FormArray;
    this.numIndex--;
    controls.removeAt(index);
    this.sortDataTable();
  }

  public goUp(item: FormGroup) {
    const idx = parseInt(item.controls['sortOrder'].value) - 1;
    for (const ctrl of this.formPosition.controls) {
      const ctrTmp = ctrl as FormGroup;
      if (parseInt(ctrTmp.controls['sortOrder'].value) === idx) {
        ctrTmp.controls['sortOrder'].setValue(idx + 1);
      }
    }
    item.controls['sortOrder'].setValue(idx);
    this.sortDataTable();
  }

  public goDown(item: FormGroup) {
    const idx = parseInt(item.controls['sortOrder'].value) + 1;
    for (const ctrl of this.formPosition.controls) {
      const ctrTmp = ctrl as FormGroup;
      if (parseInt(ctrTmp.controls['sortOrder'].value) === idx) {
        ctrTmp.controls['sortOrder'].setValue(idx - 1);
      }
    }
    item.controls['sortOrder'].setValue(idx);
    this.sortDataTable();
  }

  private sortDataTable() {
    const _event = {
      data: this.formPosition.controls,
      field: 'sortOrder',
      mode: 'single',
      order: 1
    };
    this.customSort(_event);
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const value1 = data1.value[event.field];
      const value2 = data2.value[event.field];
      let result = null;

      if (value1 == null && value2 != null) {
        result = -1;

      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      }
      return (event.order * result);
    });
  }

  public onChangeMassOrg(data, massOrgSelector) {
    if (data.massOrganizationId) {
      const currentDate = moment(new Date(), 'DD/MM/YYYY');
      if (data.expritedDate === null) {
        const effectiveDate = moment(new Date(data.effectiveDate), 'DD/MM/YYYY');
        if (effectiveDate.isAfter(currentDate)) {
          this.app.errorMessage('partymember.partyOrganizationNotEffectYet');
          massOrgSelector.delete();
        }
      } else {
        const expiredDate = moment(new Date(data.expritedDate), 'DD/MM/YYYY');
        if (expiredDate.isSameOrBefore(currentDate)) {
          this.app.errorMessage('partymember.partyOrganizationExpired');
          massOrgSelector.delete();
        }
      }
    }
  }

  setHighest(item) {
    if (item.controls.isHighest.value == 1) { // Neu set highest thi cap nhat truong isHighest cua cac ban ghi con lai = 0
      for (const i of this.formPosition.controls) {
        if (i['controls'].massOrganizationId.value == item.controls.massOrganizationId.value && i['controls'].massPositionId.value != item.controls.massPositionId.value) {
          i['controls'].isHighest.setValue(0);
        }
      }
    }
  }

  onChangePosition(event, item) {
    if (event.selectField) {
      this.massPositionService.findOne(event.selectField).subscribe(res => {
        item.controls.isHighest.setValue(res.data.isHighestPosition);
        this.setHighest(item);
      });
    }
  }
}