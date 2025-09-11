
import { ActivatedRoute } from '@angular/router';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {Component, OnInit, ViewChild} from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { AppComponent } from '@app/app.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmpArmyProposedDetailService } from '@app/core/services/employee/emp-army-proposed-detail.service';
import { HelperService } from '@app/shared/services/helper.service';
import { APP_CONSTANTS } from '@app/core';
import {SysCatService} from "@app/core/services/sys-cat/sys-cat.service";
import {
  EmpArmyProposedAddSelectFilterComponent
} from "@app/modules/employee/emp-army-proposed/emp-army-proposed-add-select-filter/emp-army-proposed-add-select-filter.component";

@Component({
  selector: 'emp-army-proposed-add',
  templateUrl: './emp-army-proposed-add.component.html',
  styleUrls: ['./emp-army-proposed-add.component.css']
})
export class EmpArmyProposedAddComponent extends BaseComponent implements OnInit {
  lstEvaluate: FormArray;
  lstExplain: FormArray;
  lstComment: FormArray;
  empArmyProposedId: any;
  conditionCheckList: [] = APP_CONSTANTS.CONFIG_ARMY_CONDITION_DATA_TYPE;
  isDisable = false;
  isCoQuanCtri = false;
  listRequire = [];
  listSelectedProposed = [];
  listConditionCode = [];
  formConfig = {
    armyProposedDetailId: [''],
    conditionCode: [''],
    conditionValue: [''],
    conditionCheck: [''],
    conditionName: [''],
    placeholder: [''],
    dataType: [''],
    groupType: [''],
    conditionMaxLength: [''],
    isRequired: ['']
  }

  @ViewChild('empArmyProposedAddSelectFilterComponent')
  empArmyProposedAddSelectFilterComponent : EmpArmyProposedAddSelectFilterComponent;

  constructor(
      public activeModal: NgbActiveModal,
      private empArmyProposedDetailService: EmpArmyProposedDetailService,
      public actr: ActivatedRoute,
      public app: AppComponent,
      private helperService: HelperService,
      private sysCatService : SysCatService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.empArmyProposed"));
    this.setMainService(empArmyProposedDetailService);
    this.buildFormListEvaluate();
    this.buildFormListExplain();
    this.buildFormListComment();

  }

  ngOnInit() {
  }

  // quay lai
  public goBack() {
    this.activeModal.close()
  }

  public getOnSelectProposed(event){
    if(this.listSelectedProposed.length>0){
      let checkPushValue =0
      for(let item =0; item<this.listSelectedProposed.length; item++){
        if((event.value.conditionCode === this.listSelectedProposed[item].conditionCode)
            && (event.value.property === this.listSelectedProposed[item].conditionValue.split(":")[0])){
          checkPushValue = 1
          if(event.value.listCheck !== null || event.value.listCheck !== ""){
            this.listSelectedProposed[item]['conditionValue'] = event.value.property+":"+event.value.listCheck;
          }else{
            this.listSelectedProposed.splice(item,1)
          }
        }
      }
      if(checkPushValue === 0){
        this.listSelectedProposed.push({
          armyProposedDetailId: event.value.armyProposedDetailId,
          conditionCheck: null,
          conditionCode: event.value.conditionCode,
          conditionValue: event.value.property+":"+event.value.listCheck,
        })
      }
    }else{
      this.listSelectedProposed.push({
        armyProposedDetailId: event.value.armyProposedDetailId,
        conditionCheck: null,
        conditionCode: event.value.conditionCode,
        conditionValue: event.value.property+":"+event.value.listCheck,
      })
    }
  }

  // them moi or sua
  processSaveOrUpdate() {
    if (this.lstEvaluate == null) {
      this.lstEvaluate = new FormArray([]);
    }
    if (this.lstExplain == null) {
      this.lstExplain = new FormArray([]);
    }

    if (this.lstComment == null) {
      this.lstComment = new FormArray([]);
    }

    if (!CommonUtils.isValidForm(this.lstEvaluate) && !CommonUtils.isValidForm(this.lstExplain) ) {
      return;
    }
    this.app.confirmMessage(null, () => { // on accept
      let listData = [];
      let listDataDSKQHTNV = [];
      listData.push(...this.lstEvaluate.value);
      listData.push(...this.lstExplain.value);
      listData.push(...this.lstComment.value);
      for (let i=0;i<listData.length;i++){
        if(listData[i].dataType === "DS KQHTNV"){
          listDataDSKQHTNV.push({'conditionCode': listData[i].conditionCode, 'conditionCheck': listData[i].conditionCheck})
          if(this.listSelectedProposed.length>0){
            for(let item =0; item<this.listSelectedProposed.length; item++){
              this.listSelectedProposed[item].conditionValue= this.listSelectedProposed[item].conditionValue.replace("null", "Không")
              if(this.listSelectedProposed[item].conditionCode === listData[i].conditionCode){
                this.listSelectedProposed[item]['conditionCheck'] = listData[i].conditionCheck;
              }
            }
          }
        }
      }
      for (let i=0;i<listData.length;i++){
        if(listData[i].dataType === "DS KQHTNV"){
          listData.splice(i,1);
          if(i!=0){i--}
        }
      }
      listData.push(...this.listSelectedProposed);
      const data = {
        empArmyProposedId: this.empArmyProposedId,
        armyProposedDetailList: listData
      }
      this.empArmyProposedDetailService.saveOrUpdate(data)
          .subscribe(res => {
            if (this.empArmyProposedDetailService.requestIsSuccess(res)) {
              this.empArmyProposedDetailService.updateConditionCheck({
                empArmyProposedId: this.empArmyProposedId,
                armyProposedDetailList: listDataDSKQHTNV
              }).subscribe(res=> {})
              this.helperService.reloadHeaderNotification('complete');
              this.activeModal.close(res);
            }
          });
      () => {

      }
    }, () => {
      // on rejected
    });
  }

