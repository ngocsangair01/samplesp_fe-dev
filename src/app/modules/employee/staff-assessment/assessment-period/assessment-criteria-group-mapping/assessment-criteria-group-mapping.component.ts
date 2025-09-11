import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { MessageService } from 'primeng/api';
import { TranslationService } from 'angular-l10n';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'assessment-criteria-group-mapping',
  templateUrl: './assessment-criteria-group-mapping.component.html'
})
export class AssessmentCriteriaGroupMappingComponent extends BaseComponent implements OnInit {
  // formArray for group
  formCriteriaGroup: FormArray
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private app: AppComponent,
    private messageService: MessageService,
    public translation: TranslationService
  ) { 
    super();
  }

  setDataList(data) {
    this.buildFormCriteriaGroup(data);
  }

  ngOnInit() {
  }

  /**
   * Build formArray group
   */
  private buildFormCriteriaGroup(data) {
    if(!data) {
      data = [{}]
    }
    let controls = new FormArray([])
    for(const item of data) {
      const group = this.makeDefaultCriteriaGroup()
      item.listChangeDisplay = item.listChangeDisplay && item.listChangeDisplay.length > 0 ? item.listChangeDisplay : []
      
      group.patchValue(item)
      controls.push(group)
    }
    this.formCriteriaGroup = controls
    
  }

  /**
   * Initial criteria group form
   */
  private makeDefaultCriteriaGroup(): FormGroup {
    // return initial group
    return this.formBuilder.group({
      assessmentLevelMappingCriteriaGroupId: [],
      assessmentCriteriaGroupId: [],
      assessmentCriteriaGroupName: [],
      assessmentCriteriaGroupDisplay: [],
      assessmentCriteriaGroupOrder: [],
      assessmentCriteriaGroupType: [],
      assessmentCriteriaList: [],
      listChangeDisplay: []
    })
  }
  /**
   * swap item into an array
   */
  private swapIntoArray(arr, index, isUp) {
    if(arr.length > 0) {
      if(isUp && index !== 0) { // up
        let tmp = arr[index]
        arr[index] = arr[index - 1]
        arr[index - 1] = tmp
      } else if(!isUp && index !== arr.length - 1) { // down
        let tmp = arr[index]
        arr[index] = arr[index + 1]
        arr[index + 1] = tmp
      }
    }
    return arr
  }

  /**
   * move group up
   */
  moveGroup(idx, isUp) {
    const arr = this.swapIntoArray(this.formCriteriaGroup.value, idx, isUp);
    this.buildFormCriteriaGroup(arr)
  }

  /**
   * move up item into group
   */
  moveItem(itemGroup, item, isUp) {
    let itemGroupTransfer = itemGroup.value;
    // index of group and item
    const groupList = this.formCriteriaGroup.controls;
    const idxGroup = groupList.indexOf(itemGroup);
    const idxItem = itemGroup.value.assessmentCriteriaList.indexOf(item)
    // swap criteriaList
    const criteriaList = this.swapIntoArray(itemGroupTransfer.assessmentCriteriaList, idxItem, isUp);
    const itemTransfer = {...itemGroupTransfer, assessmentCriteriaList: criteriaList}
    this.formCriteriaGroup.controls[idxGroup].setValue(itemTransfer)
    this.buildFormCriteriaGroup(this.formCriteriaGroup.value)
  }

  onchangeDisplayGroup(itemGroup, index: number) {
    let itemTransfer = {}
    if(!itemGroup.assessmentCriteriaGroupDisplay) {
      itemGroup.assessmentCriteriaList.forEach(item => {
        item['assessmentLevelMappingCriteriaAgain'] = 0
        item['criteriaAgainDisabled'] = 1
      })
      itemTransfer = {...itemGroup, listChangeDisplay: []}
    } else {
      itemGroup.assessmentCriteriaList.forEach(item => {
        item['criteriaAgainDisabled'] = 0
      })
      itemTransfer = {...itemGroup, listChangeDisplay: itemGroup.assessmentCriteriaList}
    }
    this.formCriteriaGroup.controls[index].setValue(itemTransfer)
  }

  onChangeListChangeDisplay(index: number, itemCriteria?: any) {
    let itemGroup = this.formCriteriaGroup.controls[index].value
    const listChange = itemGroup.listChangeDisplay
    const assessmentCriteriaList = itemGroup.assessmentCriteriaList
    
    let disabled = true
    if(listChange && listChange.length > 0) {
      itemGroup['assessmentCriteriaGroupDisplay'] = true
      if (assessmentCriteriaList.length === listChange.length) {
        disabled = false
        assessmentCriteriaList.forEach(item => {
          item['criteriaAgainDisabled'] = 0
        })
      } else {
        listChange.forEach(item => {
          if (item.assessmentCriteriaId === itemCriteria.assessmentCriteriaId) {
            disabled = false
          }
        })
      }
    } else {
      itemGroup['assessmentCriteriaGroupDisplay'] = false
      assessmentCriteriaList.forEach(item => {
        item['assessmentLevelMappingCriteriaAgain'] = 0
        item['criteriaAgainDisabled'] = 1
      })
    }
    if (itemCriteria) {
      if (disabled) {
        itemCriteria['assessmentLevelMappingCriteriaAgain'] = 0
        itemCriteria['criteriaAgainDisabled'] = 1
      } else {
        itemCriteria['criteriaAgainDisabled'] = 0
      }
    }
    this.formCriteriaGroup.controls[index].setValue(itemGroup)
  }

  private checkValidListResponse() {
    const groupList = this.formCriteriaGroup.controls.filter(item => item.value.listChangeDisplay.length > 0)
    if(groupList.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  processSetup() {
    // valid form
    if(this.checkValidListResponse()) {
      // this.app.warningMessage('assessmentPeriod.listChooseIsNotNull')
      const summary = this.translation.translate(`app.messageSummary`);
      const content = this.translation.translate(`assessmentPeriod.listChooseIsNotNull`);
      this.messageService.add({severity: 'warn', summary: summary, detail: content});
      return;
    }
    // modify data 
    let dataResult = this.formCriteriaGroup.value;
    // assessmentCriteriaGroupDisplay -> 1 : 0
    dataResult.forEach(element => {
      element.assessmentCriteriaGroupDisplay = element.assessmentCriteriaGroupDisplay ? 1 : 0
    });
    // modify assessmentCriteriaGroupOrder
    let stt = 0
    dataResult.forEach(element => {
      if(element.assessmentCriteriaGroupDisplay === 1) {
        element.assessmentCriteriaGroupOrder = stt++
      }
      // data before assessmentCriteriaList
      let dataBefore = element.assessmentCriteriaList
      // data after listChangeDisplay
      const dataAfter = element.listChangeDisplay
      // modify assessmentCriteriaDisplay
      dataBefore.forEach(e => {
        if(dataAfter.indexOf(e) === -1) {
          e.assessmentCriteriaDisplay = 0
        } else {
          e.assessmentCriteriaDisplay = 1
        }
      });
      // modify assessmentCriteriaOrder
      let sttItem = 0
      dataBefore.forEach(e => {
        if(e.assessmentCriteriaDisplay === 1) {
          e.assessmentCriteriaOrder = sttItem++
        }
      });
      element.assessmentCriteriaList = dataBefore
    });
    this.app.confirmMessage(null, () => {// on accepted
        this.activeModal.close(dataResult);
      }, () => {// on rejected
    });
  }

  public onClickAssessmentLevelMappingCriteriaAgain(event, itemGroup, item) {
    item['assessmentLevelMappingCriteriaAgain'] = 1 - CommonUtils.nvl(item.assessmentLevelMappingCriteriaAgain, 0);
  }
}
