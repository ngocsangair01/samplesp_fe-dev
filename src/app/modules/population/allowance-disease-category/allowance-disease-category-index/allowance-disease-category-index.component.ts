import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { RequestReportService } from '@app/core';
import { Router } from '@angular/router';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AppComponent } from '@app/app.component';
import { DialogService } from 'primeng/api';
import {FileStorageService} from "@app/core/services/file-storage.service";
import { CommonUtils } from '@app/shared/services';
import { WelfarePolicyCategoryService } from '@app/core/services/population/welfare-policy-category.service';
@Component({
  selector: 'allowance-disease-category-index',
  templateUrl: './allowance-disease-category-index.component.html',
  styleUrls: ['./allowance-disease-category-index.component.css']
})
export class AllowanceDiseaseCategoryComponent extends BaseComponent implements OnInit {
  formConfig = {
    type: [null],
    code: [null],
    name: [null],
    isCode: [false],
    isName: [false],
    isType: [false],
  }
  typeOptions = [
    { name: 'Bệnh dài ngày', value: 1 },
    { name: 'Bệnh hiểm nghèo', value: 2 },
    { name: 'Tai nạn nặng', value: 3 },
  ]
  tableColumnsConfig = [
    {
      header: "common.table.index",
      width: "10px"
    },
    {
      name: "type",
      header: "label.allowance.disease.category.type",
      width: "50px"
    },
    {
      name: "code",
      header: "label.allowance.disease.category.code",
      width: "50px"
    },
    {
      name: "name",
      header: "label.allowance.disease.category.name",
      width: "200px"
    }
  ]

  constructor(
    private app: AppComponent,
    public dialogService: DialogService,
    private service: WelfarePolicyCategoryService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.empAllowanceRequest"));
    this.setMainService(this.service);
  }

  ngOnInit() {
    this.formSearch = this.buildForm('', this.formConfig);
    this.search()
  }


  search(event?) {
    if(this.formSearch.value.type != null){
      this.formSearch.controls['type'].setValue(this.formSearch.value.type.value);
    }else{
      this.formSearch.controls['type'].setValue(null);
    }
    this.service.searchDisease(this.formSearch.value, event).subscribe(res => {
      this.resultList = res;
    });
    this.formSearch.controls['type'].setValue(this.typeOptions.find(e => { return e.value == this.formSearch.value.type }))
  }
}