  private buildFormListEvaluate(list?: any) {
    if (!list || list.length == 0) {
      this.lstEvaluate = null
    } else {
      const controls = new FormArray([]);
      for (const i in list) {
        const formTableConfig = list[i];
        const group = this.makeDefaultFormConfig();
        if(list[i].isRequired == 1 && list[i].dataType != 'SYSTEM') {
          group.removeControl('conditionValue');
          group.addControl('conditionValue', new FormControl('', [ValidationService.required]));
        }
        group.patchValue(formTableConfig);
        controls.push(group);
      }
      this.lstEvaluate = controls;
    }
  }

  private buildFormListExplain(list?: any) {
    if (!list || list.length == 0) {
      this.lstExplain = null;
    } else {
      const controls = new FormArray([]);
      for (const i in list) {
        const formTableConfig = list[i];
        const group = this.makeDefaultFormConfig();
        if(list[i].isRequired == 1 && list[i].dataType != 'SYSTEM') {
          group.removeControl('conditionValue');
          group.addControl('conditionValue', new FormControl('', [ValidationService.required]));
        }
        group.patchValue(formTableConfig);
        controls.push(group);
      }
      this.lstExplain = controls;
    }
  }

  private buildFormListComment(list?: any) {
    if (!list || list.length == 0) {
      this.lstComment = null;
    } else {
      const controls = new FormArray([]);
      for (const i in list) {
        const formTableConfig = list[i];
        const group = this.makeDefaultFormConfig();
        if(list[i].isRequired == 1 && list[i].dataType != 'SYSTEM') {
          group.removeControl('conditionValue');
          group.addControl('conditionValue', new FormControl('', [ValidationService.required]));
        }
        group.patchValue(formTableConfig);
        controls.push(group);
      }
      this.lstComment = controls;
    }
  }

  private makeDefaultFormConfig(): FormGroup {
    const formGroup = this.buildForm({}, this.formConfig);
    return formGroup;
  }

