import { filter } from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {CommonUtils, ValidationService} from "@app/shared/services";
import {FormArray, FormGroup, Validators} from "@angular/forms";
import {ACTION_FORM, APP_CONSTANTS, LARGE_MODAL_OPTIONS} from "@app/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {AssessmentFormulaService} from "@app/core/services/assessment-formula/assessment-formula.service";
import {HelperService} from "@app/shared/services/helper.service";
import {CompetitionProgramService} from "@app/core/services/competition-program/competition-program.service";
import {formatDate} from "@angular/common";
import {FileControl} from "@app/core/models/file.control";
import {CompetitionResultService} from "@app/core/services/competition-result/competition-result.service";
import {UnitRegistrationService} from "@app/core/services/unit-registration/unit-registration.service";
import { WelfarePolicyCategoryService } from '@app/core/services/population/welfare-policy-category.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { RewardCategoryFunding } from '@app/core/services/reward-category/reward-category-funding';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { WelfarePolicyRequestService } from '@app/core/services/population/welfare-policy-request.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { AppComponent } from '@app/app.component';
import {MassOrganizationService} from "@app/core/services/mass-organization/mass-organization.service";
import {HrStorage} from "../../../../../core/services/HrStorage";

@Component({
  selector: 'welfare-policy-proposal-form',
  templateUrl: './welfare-policy-request-form.component.html',
  styleUrls: ['./welfare-policy-request-form.component.css']
})
export class WelfarePolicyRequestFormComponent extends BaseComponent implements OnInit {
    welfarePolicyCategoryList = [];
    relationshipList;
    relationshipOptions: any = [];
    fundingCategoryOptions;
    requestDocumentTypeOptions;
    objectNameOptions: any = [];
    employeeFilterCondition: any;
    userLogin = HrStorage.getUserToken().employeeCode
    welfarePolicyRequest;
    welfarePolicyRequestId;
    welfarePolicyCategoryId;
    welfarePolicyCategoryInfo;
    massOrgIdByEmp: any;
    objectType: any;
    objectId: any;
    documentState: any;
    note: any;
    employeeStatus: any;
    maxDate: Date;
    isInvalidResonCancel: boolean = false;
    isInvalidFileAttachment: boolean = false;
    isInvalidRelationship: boolean = false;
    isInvalidObjectId: boolean = false;
    isInvalidStatus: boolean = false;
    isInvalidEndDate: boolean = false;
    isInvalidDocumentNote: boolean = false;
    formSave: FormGroup;
    view: boolean;
    update: boolean;
    create: boolean;
    showFile: boolean = false;
    showAmount: boolean = false;
    competitionRegistrationStatus: any;
    firstTitle: any;
    competitionId: any;
    lastTitle: any;
    competitionProgramCode: any;
    competitionCode: [''];
    competitionName: any;
    completionRate = '';
    detailDescription = '';
    resultEvaluation = '';
    status = '';
    reason = '';
    type: any;
    resultList: any = [];
    formPolicyRequestAmountBOList: FormArray;
    formPolicyDocumentRequestBeanList = new FormArray([]);
    policyRequestAmountBOList;
    policyDocumentRequestFormList;
    disableRelationship: boolean = false;
    index: any = 0;
    // 1 - thăm hỏi
    // 2 - bổ sung giấy tờ
    attachmentFileLabel: string;
    attachmentFileLabel1: string;
    noteLabel: string;
    formConfig = {
        welfarePolicyRequestId: [null],
        welfarePolicyCategoryId: [null, ValidationService.required],
        employeeId: [null, ValidationService.required],
        objectType: [null, ValidationService.required],
        objectId: [null],
        relationshipId: [null, this.disableRelationship ? ValidationService.required : ''],
        startDate: [null, ValidationService.required],
        status: [2],
        endDate: [null],
        reason: [null, ValidationService.required],
        chairmanType: [null, ValidationService.required],
        approveOrgId: [null, ValidationService.required],
        policyRequestAmountBOList: [null],
        policyDocumentRequestFormList: [null],
        documentState: [null, ValidationService.required],
        documentReason: [null],
        note: [null],
        amountTotal: [null],
        rejectReason: [null],
    }
    objectTypeOptions = [
      { name: 'Bản thân', value: 1 },
      { name: 'Thân nhân', value: 2 }
    ]
    statusList = [
      { name: 'Dự thảo', value: 0 },
      { name: 'Đã tiếp nhận', value: 2 },
      { name: 'Đã thăm hỏi', value: 4 }
    ]
    statusListFull = [
        { name: 'Dự thảo', value: 0 },
        { name: 'Chờ tiếp nhận', value: 1 },
        { name: 'Đã tiếp nhận', value: 2 },
        { name: 'Bị từ chối', value: 3 },
        { name: 'Đã thăm hỏi', value: 4 },
        { name: 'Chờ thanh toán', value: 5 },
        { name: 'Đã thanh toán', value: 6 }
    ]
    chairmanTypeList : any = [];
    documentStateList = [
      { name: 'Đủ', value: 1 },
      { name: 'Thiếu', value: 2 }
    ]

