import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, DEFAULT_MODAL_OPTIONS } from '@app/core';
import { RewardThoughtService } from '@app/core/services/propaganda/reward-thought.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { ValidationService } from '@app/shared/services/validation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RewardThoughtImportManageComponent } from '../file-import-reward-thought/file-import-reward-thought.component';
@Component({
  selector: 'reward-thought-search',
  templateUrl: './reward-thought-search.component.html',
  styleUrls: ['./reward-thought-search.component.css']
})
export class RewardThoughtSearchComponent extends BaseComponent implements OnInit {

  formSearch: FormGroup;
  listStatus: any;
  resultList: any;
  filterConditionEmp: any;
  check: any;
  formConfig = {
    code: [''],
    name: [''],
    categoryTypeId: [''],
    classify: [''],
    eovTypeLevel: [''],
    effectiveFromDate: [''],
    effectiveToDate: [''],
    expiredFromDate: [''],
    expiredToDate: [''],
    isCode: [false],
    isName: [false],
    isCategoryTypeId: [false],
    isClassify: [false],
    isEovTypeLevel: [false],
    isEffectiveFromDate: [false],
    isEffectiveToDate: [false],
    isExpiredFromDate: [false],
    isExpiredToDate: [false]
  }

  constructor(
    private rewardThoughtService: RewardThoughtService,
    private router: Router,
    private app: AppComponent,
    private modalService: NgbModal
  ) {
    super(null, CommonUtils.getPermissionCode("resource.propagandaRewardThought"));
    this.setMainService(rewardThoughtService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('effectiveFromDate', 'effectiveToDate', 'massOrganization.check.expiredDate')]);
  }

  ngOnInit() {
    this.processSearch();
    this.getTypeOfExpression();
  }

  get f() {
    return this.formSearch.controls;
  }

  public getTypeOfExpression(vtCriticalId?: string) {
    this.rewardThoughtService.getTypeOfExpression()
      .subscribe(res => {
        var listType = [];
        for (var i = 0; i < res.data.length; i++) {
          listType.push({ itemName: res.data[i].name, itemValue: res.data[i].categoryTypeId })
        }
        this.listStatus = listType
      })
  }

  public getDetail(item?: any) {
    if (item.categoryId) {
      this.rewardThoughtService.findOne(item.categoryId).subscribe(res => {
        if (res) {
          this.router.navigate(['/propaganda/reward-thought/', item.categoryId, 'view-detail']);
        }
      })
    }
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.categoryId > 0) {
      this.rewardThoughtService.findOne(item.categoryId).subscribe(res => {
        if (res) {
          this.router.navigate(['/propaganda/reward-thought/', item.categoryId, 'edit']);
        }
      })
    } else {
      this.router.navigate(['/propaganda/reward-thought/add']);
    }
  }

  processDelete(item) {
    if (item && item.categoryId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.rewardThoughtService.deleteById(item.categoryId)
          .subscribe(res => {
            if (this.rewardThoughtService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected
      });
    }
  }
  import() {
    const modalRef = this.modalService.open(RewardThoughtImportManageComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.rewardThoughtService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }
}
