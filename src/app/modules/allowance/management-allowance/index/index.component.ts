import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { DynamicApiService } from '@app/core';
import { AllowanceService } from '@app/core/services/allowance/allowance.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { DialogService } from 'primeng/api';
import { InportEmpAllowanceDialogComponent } from '../inport-emp-allowance-dialog/inport-emp-allowance-dialog.component';


@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent extends BaseComponent implements OnInit {

  formConfig = {
    fromYear: [null],
    toYear: [null],
    org: [null],
    catAllowance: [null],
    employee: [null],
    isYear: [false],
    isOrg: [false],
    isCatAllowance: [false],
    isEmployee: [false]
  }

  catAllowanceOptions

  tableColumnsConfig = [
    {
      header: "common.label.table.action",
      width: "50px"
    },
    {
      header: "common.table.index",
      width: "50px"
    },
    {
      name: "year",
      header: "label.allowance.year",
      width: "200px"
    },
    {
      name: "employeeCode",
      header: "common.label.partymembersCode",
      width: "200px"
    },
    {
      name: "employeeName",
      header: "PartyMemberBO.memberName",
      width: "200px"
    },
    {
      name: "gender",
      header: "app.curriculumVitae.gender",
      width: "200px"
    },
    {
      name: "subject",
      header: "label.allowance.subject",
      width: "200px"
    },
    {
      name: "positionName",
      header: "common.label.employee.position",
      width: "200px"
    },
    {
      name: "orgName",
      header: "protectsecurity.curriculumvitaesecurity.table.dvct",
      width: "200px"
    },
    {
      name: "allowanceName",
      header: "label.allowance.policy",
      width: "200px"
    },
    {
      name: "allowanceYear",
      header: "label.allowance.year",
      width: "200px"
    },
    {
      name: "decisionDate",
      header: "label.allowance.time",
      width: "200px"
    },
    {
      name: "totalAllowance",
      header: "label.allowance.quota",
      width: "200px"
    },
  ]

  tableColumnsConfig2 = [
    {
      header: "common.label.table.action",
      width: "50px"
    },
    {
      header: "common.table.index",
      width: "50px"
    },
    {
      name: "year",
      header: "label.allowance.year",
      width: "200px"
    },
    {
      name: "employeeCode",
      header: "common.label.partymembersCode",
      width: "200px"
    },
    {
      name: "employeeName",
      header: "PartyMemberBO.memberName",
      width: "200px"
    },
    {
      name: "gender",
      header: "app.curriculumVitae.gender",
      width: "200px"
    },
    {
      name: "subject",
      header: "label.allowance.subject",
      width: "200px"
    },
    {
      name: "positionName",
      header: "common.label.employee.position",
      width: "200px"
    },
    {
      name: "orgName",
      header: "protectsecurity.curriculumvitaesecurity.table.dvct",
      width: "200px"
    },
    {
      name: "relationship",
      header: "label.allowance.relationship",
      width: "200px"
    },
    {
      name: "nameOfRelative",
      header: "label.allowance.nameOfRelative",
      width: "200px"
    },
    {
      name: "allowanceName",
      header: "label.allowance.policy",
      width: "200px"
    },
    {
      name: "allowanceYear",
      header: "label.allowance.year",
      width: "200px"
    },
    {
      name: "decisionDate",
      header: "label.allowance.time",
      width: "200px"
    },
    {
      name: "totalAllowance",
      header: "label.allowance.quota",
      width: "200px"
    },
  ]

  resultListOfSelf;
  resultListOfRelative;

  constructor(
    public dialogService: DialogService,
    private service: AllowanceService,
    private app: AppComponent,
    private router: Router,
    private dynamicApiService: DynamicApiService,
  ) {
    super()
  }

  ngOnInit() {
    this.formSearch = this.buildForm('', this.formConfig);
    this.search();
    this.dynamicApiService.getByCode('get-cat-allowance')
    .subscribe(res => {
      this.catAllowanceOptions = res;
    })
  }

  search(event?){
    let paramOfSelf = this.getParam();
    let paramOfRelative = this.getParam();
    paramOfSelf.isSelf = 1
    paramOfRelative.isSelf = 0
    this.service.search(paramOfSelf, event).subscribe(
      res => {
        this.resultListOfSelf = res;
      }
    )

    this.service.search(paramOfRelative, event).subscribe(
      res => {
        this.resultListOfRelative = res;
      }
    )
  }

  import(){
    const ref = this.dialogService.open(InportEmpAllowanceDialogComponent, {
      header: 'Import trợ cấp',
      width: '50%',
      baseZIndex: 2000,
      contentStyle: {"padding": "0"},
    });

    ref.onClose.subscribe( (isChange) => {
      if (isChange){
        this.search()
      }

    });
  }

  goToCreateAllowance(data){
    this.router.navigateByUrl('/allowance/management/create');
  }

  edit(rowData){
    this.router.navigateByUrl('/allowance/management/' + rowData.empAllowanceId);
  }

  deleteEmpAllowance(rowData) {
    this.app.confirmMessage(null,
      () => {
        this.service.deleteById(rowData.empAllowanceId)
          .subscribe(res => {
              this.search();
          })
      },
      () => { }
    )

  }

  getParam() {
    let param:any = {}
    param.fromYear = this.formSearch.value.fromYear
    param.toYear = this.formSearch.value.toYear
    param.orgId = this.formSearch.value.org
    if (this.formSearch.value.catAllowance){
      param.catAllowanceId = this.formSearch.value.catAllowance.id
    }
    if(this.formSearch.value.employee){
      param.employeeCode = this.formSearch.value.employee.employeeCode
    }
    return param;
  }

}