    constructor(
        private router: Router,
        public actr: ActivatedRoute,
        private activatedRoute: ActivatedRoute,
        public a: AssessmentFormulaService,
        private unitRegistrationService: UnitRegistrationService,
        public helperService: HelperService,
        public competitionResultService: CompetitionResultService,
        private welfarePolicyCategoryService: WelfarePolicyCategoryService,
        private sysCatService: SysCatService,
        public rewardCategoryFunding: RewardCategoryFunding,
        private appParamService: AppParamService,
        private welfarePolicyRequestService: WelfarePolicyRequestService,
        private massOrganizationService : MassOrganizationService,
        public activeModal: NgbActiveModal,
        private curriculumVitaeService: CurriculumVitaeService,
        private app: AppComponent,
        public modalService: NgbModal
    ) {
        super();
        if (this.router.url.includes('update')) {
          this.update = true;
          this.statusList = this.statusListFull
        } else if (this.router.url.includes('view')) {
            this.view = true;
            this.statusList = this.statusListFull
        } else if (this.router.url.includes('create')) {
          this.create = true;
        }
        this.maxDate = new Date();
        this.welfarePolicyCategoryService.findAllByType(1).subscribe(res => {
          res.forEach((item : any) => {
            this.welfarePolicyCategoryList.push({ name: item.name, value: item.welfarePolicyCategoryId});
          })
          this.buildForms({});
          this.buildFormPolicyRequestAmountBOList();
          this.buildFormPolicyDocumentRequestBeanList();
        });
        this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.RELATION_SHIP).subscribe(res => {
          this.relationshipList = res.data;
        });
        this.rewardCategoryFunding.getListRewardCategoryFunding().subscribe(res => {
          this.fundingCategoryOptions = res;
        });
        const file = new FileControl(null);
        this.router.events.subscribe((e: any) => {
          if (e instanceof NavigationEnd && this.actr.snapshot && this.actr.snapshot.params) {
            const params = this.actr.snapshot.params;
            if (params) {
              this.welfarePolicyRequestId = params.id;
              if (this.welfarePolicyRequestId) {
                this.welfarePolicyRequestService.findOne(this.welfarePolicyRequestId).subscribe(res => {
                    this.objectType = res.data.objectType;
                    this.objectId = res.data.objectId;
                    this.welfarePolicyRequest = res;
                    this.welfarePolicyCategoryId = res.data.welfarePolicyCategoryId;
                    this.buildForms(res.data);
                    if (res.data.objectType === 1) {
                      this.disableRelationship = true;
                      this.formSave.get('relationshipId').setValue(null);
                    } else {
                      if (this.view) {
                        this.disableRelationship = true;
                      } else {
                        this.disableRelationship = false;
                      }
                      let listRelationship: any = [];
                      this.welfarePolicyCategoryService.findOne(this.welfarePolicyCategoryId).subscribe(res => {
                        if (res && res.data) {
                          this.setDataListChairmanType(res.data.welfarePolicyNormBOList, 1)
                          this.welfarePolicyCategoryInfo = res.data;
                          let listRelationship: any = [];
                          res.data.relationShipList.forEach((ele: any) => {
                            listRelationship.push(this.relationshipList.filter((item: any) => item.sysCatId === ele)[0])
                          })
                          this.relationshipOptions = listRelationship;
                        }
                      })
                    }
                    if (res.data.relationshipId) {
                      if (res.data.employeeId) {
                        this.welfarePolicyRequestService.getObjectNameList(res.data.relationshipId, res.data.employeeId).subscribe(data => {
                          this.objectNameOptions = [];
                          if (data && data.data) {
                            data.data.forEach((item: any) => {
                              this.objectNameOptions.push({name: item.fullname, value: item.familyRelationshipId});
                            })
                          }
                          this.formSave.get('objectId').setValue(this.objectId);
                        });
                      }
                    } else {
                      if (res.data.objectId && res.data.objectName) {
                          if (this.objectType === 1) {
                              this.objectNameOptions = [];
                              this.objectNameOptions.push({name: res.data.objectName, value: res.data.objectId});
                              this.formSave.get('objectId').setValue(res.data.objectId);
                          }
                      }
                    }
                    this.welfarePolicyCategoryService.findOne(res.data.welfarePolicyCategoryId).subscribe(res => {
                      if (res && res.data) {
                        this.setDataListChairmanType(res.data.welfarePolicyNormBOList, 1)
                        this.requestDocumentTypeOptions = res.data.policyDocumentBOList;
                      }
                      this.attachmentFileLabel = '';
                      this.attachmentFileLabel1 = '';
                      if (res.data.policyDocumentBOList && res.data.policyDocumentBOList.length) {
                        this.attachmentFileLabel = 'Loại giấy tờ yêu cầu bắt buộc: ';
                        this.attachmentFileLabel1 = 'Yêu cầu bổ sung: ';
                        let label = '';
                        res.data.policyDocumentBOList.forEach((item: any) => {
                          if (item.isRequired === 1) {
                            label += item.name + '; ';
                          }
                        })
                        if (label) {
                          this.attachmentFileLabel += label;
                          this.attachmentFileLabel1 += label;
                        }
                      }
                    })
                    this.formSave.get('welfarePolicyCategoryId').setValue(res.data.welfarePolicyCategoryId);
                    this.formSave.get('employeeId').setValue(res.data.employeeId);
                    this.formSave.get('objectType').setValue(res.data.objectType);
                    this.formSave.get('startDate').setValue(res.data.startDate);
                    this.formSave.get('status').setValue(res.data.status);
                    this.formSave.get('endDate').setValue(res.data.endDate);
                    this.formSave.get('reason').setValue(res.data.reason)
                    this.formSave.get('chairmanType').setValue(res.data.chairmanType)
                    this.formSave.get('approveOrgId').setValue(res.data.approveOrgId)
                    this.formSave.get('documentState').setValue(res.data.documentState)
                    this.formSave.get('documentReason').setValue(res.data.documentReason)
                    this.formSave.get('note').setValue(res.data.note)
                    if (res.data.rejectReason) {
                      this.formSave.get('rejectReason').setValue(res.data.rejectReason)
                    } else {
                      this.formSave.get('rejectReason').setValue(null)
                    }
                    if(res.data.policyRequestAmountBOList.length === 0){
                        this.buildFormPolicyRequestAmountBOList()
                    }else{
                        this.buildFormPolicyRequestAmountBOList(res.data.policyRequestAmountBOList)
                    }
                    if(res.data.policyDocumentRequestBeanList.length === 0){
                        this.welfarePolicyCategoryService.findOne(res.data.welfarePolicyCategoryId).subscribe(res => {
                            if (res && res.data) {
                                this.buildFormPolicyDocumentRequestBeanList(res.data.policyDocumentBOList)
                            }else{
                                this.buildFormPolicyDocumentRequestBeanList()
                            }
                        })
                    }else{
                        this.buildFormPolicyDocumentRequestBeanList(res.data.policyDocumentRequestBeanList)
                    }
                })
              }
            }
          }
        });
    }

    setFormValue(data: any, index: any) {
      this.index = index;
      if (this.index === 1) {
        this.activeModal.close();
      }
      if (data && data.welfarePolicyRequestId) {
        this.welfarePolicyRequestService.findOne(data.welfarePolicyRequestId).subscribe(res => {
            this.objectType = res.data.objectType;
            this.objectId = res.data.objectId;
            this.welfarePolicyCategoryId = res.data.welfarePolicyCategoryId;
            this.documentState = res.data.documentState;
            this.note = res.data.note;
            this.buildForms(res.data);
            if (res.data.objectType === 1) {
              this.disableRelationship = true;
              this.formSave.get('relationshipId').setValue(null);
            } else {
              if (this.view) {
                this.disableRelationship = true;
              } else {
                this.disableRelationship = false;
              }
              let listRelationship: any = [];
              this.welfarePolicyCategoryService.findOne(this.welfarePolicyCategoryId).subscribe(res => {
                if (res && res.data) {
                  this.setDataListChairmanType(res.data.welfarePolicyNormBOList, 1)
                  this.welfarePolicyCategoryInfo = res.data;
                  let listRelationship: any = [];
                  res.data.relationShipList.forEach((ele: any) => {
                    listRelationship.push(this.relationshipList.filter((item: any) => item.sysCatId === ele)[0])
                  })
                  this.relationshipOptions = listRelationship;
                }
              })
            }
            if (res.data.relationshipId) {
              if (res.data.employeeId) {
                this.welfarePolicyRequestService.getObjectNameList(res.data.relationshipId, res.data.employeeId).subscribe(data => {
                  this.objectNameOptions = [];
                  if (data && data.data) {
                    data.data.forEach((item: any) => {
                      this.objectNameOptions.push({name: item.fullname, value: item.familyRelationshipId});
                    })
                  }
                  this.formSave.get('objectId').setValue(this.objectId);
                });
              }
            } else {
                if (res.data.objectId && res.data.objectName) {
                    if (this.objectType === 1) {
                        this.objectNameOptions = [];
                        this.objectNameOptions.push({name: res.data.objectName, value: res.data.objectId});
                        this.formSave.get('objectId').setValue(res.data.objectId);
                    }
                }
            }
            this.welfarePolicyCategoryService.findOne(res.data.welfarePolicyCategoryId).subscribe(res => {
              if (res && res.data) {
                this.setDataListChairmanType(res.data.welfarePolicyNormBOList, 1)
                this.requestDocumentTypeOptions = res.data.policyDocumentBOList;
              }
              this.attachmentFileLabel = '';
              this.attachmentFileLabel1 = '';
              if (res.data.policyDocumentBOList && res.data.policyDocumentBOList.length) {
                this.attachmentFileLabel = 'Loại giấy tờ yêu cầu bắt buộc: ';
                this.attachmentFileLabel1 = 'Yêu cầu bổ sung: ';
                let label = '';
                res.data.policyDocumentBOList.forEach((item: any) => {
                  if (item.isRequired === 1) {
                    label += item.name + '; ';
                  }
                })
                if (label) {
                  this.attachmentFileLabel += label;
                  this.attachmentFileLabel1 += label;
                }
              }
              if (this.documentState && this.documentState !== 1) {
                this.noteLabel = '';
                if (res.data.policyDocumentBOList && res.data.policyDocumentBOList.length) {
                  this.noteLabel = 'Yêu cầu bổ sung ';
                  let label = '';
                  res.data.policyDocumentBOList.forEach((item: any) => {
                    if (item.isRequired === 1) {
                      label += item.name + '; ';
                    }
                  })
                  if (label) {
                    this.noteLabel += label;
                  }
                  this.formSave.get('note').setValue(this.noteLabel)
                }
              } else {
                this.formSave.get('note').setValue(this.note ? this.note : null)
              }
            })
            this.formSave.get('welfarePolicyCategoryId').setValue(res.data.welfarePolicyCategoryId);
            this.formSave.get('employeeId').setValue(res.data.employeeId);
            this.formSave.get('objectType').setValue(res.data.objectType);
            this.formSave.get('relationshipId').setValue(res.data.relationshipId);
            this.formSave.get('startDate').setValue(res.data.startDate);
            this.formSave.get('status').setValue(res.data.status);
            this.formSave.get('endDate').setValue(res.data.endDate);
            this.formSave.get('reason').setValue(res.data.reason)
            this.formSave.get('chairmanType').setValue(res.data.chairmanType)
            this.formSave.get('approveOrgId').setValue(res.data.approveOrgId)
            if (res.data.documentState) {
              this.formSave.get('documentState').setValue(res.data.documentState)
            } else {
              this.formSave.get('documentState').setValue(null)
            }
            if (res.data.documentReason) {
                this.formSave.get('documentReason').setValue(res.data.documentReason)
            } else {
                this.formSave.get('documentReason').setValue(null)
            }
            if (res.data.rejectReason) {
              this.formSave.get('rejectReason').setValue(res.data.rejectReason)
            } else {
              this.formSave.get('rejectReason').setValue(null)
            }
            if(res.data.policyRequestAmountBOList.length === 0){
                this.buildFormPolicyRequestAmountBOList()
            }else{
                this.buildFormPolicyRequestAmountBOList(res.data.policyRequestAmountBOList)
            }
            if(res.data.policyDocumentRequestBeanList.length === 0){
                this.welfarePolicyCategoryService.findOne(res.data.welfarePolicyCategoryId).subscribe(res => {
                    if (res && res.data) {
                        this.buildFormPolicyDocumentRequestBeanList(res.data.policyDocumentBOList)
                    }else{
                        this.buildFormPolicyDocumentRequestBeanList()
                    }
                })
            }else{
                this.buildFormPolicyDocumentRequestBeanList(res.data.policyDocumentRequestBeanList)
            }
            if (this.index === 1) {
              this.formSave.get('status').setValue(4);
              this.processSaveOrUpdate();
            }
        })
      }
    }

    setFormBirthDayValue(index: any) {
        this.index = index;
        this.welfarePolicyCategoryService.findBirthdayActive().subscribe(res => {
            this.welfarePolicyCategoryInfo = res;
            this.welfarePolicyCategoryId = res.welfarePolicyCategoryId;
            this.formSave.get('welfarePolicyCategoryId').setValue(res.welfarePolicyCategoryId);
            this.formSave.get('objectType').setValue(res.objectType);
            this.formSave.get('startDate').setValue(new Date().setDate(1));
            this.formSave.get('status').setValue(4);
            this.formSave.get('endDate').setValue(new Date(new Date().getFullYear(), new Date().getMonth()+1, 0));
            this.setDataListChairmanType(res.welfarePolicyNormBOList, 0)
        })
    }

    private buildFormPolicyRequestAmountBOList(policyRequestAmountBOList?: any): void {
        if (!policyRequestAmountBOList) {
            // this.formPolicyRequestAmountBOList = new FormArray([this.createDefaultFormPolicyRequestAmountBOList()]);
            this.showAmount = false
        } else {
            this.showAmount = true
            const controls = new FormArray([]);
            for (const item of policyRequestAmountBOList) {
                const group = this.createDefaultFormPolicyRequestAmountBOList();
                group.patchValue(item);
                controls.push(group);
            }
            this.formPolicyRequestAmountBOList = controls;
        }
    }

    private buildFormPolicyDocumentRequestBeanList(policyDocumentRequestFormList?: any): void {
      if (!policyDocumentRequestFormList || (policyDocumentRequestFormList && policyDocumentRequestFormList.length === 0)) {
          // this.formPolicyDocumentRequestBeanList = new FormArray([this.createDefaultFormPolicyDocumentRequestBeanList()]);
          this.showFile = false
      } else {
          this.showFile = true
          this.formPolicyDocumentRequestBeanList = new FormArray([]);
          for (const item of policyDocumentRequestFormList) {
              const group = this.createDefaultFormPolicyDocumentRequestBeanList();
              const filesControl = new FileControl(null);
              if (item && item.fileAttachment && item.fileAttachment.file) {
                filesControl.setFileAttachment(item.fileAttachment.file);
                filesControl.setValue(item.fileAttachment.file[0]);
                Object.assign(item, {file: item.fileAttachment.file[0]})
              }else if(item && item.fileAttachment && item.fileAttachment.length > 0){
                  filesControl.setFileAttachment(item.fileAttachment);
                  filesControl.setValue(item.fileAttachment[0]);
                  Object.assign(item, {file: item.fileAttachment[0]})
              }
              group.patchValue(item);
              group.setControl('file', filesControl);
              this.formPolicyDocumentRequestBeanList.push(group);
          }
      }
    }

    private createDefaultFormPolicyRequestAmountBOList(): FormGroup {
        const group = {
            welfarePolicyRequestId: [null],
            welfarePolicyNormId: [null],
            fundingCategoryId: [null],
            isFixed: [null],
            amount: [null, [ValidationService.required]],
        };
        return this.buildForm({}, group);
    }

    private createDefaultFormPolicyDocumentRequestBeanList(): FormGroup {
      const group = {
          welfarePolicyRequestId: [null],
          policyDocumentRequestId: [null],
          policyDocumentId: [null],
          isRequired: [null],
          isDeleted: [1],
          file: new FileControl(null),
      };
      return this.buildForm({}, group);
  }

    ngOnInit() {
    }


    get f() {
        return this.formSave.controls;
    }

    public buildForms(data?: any) {
        this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT);
    }

    public goBack() {
        this.router.navigate(['/population/welfare-policy-request']);
    }

    processSaveOrUpdate() {
        if(this.formSave.get('documentState').value){
            this.documentState = this.formSave.get('documentState').value
        }
        if (this.index === 0 || this.index === 2) {
          if (this.formPolicyDocumentRequestBeanList.value) {
            this.formPolicyDocumentRequestBeanList.value.forEach((item: any) => {
              if (this.documentState === 2) {
                this.isInvalidFileAttachment = false;
              } else {
                  this.documentState = 1
                if (item.isRequired === 1 && (!item.file || (item.file && !item.file.type)) && item.isDeleted == 1) {
                  this.isInvalidFileAttachment = true;
                }
              }
            })
          }
          if (this.formSave.get('objectType').value === 2 && !this.formSave.get('relationshipId').value) {
            this.isInvalidRelationship = true;
          }
          if (this.formSave.get('objectType').value === 2 && !this.formSave.get('objectId').value) {
            this.isInvalidObjectId = true;
          }
          if (this.formSave.get('documentState').value === 2 && !this.formSave.get('documentReason').value) {
              this.isInvalidDocumentNote = true;
          }
          if (this.isInvalidFileAttachment || this.isInvalidRelationship || this.isInvalidObjectId || this.isInvalidEndDate || this.isInvalidDocumentNote) {
            return;
          }
        }
        if (this.index !== 1 && this.index !== 4) {
          if (!CommonUtils.isValidForm(this.formSave) || !CommonUtils.isValidForm(this.formPolicyRequestAmountBOList)) {
              return;
          }
          if (!CommonUtils.isValidForm(this.formSave) || !CommonUtils.isValidForm(this.formPolicyDocumentRequestBeanList)) {
            return;
          }
        }
        if (this.index === 4 && !this.formSave.get('rejectReason').value) {
          this.isInvalidResonCancel = true;
          return;
        }
        if (this.formSave.get('status').value === null) {
          this.isInvalidStatus = true;
          return;
        }
        var formData: any = {};
        if (!CommonUtils.isNullOrEmpty(this.formSave.get('welfarePolicyRequestId').value)) {
            formData['welfarePolicyRequestId'] = this.formSave.get('welfarePolicyRequestId').value;
        }
        if(this.formPolicyDocumentRequestBeanList.value.length > 0){
            this.formPolicyDocumentRequestBeanList.value.forEach((item: any) => {
                if(item.file == null){
                    item.attachmentFileId = 0;
                }
            })
        }
        // if(this.formSave.get('documentState').value && (this.formSave.get('documentState').value == 2 && !this.formSave.get('note').value)){
        //     this.app.warningMessage("","Phải bổ sung ghi chú hồ sơ khi ở tình trạng thiếu hồ sơ!");
        //     return;
        // }
        formData['welfarePolicyCategoryId'] = this.formSave.get('welfarePolicyCategoryId').value;
        formData['employeeId'] = this.formSave.get('employeeId').value;
        formData['objectType'] = this.formSave.get('objectType').value;
        formData['objectId'] = this.formSave.get('objectId').value;
        formData['relationshipId'] = this.formSave.get('relationshipId').value;
        formData['startDate'] = this.formSave.get('startDate').value;
        formData['status'] = this.formSave.get('status').value;
        formData['endDate'] = this.formSave.get('endDate').value;
        formData['reason'] = this.formSave.get('reason').value;
        formData['chairmanType'] = this.formSave.get('chairmanType').value;
        formData['approveOrgId'] = this.formSave.get('approveOrgId').value;
        formData['documentState'] = this.formSave.get('documentState').value;
        formData['documentReason'] = this.formSave.get('documentReason').value;
        formData['note'] = this.formSave.get('note').value;
        formData['rejectReason'] = this.formSave.get('rejectReason').value;
        if(this.index !== 1 && this.index !== 4){
            formData['policyRequestAmountBOList'] = this.formPolicyRequestAmountBOList.value;
            if(this.index !== 3){
                formData['policyDocumentRequestFormList'] = this.formPolicyDocumentRequestBeanList.value;
            }
        }
        if (this.index === 3) {
            formData['status'] = 2;
        }
        if (this.index === 4) {
            formData['status'] = 3;
        }
        if (this.index === 0 || this.index === 2) {
          formData['actionType'] = 'view';
        }
        if (this.index === 1 || this.index === 3 || this.index === 4) {
          formData['actionType'] = 'popup';
        }
        if (this.index === 1) {
          this.welfarePolicyRequestService.saveOrUpdateFormFile(formData).subscribe(res => {
            if(res.code === "success" && res.data && res.data.welfarePolicyRequestId){
                window.location.reload();
                this.index = 0;
            }
          });
        } else {
          this.app.confirmMessage(null,
            () => {
              this.welfarePolicyRequestService.saveOrUpdateFormFile(formData).subscribe(res => {
                if(res.code === "success" && res.data && res.data.welfarePolicyRequestId){
                  if (this.index === 0) {
                    this.router.navigateByUrl(`/population/welfare-policy-request/view/${res.data.welfarePolicyRequestId}`);
                  } else if (this.index === 2 || this.index === 1) {
                      window.location.reload();
                      this.index = 0;
                  } else {
                    this.welfarePolicyRequestService.refreshList.next(res.data);
                    this.activeModal.close();
                    this.index = 0;
                  }
                }
              });
            },
            () => {

            }
          )
        }
    }

    processRunList() {
        if (!this.formSave.get('startDate').value || !this.formSave.get('chairmanType').value || !this.formSave.get('approveOrgId').value) {
          return;
        }
        var formData: any = {};
        formData['welfarePolicyRequestId'] = this.formSave.get('welfarePolicyRequestId').value;
        formData['welfarePolicyCategoryId'] = this.formSave.get('welfarePolicyCategoryId').value;
        formData['employeeId'] = this.formSave.get('employeeId').value;
        formData['objectType'] = this.formSave.get('objectType').value;
        formData['objectId'] = this.formSave.get('objectId').value;
        formData['relationshipId'] = this.formSave.get('relationshipId').value;
        formData['startDate'] = this.formSave.get('startDate').value;
        formData['status'] = this.formSave.get('status').value;
        formData['endDate'] = this.formSave.get('endDate').value;
        formData['reason'] = this.formSave.get('reason').value;
        formData['chairmanType'] = this.formSave.get('chairmanType').value;
        formData['approveOrgId'] = this.formSave.get('approveOrgId').value;
        formData['documentState'] = this.formSave.get('documentState').value;
        formData['documentReason'] = this.formSave.get('documentReason').value;
        formData['note'] = this.formSave.get('note').value;
        formData['rejectReason'] = this.formSave.get('rejectReason').value;
        formData['policyRequestAmountBOList'] = this.formPolicyRequestAmountBOList.value;
        this.welfarePolicyRequestService.makeListBirthday(formData).subscribe(data => {
          if (data && data.type === 'SUCCESS') {
            this.activeModal.close();
            this.index = 0;
            this.welfarePolicyRequestService.refreshList.next(data);
          }
      });
    }

    setDataListChairmanType(list, check){
        let checkType1 = false;
        let checkType2 = false;
        this.chairmanTypeList = []
        for(let item in list){
            if(list[item].chairmanType == 1 && !checkType1){
                this.chairmanTypeList.push({ name: 'Ban giám đốc', value: 1 });
                checkType1 = true
            }
            if(list[item].chairmanType == 2 && !checkType2){
                this.chairmanTypeList.push({ name: 'Đơn vị', value: 2 });
                checkType2 = true
            }
            if(checkType1 && checkType2){
                break;
            }
        }
        if((checkType1 && !checkType2) || (!checkType1 && checkType2)){
            this.formSave.get('chairmanType').setValue(this.chairmanTypeList[0].value)
            this.changeChairmanType(this.chairmanTypeList[0].value, check)
        }
    }

    changeWelfarePolicyCategory(event: any) {
      if (event) {
        this.formSave.get('chairmanType').setValue(null);
        this.formSave.get('documentState').setValue(null);
        this.formSave.get('documentReason').setValue(null);
        this.buildFormPolicyRequestAmountBOList();
        this.welfarePolicyCategoryId = event;
        this.welfarePolicyCategoryService.findOne(this.welfarePolicyCategoryId).subscribe(res => {
          if (res && res.data) {
            this.setDataListChairmanType(res.data.welfarePolicyNormBOList, 0)
            this.welfarePolicyCategoryInfo = res.data;
            this.formSave.get('reason').setValue(res.data.description);
            this.formSave.get('objectType').setValue(res.data.objectType);
            this.employeeStatus = res.data.employeeStatus;
            if (this.employeeStatus && (this.employeeStatus === 1 || this.employeeStatus === 2)) {
              this.employeeFilterCondition = ` AND obj.status = ${this.employeeStatus}`;
            } else {
              this.employeeFilterCondition = '';
            }
            if (res.data.objectType === 1) {
              this.disableRelationship = true;
              this.formSave.get('relationshipId').setValue(null);
              this.formSave.get('objectId').setValue(null);
            } else {
              this.disableRelationship = false;
              this.formSave.get('relationshipId').enabled;
              let listRelationship: any = [];
              res.data.relationShipList.forEach((ele: any) => {
                listRelationship.push(this.relationshipList.filter((item: any) => item.sysCatId === ele)[0])
              })
              this.relationshipOptions = listRelationship;
            }
            this.attachmentFileLabel = '';
            this.attachmentFileLabel1 = '';
            if (res.data.policyDocumentBOList && res.data.policyDocumentBOList.length) {
              this.attachmentFileLabel = 'Loại giấy tờ yêu cầu bắt buộc: ';
              this.attachmentFileLabel1 = 'Yêu cầu bổ sung: ';
              let label = '';
              res.data.policyDocumentBOList.forEach((item: any) => {
                if (item.isRequired === 1) {
                  label += item.name + '; ';
                }
              })
              if (label) {
                this.attachmentFileLabel += label;
                this.attachmentFileLabel1 += label;
              }
            }
            this.requestDocumentTypeOptions = res.data.policyDocumentBOList;
            this.buildFormPolicyDocumentRequestBeanList(res.data.policyDocumentBOList);
          }
        })
        if (this.formSave.get('employeeId').value) {
          this.curriculumVitaeService.findOne(this.formSave.get('employeeId').value).subscribe((res: any) => {
            if (res && res.data && res.data.employeeId) {
              if (this.welfarePolicyCategoryInfo && this.welfarePolicyCategoryInfo.objectType === 1) {
                this.objectNameOptions = [];
                this.objectNameOptions.push({name: res.data.employeeName, value: res.data.employeeId});
                this.formSave.get('objectId').setValue(res.data.employeeId);
              } else {
                this.formSave.get('objectId').setValue(null);
                this.objectNameOptions = [];
              }
            }
          });
        } else {
          this.formSave.get('objectId').setValue(null);
          this.objectNameOptions = [];
        }
      } else {
        this.formSave.get('chairmanType').setValue(null);
        this.buildFormPolicyRequestAmountBOList();
      }
    }

    changeRelationship(event: any) {
      if (event) {
        this.isInvalidRelationship = false;
        if (this.formSave.get('employeeId').value) {
          this.welfarePolicyRequestService.getObjectNameList(event, this.formSave.get('employeeId').value).subscribe(data => {
            this.objectNameOptions = [];
            if (data && data.data) {
              data.data.forEach((item: any) => {
                this.objectNameOptions.push({name: item.fullname, value: item.familyRelationshipId});
              })
              if (this.objectNameOptions && this.objectNameOptions.length === 1) {
                this.formSave.get('objectId').setValue(this.objectNameOptions[0].value);
              }
            }
          });
        }
      } else {
        this.formSave.get('objectId').setValue(null);
        this.objectNameOptions = [];
      }
    }

    changeObjectId(event: any){
        if(event){
            this.isInvalidObjectId = false;
        }
    }

    onChangeEmployee(event: any) {
      if (event) {
        if (event.selectField) {
          this.curriculumVitaeService.findOne(event.selectField).subscribe((res: any) => {
            if (res && res.data && res.data.employeeId) {
              if (this.formSave.get('relationshipId').value) {
                this.welfarePolicyRequestService.getObjectNameList(this.formSave.get('relationshipId').value, res.data.employeeId).subscribe((data: any) => {
                  this.objectNameOptions = [];
                  if (data && data.data) {
                    data.data.forEach((item: any) => {
                      this.objectNameOptions.push({name: item.fullname, value: item.familyRelationshipId});
                    })
                    if (this.objectNameOptions && this.objectNameOptions.length === 1) {
                      this.formSave.get('objectId').setValue(this.objectNameOptions[0].value);
                    }
                  }
                });
              } else {
                if (this.welfarePolicyCategoryInfo && this.welfarePolicyCategoryInfo.objectType === 1) {
                  this.objectNameOptions = [];
                  this.objectNameOptions.push({name: res.data.employeeName, value: res.data.employeeId});
                  this.formSave.get('objectId').setValue(res.data.employeeId);
                }
              }
            }
          });
          this.massOrganizationService.getListMassOrgByEmployeeId(event.selectField, 3).subscribe(res =>{
              if(res && res.length > 0){
                  this.formSave.controls['approveOrgId'].setValue(res[0].massOrganizationId);
                  this.massOrgIdByEmp = null
              }
          });
        } else {
          this.formSave.get('approveOrgId').setValue(null);
          this.formSave.get('objectId').setValue(null);
          this.formSave.controls['approveOrgId'].setValue(null);
          this.massOrgIdByEmp = null
          this.objectNameOptions = [];
        }
      }
    }

    changeChairmanType(event: any, check: any) {
        if (event) {
            let welfarePolicyNormBOList = [];
            if(check != 1 || this.index === 3){
                this.welfarePolicyCategoryService.findOne(this.welfarePolicyCategoryId).subscribe(res => {
                    if (res && res.data && res.data.welfarePolicyNormBOList) {
                        this.welfarePolicyCategoryInfo = res.data;
                        welfarePolicyNormBOList = this.welfarePolicyCategoryInfo.welfarePolicyNormBOList.filter((item: any) => item.chairmanType === event);
                        this.buildFormPolicyRequestAmountBOList(welfarePolicyNormBOList);
                    } else {
                        this.buildFormPolicyRequestAmountBOList();
                    }
                })
            }
        } else {

            this.buildFormPolicyRequestAmountBOList();
        }

    }

    changeStatus(event: any) {
      if (event !== null) {
        this.isInvalidStatus = false;
      } else {
        this.isInvalidStatus = true;
      }
    }

    changeStartDate(event: any) {
      if (event) {
        let date = new Date(event).getTime();
        if (this.formSave.get('endDate').value && date > this.formSave.get('endDate').value) {
          this.isInvalidEndDate = true;
        } else {
          this.isInvalidEndDate = false;
        }
      } else {
        this.isInvalidEndDate = false;
      }
    }

    changeEndDate(event: any) {
      if (event) {
        let date = new Date(event).getTime();
        if (this.formSave.get('startDate').value && date < this.formSave.get('startDate').value) {
          this.isInvalidEndDate = true;
        } else {
          this.isInvalidEndDate = false;
        }
      } else {
        this.isInvalidEndDate = false;
      }
    }

    changeDocumentState(event: any) {
      if (event) {
          this.isInvalidDocumentNote = false;
        this.documentState = event;
        if(event == 2){
            this.formSave.get('documentReason').setValue(this.attachmentFileLabel1 ? this.attachmentFileLabel1 : null)
        }else{
            this.formSave.get('documentReason').setValue(null)
        }
      } else {
        this.documentState = null;
      }
    }

    changeDocumentNote(event: any) {
        if (event && event.target && event.target.value) {
            this.isInvalidDocumentNote = false;
        }
    }

    changeReasonCancel(event: any) {
      if (event && event.target && event.target.value) {
        this.isInvalidResonCancel = false;
      } else {
        this.isInvalidResonCancel = true;
      }
    }

    onFileChange(event: any) {
      if (event) {
        this.isInvalidFileAttachment = false;
      }
    }

    navigate() {
      this.router.navigate(['/population/welfare-policy-request/update', this.welfarePolicyRequestId]);
    }

    openPopup(index: any) {
        this.activeModalAdditional(this.formSave.value, index);
    }

    activeModalAdditional(data?: any, index?: any) {
        if (index === 1) {
            this.app.confirm('label.welfare.policy.request.confirmStatus.message', 'label.welfare.policy.request.confirmStatus.title', () => {// on accepted
                const modalRef = this.modalService.open(WelfarePolicyRequestFormComponent, LARGE_MODAL_OPTIONS);
                if (data) {
                    modalRef.componentInstance.setFormValue(data, index);
                }
                modalRef.result.then((result: any) => {
                    if (!result) {
                        return;
                    }
                });
            }, () => {// on rejected
            });
        } else {
            const modalRef = this.modalService.open(WelfarePolicyRequestFormComponent, LARGE_MODAL_OPTIONS);
            if (data) {
                modalRef.componentInstance.setFormValue(data, index);
            } else {
                modalRef.componentInstance.setFormBirthDayValue(index);
            }
            modalRef.result.then((result: any) => {
                if (!result) {
                    return;
                }
            });
        }
    }

    public addRow(index: number, item: FormGroup) {
        const controls = this.formPolicyDocumentRequestBeanList as FormArray;
        const group = {
            welfarePolicyRequestId: [null],
            policyDocumentRequestId: [null],
            policyDocumentId: [null],
            isRequired: [null],
            isDeleted: [1],
            file: new FileControl(null),
        };
        const data = {
            welfarePolicyRequestId: item.value.welfarePolicyRequest,
            policyDocumentRequestId: [null],
            policyDocumentId: item.value.policyDocumentId,
            isRequired: item.value.isRequired,
            isDeleted: 1,
            file: new FileControl(null),
        };
        controls.insert(index + 1, this.buildForm(data, group));
    }

    public removeRow(index: number, item: FormGroup) {
        let count = 0
        for(let i in this.formPolicyDocumentRequestBeanList.value){
            if(this.formPolicyDocumentRequestBeanList.value[i].isDeleted == 1 && this.formPolicyDocumentRequestBeanList.value[i].policyDocumentId == item.value.policyDocumentId){
                count++;
            }
        }
        if(count > 1){
            let list = []
            for(let item of this.formPolicyDocumentRequestBeanList.controls){
                let data : any = item.get("file")
                const group = {
                    welfarePolicyRequestId: item.value.welfarePolicyRequestId,
                    policyDocumentRequestId: item.value.policyDocumentRequestId,
                    policyDocumentId: item.value.policyDocumentId,
                    isRequired: item.value.isRequired,
                    isDeleted: item.value.isDeleted,
                    fileAttachment: data.fileAttachment,
                };
                list.push(group)
            }
            list[index].fileAttachment = null
            list[index].isDeleted = 0
            this.buildFormPolicyDocumentRequestBeanList(list);
        }
    }
}
