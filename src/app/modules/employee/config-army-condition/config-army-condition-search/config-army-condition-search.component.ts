import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MODAL_XL_OPTIONS } from '@app/core/app-config';
import { CommonUtils } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { HelperService } from '@app/shared/services/helper.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ConfigArmyConditionService } from '@app/core/services/employee/config-army-condition.service';
import { ConfigArmyConditionAddComponent } from '../config-army-condition-add/config-army-condition-add.component';
import { EmpArmyProposedService } from '@app/core/services/employee/emp-army-proposed.service';

@Component({
  selector: 'config-army-condition-search',
  templateUrl: './config-army-condition-search.component.html',
  styleUrls: ['./config-army-condition-search.component.css']
})
export class ConfigArmyConditionSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  listType = [];
  link: any;
  isMobileScreen: boolean = false;
  formConfig = {
    type: [''],
    name: [''],
    code: [''],
    isType: [false],
    isCode: [false],
    isName: [false],
  }
  constructor(
    private helperService: HelperService,
    private configArmyConditionService: ConfigArmyConditionService,
    private empArmyProposedService: EmpArmyProposedService,
    private app: AppComponent,
    public modalService: NgbModal,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.configArmyCondition"));
    this.formSearch = this.buildForm({}, this.formConfig);
    this.setMainService(configArmyConditionService);
    this.empArmyProposedService.getListType().subscribe(res => {
      this.listType = res.data;
    })
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    this.processSearch();
  }

  get f() {
    return this.formSearch.controls;
  }

  /**
   * prepareUpdate
   * @param item 
   */
  public prepareAddOrUpdate(item?: any) {
    if (item && item.configArmyConditionId > 0) {
      this.configArmyConditionService.findOne(item.configArmyConditionId)
        .subscribe(res => {
          this.activeModalUpdate(res.data.type);
        });
    } else {
      this.activeModalUpdate();
    }
  }
  
  /**
   * show model
   * data
   */
  private activeModalUpdate(data?: any) {
    
    const modalRef = this.modalService.open(ConfigArmyConditionAddComponent, MODAL_XL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.configArmyConditionService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

  prepareDelete(item) {
    if (item && item.configArmyConditionId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.configArmyConditionService.deleteById(item.configArmyConditionId)
          .subscribe(res => {
            if (this.configArmyConditionService.requestIsSuccess(res)) {
              this.helperService.reloadHeaderNotification('complete');
              this.processSearch(null);
            }
          });
      }, () => {// on rejected

      });
    }
  }
}