  public setFormValue(data?: any, isCoQuanCtri?: boolean) {
    if (data) {
      let n = 0
      if(data.soldierLevelId == null){
        n = 3;
        for(let i=0;i<n;i++){
          this.listRequire.push("Năm "+String(data.year-i-1));
        }
        this.empArmyProposedId = data.empArmyProposedId;
        data.isCoQuanCtri = isCoQuanCtri;
        this.empArmyProposedDetailService.getListDetail(data).subscribe(res => {
          for(let item=0;item < res.length; item++){
            if(res[item].dataType === "DS KQHTNV"){
              for(let i=0;i<n;i++){
                if(res[item].conditionValue != null && res[item].conditionValue.split(":")[0]==="Năm "+String(data.year-i-1)){
                  this.listSelectedProposed.push({
                    armyProposedDetailId: res[item].armyProposedDetailId,
                    conditionCheck: res[item].conditionCheck,
                    conditionCode: res[item].conditionCode,
                    conditionValue: res[item].conditionValue,
                  })
                }else{
                  this.listSelectedProposed.push({
                    armyProposedDetailId: "",
                    conditionCheck: res[item].conditionCheck,
                    conditionCode: res[item].conditionCode,
                    conditionValue: "Năm "+String(data.year-i-1)+":Không",
                  })
                }
              }
            }
            if(res[item].dataType === "DS KQHTNV" && res[item].armyProposedDetailId !== null && res[item].conditionValue !== null){
              res[item].conditionValue = "\t"+res[item].armyProposedDetailId+ "\n"+res[item].conditionValue;
              for(let childItem=0; childItem < res.length;childItem++){
                if(res[childItem].dataType === "DS KQHTNV"
                    && res[childItem].conditionCode === res[item].conditionCode
                    && res[childItem].armyProposedDetailId !== res[item].armyProposedDetailId){
                  res[item].conditionValue = res[item].conditionValue+"\t"+res[childItem].armyProposedDetailId + "\n"+res[childItem].conditionValue;
                  res[item].conditionCheck = res[childItem].conditionCheck;
                  for(let itemSelected in this.listSelectedProposed){
                    if(res[childItem].conditionValue.split(":")[0]===this.listSelectedProposed[itemSelected].conditionValue.split(":")[0]
                        && res[childItem].conditionCode === this.listSelectedProposed[itemSelected].conditionCode){
                      this.listSelectedProposed[itemSelected].conditionValue = res[childItem].conditionValue;
                      this.listSelectedProposed[itemSelected].armyProposedDetailId = res[childItem].armyProposedDetailId;
                    }
                  }
                  res.splice(childItem,1)
                  if(childItem != 0){
                    childItem--
                  }
                }
              }
            }
          }
          res.forEach(el => {
            if (CommonUtils.isNullOrEmpty(el.armyProposedDetailId)) {
              el.conditionCheck = 1;
            }
          })
          this.buildFormListEvaluate(res.filter(el => el.groupType == 1));
          this.buildFormListExplain(res.filter(el => el.groupType == 2));
          if(isCoQuanCtri) {
            this.isDisable = true;
            this.buildFormListComment(res.filter(el => el.groupType == 3));
          }
        });
      }else{
        this.sysCatService.findById(data.soldierLevelId).subscribe(rec => {
          if(rec.data.description != null){
            n=(rec.data.description)/12;
            for(let i=0;i<n;i++){
              this.listRequire.push("Năm "+String(data.year-i-1));
            }
          }
          this.empArmyProposedId = data.empArmyProposedId;
          data.isCoQuanCtri = isCoQuanCtri;
          this.empArmyProposedDetailService.getListDetail(data).subscribe(res => {
            for(let item=0;item < res.length; item++){
              if(res[item].dataType === "DS KQHTNV"){
                for(let i=0;i<n;i++){
                  if(res[item].conditionValue != null && res[item].conditionValue.split(":")[0]==="Năm "+String(data.year-i-1)){
                    this.listSelectedProposed.push({
                      armyProposedDetailId: res[item].armyProposedDetailId,
                      conditionCheck: res[item].conditionCheck,
                      conditionCode: res[item].conditionCode,
                      conditionValue: res[item].conditionValue,
                    })
                  }else{
                    this.listSelectedProposed.push({
                      armyProposedDetailId: "",
                      conditionCheck: res[item].conditionCheck,
                      conditionCode: res[item].conditionCode,
                      conditionValue: "Năm "+String(data.year-i-1)+":Không",
                    })
                  }
                }
              }
              if(res[item].dataType === "DS KQHTNV" && res[item].armyProposedDetailId !== null && res[item].conditionValue !== null){
                res[item].conditionValue = "\t"+res[item].armyProposedDetailId+ "\n"+res[item].conditionValue;
                for(let childItem=0; childItem < res.length;childItem++){
                  if(res[childItem].dataType === "DS KQHTNV"
                      && res[childItem].conditionCode === res[item].conditionCode
                      && res[childItem].armyProposedDetailId !== res[item].armyProposedDetailId){
                    res[item].conditionValue = res[item].conditionValue+"\t"+res[childItem].armyProposedDetailId + "\n"+res[childItem].conditionValue;
                    res[item].conditionCheck = res[childItem].conditionCheck;
                    for(let itemSelected in this.listSelectedProposed){
                      if(res[childItem].conditionValue.split(":")[0]===this.listSelectedProposed[itemSelected].conditionValue.split(":")[0]
                          && res[childItem].conditionCode === this.listSelectedProposed[itemSelected].conditionCode){
                        this.listSelectedProposed[itemSelected].conditionValue = res[childItem].conditionValue;
                        this.listSelectedProposed[itemSelected].armyProposedDetailId = res[childItem].armyProposedDetailId;
                      }
                    }
                    res.splice(childItem,1)
                    if(childItem != 0){
                      childItem--
                    }
                  }
                }
              }
            }
            res.forEach(el => {
              if (CommonUtils.isNullOrEmpty(el.armyProposedDetailId)) {
                el.conditionCheck = 1;
              }
            })
            this.buildFormListEvaluate(res.filter(el => el.groupType == 1));
            this.buildFormListExplain(res.filter(el => el.groupType == 2));
            if(isCoQuanCtri) {
              this.isDisable = true;
              this.buildFormListComment(res.filter(el => el.groupType == 3));
            }
          });
        })
      }
    }
  }
}
