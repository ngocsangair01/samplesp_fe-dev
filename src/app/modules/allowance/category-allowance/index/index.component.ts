import { Component, OnInit } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { CatAllowanceService } from '@app/core/services/allowance/cat-allowance.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { DialogService } from 'primeng/api';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';


@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent extends BaseComponent implements OnInit {

  formConfig = {
    name: [null],
    subject: [null],
    gender: [null],
    scope: [null],
    isReceiveManyTimes: [null],
    isName: [false],
    isSubject: [false],
    isGender: [false],
    isScope: [false],
    isShowReceiveManyTimes: [false],
  }

  subjectOptions = [
    { name: "Bản thân", value: "SELF" },
    { name: "Nhân thân", value: "RELATIVE" },
    { name: "Bản thân và nhân thân", value: "SELF_AND_RELATIVE" },
  ]

  genderOptions = [
    { name: "Tất cả", value: "ALL" },
    { name: "Nam", value: "MALE" },
    { name: "Nữ", value: "FEMALE" },
  ]

  scopeOptions = [
    { name: "Tất cả", value: "ALL" },
    { name: "Hợp đồng lao động", value: "HĐLĐ" },
  ]

  isReceiveManyTimesOptions = [
    { value: 'Y', label: 'Có' },
    { value: 'N', label: 'Không' }
  ]

  tabeColumnsConfig = [
    {
      header: "common.label.table.action",
      width: "50px"
    },
    {
      header: "common.table.index",
      width: "50px"
    },
    {
      name: "name",
      header: "common.label.name",
      width: "200px"
    },
    {
      name: "subject",
      header: "label.allowance.subject",
      width: "200px"
    },
    {
      name: "gender",
      header: "common.label.gender",
      width: "200px"
    },
    {
      name: "scope",
      header: "label.allowance.scope",
      width: "200px"
    },
    {
      name: "isReceiveManyTimes",
      header: "label.allowance.isReceiveManyTimes",
      width: "200px"
    },
  ]

  constructor(
    public dialogService: DialogService,
    private service: CatAllowanceService,
    private app: AppComponent,
  ) {
    super()
  }

  ngOnInit() {
    this.formSearch = this.buildForm('', this.formConfig);
    this.search();
  }

  search(event?){
    this.service.search(this.getParam(), event).subscribe(
      res => {
        this.resultList = res;
      }
    )
  }

  add(){
    const ref = this.dialogService.open(FormDialogComponent, {
      header: 'Thêm mới loại trợ cấp',
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

  edit(rowData){
    const index = this.isReceiveManyTimesOptions.find((item) => item.label == rowData.isReceiveManyTimes)
    rowData['isReceiveManyTimesValue'] = index.value
    const ref = this.dialogService.open(FormDialogComponent, {
      header: 'Sửa loại trợ cấp',
      width: '50%',
      baseZIndex: 2000,
      contentStyle: {"padding": "0"},
      data: rowData
    });

    ref.onClose.subscribe( (isChange) => {
      if (isChange){
        this.search()
      }

    });
  }

  deleteReport(rowData) {
    this.app.confirmMessage(null,
      () => {
        this.service.deleteById(rowData.id)
          .subscribe(res => {
              this.search();
          })
      },
      () => { }
    )

  }

  getParam() {
    let param = { ...this.formSearch.value }

    if (param.subject) {
      param.subject = param.subject.value;
    }

    if (param.gender) {
      param.gender = param.gender.value;
    }

    if (param.scope) {
      param.scope = param.scope.value;
    }
    return param;
  }

}
