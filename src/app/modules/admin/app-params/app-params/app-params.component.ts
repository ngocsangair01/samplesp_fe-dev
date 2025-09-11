import { Component, ComponentFactoryResolver, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, LARGE_MODAL_OPTIONS, REPORT_DYNAMIC_CONDITION_TYPE, SMALL_MODAL_OPTIONS, UserMenu } from '@app/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@env/environment';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { HelperService } from '@app/shared/services/helper.service';
import { AppParamsFormComponent } from '../app-params-form/app-params-form.component';
@Component({
  selector: 'app-params',
  templateUrl: './app-params.component.html',
  styleUrls: ['./app-params.component.css']
})
export class AppParamsComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  parTypeList = [];
  parTypeFilter = '';
  parType = '';

  formConfig: any = {
    parCode: [''],
    parName: [''],
    parValue: [''],
    parType: []
  };

  constructor(private appParamsService: AppParamService,
    public actr: ActivatedRoute,
    public app: AppComponent,
    public modalService: NgbModal,
    private helperService: HelperService) { 
      super(null, CommonUtils.getPermissionCode("resource.appParams"));
      this.loadParType();
      this.setMainService(appParamsService);
      this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW);
    }

  ngOnInit() {
  }

  loadParType() {
    this.appParamsService.getAllParType().subscribe(res => {
      if (res && res.data) {
        this.parTypeList = res.data;
        if (res.data.length > 0) {
          this.formSearch.get('parType').setValue(res.data[0]);
          this.processSearch();
        }
      }
    });
  }

  public changeParType(item):void {
    this.formSearch.get('parType').setValue(item);
    this.processSearch();
  }

  public additional() {
    const formAdd = FormGroup;
    formAdd['parType'] = this.formSearch.get('parType').value;
    this.activeModalAdditional(formAdd);
  }

  public activeModalAdditional(data?: any) {
    const modalRef = this.modalService.open(AppParamsFormComponent, SMALL_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.appParamsService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }
}

@Pipe({ name: 'filters' })
export class FilterPipeNew implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    searchText = searchText.trim();
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      return it.toLowerCase().includes(searchText);
    })
  }
}
