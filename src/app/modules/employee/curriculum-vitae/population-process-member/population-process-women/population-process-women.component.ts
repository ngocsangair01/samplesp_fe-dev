import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormArray, FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTION_FORM, DEFAULT_MODAL_OPTIONS } from '@app/core';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { SortEvent } from 'primeng/api';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { MassPositionService } from '@app/core/services/mass-organization/mass-position.service';
import * as moment from 'moment';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { ManagementEmployeeService } from '@app/core/services/mass-organization/management-employee.service';
import { PopulationMemberProcessFormComponent } from '../population-member-process-form/population-member-process-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'population-process-women',
  templateUrl: './population-process-women.component.html',
  styleUrls: ['./population-process-women.component.css']
})
export class PopulationProcessWomenComponent extends BaseComponent implements OnInit {
  employeeId;
  formPositionWomen: FormArray;
  numIndexWomen = 1;
  filterConditionWomen: string;
  orderField: string;
  view: boolean = true;
  hidePositionWomen: boolean = false;
  
  @Output() onRefresh: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private app: AppComponent,
    public actr: ActivatedRoute,
    public appParamService: AppParamService,
    private massPositionService: MassPositionService,
    private employeeResolver: EmployeeResolver,
    private managementEmployeeService: ManagementEmployeeService,
    private modalService: NgbModal
  ) {
    super(actr, CommonUtils.getPermissionCode("resource.massMember"), ACTION_FORM.INSERT);
    this.filterConditionWomen = " AND obj.branch = 1";
    this.orderField = "obj.code, obj.name";
    this.buildFormPositionWomen();
  }
  
  ngOnInit() {
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
          this.employeeId = data;
          this.setFormValue(this.employeeId);
        }
      }
    );
  }
  
  /**
   * initPositionForm: form Parent call formChild
   */
  public initPositionForm(listData?: any) {
    this.buildFormPositionWomen(listData);
  }

  /**
   * makeDefaultForm
   */
  private makeDefaultFormWomen(): FormGroup {
    const group = {
      employeeId: [this.employeeId],
      branch: 1,
      massMemberId: [null],
      massOrganizationId: [null, ValidationService.required],
      massPositionId: [null, ValidationService.required],
      effectiveDate: [null, ValidationService.required],
      expiredDate: [null],
      isHighest: [false],
      sortOrder: [this.numIndexWomen]
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

  public buildFormPositionWomen(listData?: any) {
    const controls = new FormArray([]);
    if ((!listData || listData.length === 0) && !this.view) {
      const group = this.makeDefaultFormWomen();
      controls.push(group);
    } else {
      for (const i in listData) {
        const param = listData[i];
        const group = this.makeDefaultFormWomen();
        // if (param && group) {
          group.patchValue(param);
          controls.push(group);
          this.numIndexWomen++;
        // }
      }
    }

    this.formPositionWomen = controls;
  }

  prepareSaveOrUpdate(item: any) {
    if (item && item.value && item.value.massMemberId) {
      this.managementEmployeeService.findOne(item.value.massMemberId)
        .subscribe(res => {
          if (res.data) {
            this.activeModal(res.data);
          }
        });
    }
  }

  processDeleteProcess(item: any) {
    if (item && item.value && item.value.massMemberId) {
      this.managementEmployeeService.deleteById(item.value.massMemberId)
        .subscribe(res => {
          if (res) {
            this.setFormValue(this.employeeId);
          }
        });
    }
  }

  public setFormValue(data?: any) {
    if (data && data > 0) {
      this.managementEmployeeService.getEmployee(data)
        .subscribe(res => {
          this.buildFormPositionWomen(res.data);
        });

      this.managementEmployeeService.getDataDetail(1, data)
        .subscribe(res => {
          this.initPositionForm(res.data);
        });
    }
  }

  prepareInsertPopulationProcess() {
    this.activeModal({ employeeId: this.employeeId, branch: 1 });
  }

  private activeModal(data?: any) {
    const modalRef = this.modalService.open(PopulationMemberProcessFormComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      this.setFormValue(this.employeeId);
    });
  }


  /**
   * addGroup
   * param index
   * param item
   */
  public add() {
    const controls = this.formPositionWomen as FormArray;
    if (controls.length > 0) {
      this.numIndexWomen++;
    }
    controls.insert(controls.length, this.makeDefaultFormWomen());
  }

  /**
   * removeGroup
   * param index
   * param item
   */
  public remove(index: number) {
    const controls = this.formPositionWomen as FormArray;
    this.numIndexWomen--;
    controls.removeAt(index);
    
  }

  // public goUp(item: FormGroup) {
  //   const idx = parseInt(item.controls['sortOrder'].value) - 1;
  //   for (const ctrl of this.formPositionWomen.controls) {
  //     const ctrTmp = ctrl as FormGroup;
  //     if (parseInt(ctrTmp.controls['sortOrder'].value) === idx) {
  //       ctrTmp.controls['sortOrder'].setValue(idx + 1);
  //     }
  //   }
  //   item.controls['sortOrder'].setValue(idx);
  //   this.sortDataTable();
  // }

  // public goDown(item: FormGroup) {
  //   const idx = parseInt(item.controls['sortOrder'].value) + 1;
  //   for (const ctrl of this.formPositionWomen.controls) {
  //     const ctrTmp = ctrl as FormGroup;
  //     if (parseInt(ctrTmp.controls['sortOrder'].value) === idx) {
  //       ctrTmp.controls['sortOrder'].setValue(idx - 1);
  //     }
  //   }
  //   item.controls['sortOrder'].setValue(idx);
  //   this.sortDataTable();
  // }

  // private sortDataTable() {
  //   const _event = {
  //     data: this.formPositionWomen.controls,
  //     field: 'sortOrder',
  //     mode: 'single',
  //     order: 1
  //   };
  //   this.customSort(_event);
  // }

  // customSort(event: SortEvent) {
  //   event.data.sort((data1, data2) => {
  //     const value1 = data1.value[event.field];
  //     const value2 = data2.value[event.field];
  //     let result = null;

  //     if (value1 == null && value2 != null) {
  //       result = -1;

  //     } else if (value1 != null && value2 == null) {
  //       result = 1;
  //     } else if (value1 == null && value2 == null) {
  //       result = 0;
  //     } else {
  //       result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
  //     }
  //     return (event.order * result);
  //   });
  // }
}
