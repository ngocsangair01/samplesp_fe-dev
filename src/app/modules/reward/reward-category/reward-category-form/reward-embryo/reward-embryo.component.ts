import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ACTION_FORM,RESOURCE } from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { RewardCategoryService } from '@app/core/services/reward-category/reward-category.service';
import { RewardGeneralService } from '@app/core/services/reward-general/reward-general.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ValidationService } from '@app/shared/services';
import { SortEvent } from 'primeng/api';
import { Subject } from 'rxjs';
import { FileControl } from '@app/core/models/file.control';
import { RewardCategoryCentificateService } from '@app/core/services/reward-category/reward-category-centificate.service';
@Component({
  selector: 'reward-embryo',
  templateUrl: './reward-embryo.component.html',

  
  styleUrls: ['./reward-embryo.component.css']
})
export class RewardEmbryoComponent extends BaseComponent implements OnInit {
  @Input() rewardType;
  @Input() saveData: Subject<boolean> = new Subject<boolean>();
  @Input() setData: Subject<any> = new Subject<any>();
  @Input() lstRewardCategoryDetail: any;
  @Input() dataToSave: FormArray;
  @Output() formRewardGroupOutput = new EventEmitter();
  @Input() resetFormArray: Subject<any> = new Subject<any>();
  @Input() rewardCategoryId: any;
  formRewardGroup: FormArray;
  rewardTitleIdList: any;
  numIndex = 1;
  mapRewardTypeBranch = { 1: 0, 2: 3, 3: 1, 4: 2, 5: 5 };
  branch: number;
  isGOV: boolean;
  isMasO: boolean;
  isOgr: boolean;
  isView: boolean = false;
  isEdit: boolean = false;
  isApprove: boolean = false;
  isRefuse: boolean = false;
  amountOfMoney: any;
  isDisable: any;
  isSelectedRewardType: any = true;
  rewardCategory: any;
  firstRowIndex = 0;
  pageSize = 10;

  constructor(
    private router: Router,
    public actr: ActivatedRoute,
    public appParamService: AppParamService,
    public rewardCategoryService: RewardCategoryService,
    public rewardGeneralService: RewardGeneralService,
    public rewardCategoryCentificateService: RewardCategoryCentificateService,

  ) {
    super(actr, RESOURCE.MASS_MEMBER, ACTION_FORM.INSERT);
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;        
        if (params) {
          this.rewardCategoryId = params.id;
        } else {
          // this.setDataToForm({});
        }
      }
    });
    this.buildFormRewardGroup();
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 3) {
      this.isView = subPaths[3] === 'view';
      this.isEdit = subPaths[3] === 'edit';
      this.isApprove = subPaths[3] === 'approve';
      this.isRefuse = subPaths[3] === 'refuse';
    }
    this.formRewardGroupOutput.emit(this.formRewardGroup); 
    if(this.rewardCategoryId){
     this.rewardCategoryCentificateService.findById(this.rewardCategoryId).subscribe((res:any) => {        
        this.buildFormRewardGroup(res.data) 
        this.formRewardGroupOutput.emit(this.formRewardGroup); 
      })
    }
  }

  public initPositionForm(listData?: any) {
    this.buildFormRewardGroup(listData);
  }
  public disabledDate = (date: Date): boolean => {
    return date.getDate() % 2 === 0;
  };

  /**
   * makeDefaultForm
   */
  private makeDefaultForm(): FormGroup {
    let group = {
      rewardCategoryCertificateId: [null],
      attachedFiles: [null ,[ValidationService.required]],
      effectiveDate: [null , [ValidationService.required]],
      expritedDate: [null],
      parameters: [null],
      maxLength: [null]
    };

    return this.buildForm({}, group );
  }

  public buildFormRewardGroup(listData?: any) {
    const controls = new FormArray([]);
      for (const i in listData) {
        const group = this.makeDefaultForm();
        const attachedFiles = new FileControl(null, ValidationService.required)
        attachedFiles.setFileAttachment(listData[i].fileAttachment.attachedFiles)
        const param = listData[i];
        group.setControl('attachedFiles', attachedFiles)
        group.patchValue(param);
        controls.push(group);
        this.numIndex++;
      }
    this.formRewardGroup = controls;
  }

  /**
   * addGroup
   * param index
   * param item
   */
  public add() {
    const controls = this.formRewardGroup as FormArray;
    this.numIndex++;
    const control = this.makeDefaultForm() as FormGroup;
    control.removeControl('attachedFiles');
    control.addControl('attachedFiles', new FileControl(null, ValidationService.required))
    controls.insert(controls.length, control);
    this.sortDataTable();
    const maxPage = Math.ceil(this.formRewardGroup.controls.length / this.pageSize);
    this.firstRowIndex = (maxPage - 1) * this.pageSize; 
  }
  /**
   * removeGroup
   * param index
   * param item
   */
   public remove(index: number, item: FormGroup) {
    const controls = this.formRewardGroup as FormArray;
    this.numIndex--;
    controls.removeAt(index);
    this.sortDataTable();
  }

  private sortDataTable() {
    const _event = {
      data: this.formRewardGroup.controls,
      field: 'sortOrder',
      mode: 'single',
      order: 1
    };
    this.customSort(_event);
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const value1 = data1.value[event.field];
      const value2 = data2.value[event.field];
      let result = null;

      if (value1 == null && value2 != null) {
        result = -1;

      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      }
      return (event.order * result);
    });
  }
  public onSelect() {
    this.formRewardGroup.controls.forEach((item: FormGroup) => {
      const target = item.controls['effectiveDate']
      const toMatch = item.controls['expritedDate'];      
      if (target.hasError('dateNotAffter')) {
        target.setErrors(null);
        target.markAsUntouched();
      }
      if (target.value && toMatch.value) {
        const isCheck = target.value <= toMatch.value;
        // set equal value error on dirty controls
        if (!isCheck && target.valid && toMatch.valid) {
          target.setErrors({ dateNotAffter: { dateNotAffter: 'position.label.expritedDate' } });
          target.markAsTouched();
          // toMatch.setValue(null)
        }
      }
    })
  }

  public goBack() {
    this.router.navigate(['/reward/reward-category']);
  }
}

