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
  selector: 'welfare-policy-category-index',
  templateUrl: './welfare-policy-category-index.component.html',
  styleUrls: ['./welfare-policy-category-index.component.css']
})
export class WelfarePolicyCategoryComponent extends BaseComponent implements OnInit {
  formConfig = {
    type: [null],
    objectType: [null],
    code: [null],
    name: [null],
    effectiveStartDate: [null],
    isEffectiveStartDate: [false],
    isCode: [false],
    isName: [false],
    effectiveEndDate: [null],
    isEffectiveEndDate: [false],
    isType: [false],
    isObjectType: [false]
  }
  typeOptions = [
    { name: 'Phúc lợi', value: 1 },
    { name: 'Hỗ trợ', value: 2 },
    { name: 'Trợ cấp bệnh', value: 3 },
    { name: 'Trợ cấp hiếm muộn', value: 4 }
  ]
  objectTypeOptions = [
    { name: 'Bản thân', value: 1 },
    { name: 'Thân nhân', value: 2 }
  ]
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
      name: "code",
      header: "label.welfare.policy.category.code",
      width: "200px"
    },
    {
      name: "name",
      header: "label.welfare.policy.category.name",
      width: "200px"
    },
    {
      name: "type",
      header: "label.welfare.policy.category.type",
      width: "200px"
    },
    {
      name: "objectType",
      header: "label.welfare.policy.category.objectType",
      width: "200px"
    },
    {
      name: "description",
      header: "label.welfare.policy.category.description",
      width: "200px"
    },
    {
      name: "policyDocument",
      header: "label.welfare.policy.category.document",
      width: "200px"
    },
    {
      name: "effectiveStartDate",
      header: "label.welfare.policy.category.fromDate",
      width: "200px"
    },
    {
      name: "effectiveEndDate",
      header: "label.welfare.policy.category.toDate",
      width: "200px"
    },
  ]

  constructor(
    private router: Router,
    private appParamService: AppParamService,
    private requestReportService: RequestReportService,
    private app: AppComponent,
    public dialogService: DialogService,
    private service: WelfarePolicyCategoryService,
    private fileStorage: FileStorageService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.welfarePolicyCategory"));
    this.setMainService(this.service);
  }

  ngOnInit() {
    this.formSearch = this.buildForm('', this.formConfig);
    this.search()
  }

  navigateToCreatePage() {
    this.router.navigateByUrl('/population/welfare-policy-category/create');
  }

  navigateToUpdatePage(rowData?) {
    this.router.navigateByUrl(`/population/welfare-policy-category/update/${rowData.welfarePolicyCategoryId}`);
  }

  navigateToViewPage(rowData?) {
    this.router.navigateByUrl(`/population/welfare-policy-category/view/${rowData.welfarePolicyCategoryId}`);
  }

  search(event?) {
    if(this.formSearch.value.objectType != null){
      this.formSearch.controls['objectType'].setValue(this.formSearch.value.objectType.value);
    }else{
      this.formSearch.controls['objectType'].setValue(null);
    }
    if(this.formSearch.value.type != null){
      this.formSearch.controls['type'].setValue(this.formSearch.value.type.value);
    }else{
      this.formSearch.controls['type'].setValue(null);
    }
    if(this.formSearch.value.effectiveStartDate != null && this.formSearch.value.effectiveEndDate != null
        && this.formSearch.value.effectiveStartDate > this.formSearch.value.effectiveEndDate){
      this.app.warningMessage('',"Ngày hiệu lực đến phải lớn hơn ngày hiệu lực từ !");
      return;
    }
    this.service.search(this.formSearch.value, event).subscribe(res => {
      this.resultList = res;
    });
    this.formSearch.controls['objectType'].setValue(this.objectTypeOptions.find(e => { return e.value == this.formSearch.value.objectType }));
    this.formSearch.controls['type'].setValue(this.typeOptions.find(e => { return e.value == this.formSearch.value.type }))
  }

  deleteWelfarePolicy(rowData) {
    this.app.confirmDelete(null,
      () => {
        this.service.deleteById(rowData.welfarePolicyCategoryId)
          .subscribe(res => {
              this.search();
          })
      },
      () => { }
    )
  }


}
