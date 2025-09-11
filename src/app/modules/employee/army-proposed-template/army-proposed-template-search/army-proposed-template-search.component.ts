import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MODAL_XL_OPTIONS } from '@app/core/app-config';
import { CommonUtils } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { HelperService } from '@app/shared/services/helper.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ArmyProposedTemplateAddComponent } from '../army-proposed-template-add/army-proposed-template-add.component';
import { ArmyProposedTemplateService } from '@app/core/services/employee/army-proposed-template.service';

@Component({
  selector: 'army-proposed-template-search',
  templateUrl: './army-proposed-template-search.component.html',
  styleUrls: ['./army-proposed-template-search.component.css']
})
export class ArmyProposedTemplateSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  listType = [];
  link: any;
  isMobileScreen: boolean = false;
  formConfig = {
    name: [''],
    type: [''],
    effectiveDate: [''],
    effectiveDateTo: [''],
    expiredDate: [''],
    expiredDateTo: [''],
    isName: [false],
    isType: [false],
    isEffectiveDate: [false],
    isEffectiveDateTo: [false],
    isExpiredDate: [false],
    isExpiredDateTo: [false]
  }
  constructor(
    private helperService: HelperService,
    private armyProposedTemplateService: ArmyProposedTemplateService,
    private app: AppComponent,
    public modalService: NgbModal,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.configArmyCondition"));
    this.formSearch = this.buildForm({}, this.formConfig);
    this.setMainService(armyProposedTemplateService);
    this.armyProposedTemplateService.getListType().subscribe(res => {
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
    if (item && item.armyProposedTemplateId > 0) {
      this.armyProposedTemplateService.findOne(item.armyProposedTemplateId)
        .subscribe(res => {
          this.activeModalUpdate(res.data);
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
    
    const modalRef = this.modalService.open(ArmyProposedTemplateAddComponent, MODAL_XL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.armyProposedTemplateService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

  prepareDelete(item) {
    if (item && item.armyProposedTemplateId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.armyProposedTemplateService.deleteById(item.armyProposedTemplateId)
          .subscribe(res => {
            if (this.armyProposedTemplateService.requestIsSuccess(res)) {
              this.helperService.reloadHeaderNotification('complete');
              this.processSearch(null);
            }
          });
      }, () => {// on rejected

      });
    }
  }

  downloadTemplate(armyProposedTemplateId) {
    const url = `${this.armyProposedTemplateService.serviceUrl}/file-template/${armyProposedTemplateId}`;
    window.location.href = url;
  }
}
