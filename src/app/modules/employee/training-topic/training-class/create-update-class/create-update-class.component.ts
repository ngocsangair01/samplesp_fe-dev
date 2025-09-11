import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {BaseComponent} from '@app/shared/components/base-component/base-component.component';
import {CommonUtils, ValidationService} from '@app/shared/services';
import {
    ACTION_FORM,
    APP_CONSTANTS,
    DEFAULT_MODAL_OPTIONS,
    LARGE_MODAL_OPTIONS,
    MEDIUM_MODAL_OPTIONS,
    PartyOrganizationService,
    RESOURCE,
} from '@app/core';
import {AppComponent} from '@app/app.component';
import {DialogService} from 'primeng/api';
import {HelperService} from '@app/shared/services/helper.service';
import {FileStorageService} from '@app/core/services/file-storage.service';
import {FileControl} from '@app/core/models/file.control';
import {Router} from '@angular/router';
import {TranslationService} from 'angular-l10n';
import {TrainingTopicService} from '@app/core/services/training-topic/training-topic.service';
import {HrStorage} from '@app/core/services/HrStorage';
import {PartyMemebersService} from '@app/core/services/party-organization/party-members.service';
import {MultiFileChooserV2Component} from '@app/shared/components/file-chooser/multi-file-chooser-v2.component';
import {PartyOrgSelectorComponent} from '@app/shared/components/party-org-selector/party-org-selector.component';
import {CategoryService} from '@app/core/services/setting/category.service';

import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
    RewardProcessLoadModalComponent
} from "@app/modules/reward/reward-propose/reward-process-load-modal/reward-process-load-modal.component";
import {Subject} from "rxjs";
import {
    RewardImportManageComponent
} from "@app/modules/reward/reward-general-form/file-import-management/reward-import-manage.component";
import {
    FileImportPopupComponent
} from "@app/modules/employee/training-topic/create-update/file-import-popup/file-import-popup.component";

@Component({
    selector: 'create-update-class',
    templateUrl: './create-update-class.component.html',
    styleUrls: ['./create-update-class.component.css']
})
export class CreateOrUpdateClassComponent extends BaseComponent implements OnInit {
    viewMode = false;
    saveDataImport: Subject<boolean> = new Subject<boolean>();
    loadDataIntoForm: Subject<any> = new Subject<any>();
    dataToLoadIntoForm: any;
    form;
    resetFormSubject: Subject<any> = new Subject<any>();
    isBranch = false;
    formGroup: FormGroup;
    header;
    isCreate = false;
    editable = false;
    isMobileScreen: boolean = false;
    parentEndDate;
    parentFinishNumberDate;
    trainingClassId;
    trainingTopicId;
    formConfig = {
        trainingTopicId: [null],  // id chuong trinh dao tao
        trainingClassId: [null], // id dao tao cap tren,
        name: [null, ValidationService.required], // Ten lop hoc
        classId: [null, ValidationService.required], // Id lop hoc
        url: [null,ValidationService.required], //Link lop hoc
        startDate: [null, [ValidationService.required]], // ngay bat dau
        endDate: [null, ValidationService.required], // ngay ket thuc
        averageAmount: [null, [ValidationService.number]],
        numberAmount: [null, [ValidationService.required, ValidationService.number]],
        goodAmount: [null, [ValidationService.number]],
        excellentAmount: [null, [ValidationService.number]],
        classMemberBeanList: []
    };
    formConfigThoroughed = {
        trainingTopicId: [null],  // id chuong trinh dao tao
        trainingClassId: [null], // id dao tao cap tren,
        name: [null, ValidationService.required], // Ten lop hoc
        classId: [null, ValidationService.required], // Id lop hoc
        url: [null,ValidationService.required], //Link lop hoc
        startDate: [null, [ValidationService.required]], // ngay bat dau
        endDate: [null, ValidationService.required], // ngay ket thuc
        averageAmount: [null, [ValidationService.number]],
        numberAmount: [null, [ValidationService.required, ValidationService.number]],
        goodAmount: [null, [ValidationService.number]],
        excellentAmount: [null, [ValidationService.number]],
        classMemberBeanList: []
    };



    emptyFilterMessage = this.translation.translate('selectFilter.emptyFilterMessage');

    userInfo = {employeeId: null};

    resourceCode = 'CTCT_TRAINING_CLASS';
    userDomain;


    constructor(
        private app: AppComponent,
        public dialogService: DialogService,
        public helperService: HelperService,
        private partyOrgService: PartyOrganizationService,
        private router: Router,
        private service: TrainingTopicService,
        private partyMemebersService: PartyMemebersService,
        private partyOrganizationService: PartyOrganizationService,
        private categoryService: CategoryService,
        public translation: TranslationService,
        private fb: FormBuilder,
    ) {
        super(null, CommonUtils.getPermissionCode("resource.trainingClass"));
        this.setMainService(this.service);
        // this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
        this.userInfo = HrStorage.getUserToken().userInfo;


        const filesAttachedControl = new FileControl(null);
        this.viewMode = this.router.url.includes('/employee/training-topic/view-class');

        this.formGroup = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT);
        const subPaths = this.router.url.split('/');
        if (subPaths.length > 4) {
            this.trainingTopicId = subPaths[4]
        }
        if (subPaths.length > 5) {
            this.trainingClassId = subPaths[5]
        }
        if (this.trainingClassId) {
            this.header = "Thông tin lớp học đào tạo";
            this.editable = true;
            this.service.findByTrainingClassId(this.trainingClassId).subscribe(res => {

                // this.formGroup.value.thoroughLevel = res.data.thoroughLevel
                    this.formGroup = this.buildForm(res.data, this.formConfigThoroughed, ACTION_FORM.UPDATE);
                    //load danh sach don vi can nop
                this.initValueChange();
            });
        } else {
            this.header = "Thông tin thêm mới";
            this.isCreate = true;
            this.formGroup.get('startDate').reset(new Date().setHours(0,0,0,0));
            this.initValueChange();
        }
    }




    initFormGroupAfter() {
        // this.onChangeThoroughLevel()
    }

    initValueChange() {

    }

    ngOnInit() {
        this.initValueChange();
    }

    previous() {
        this.router.navigateByUrl(`/employee/training-topic/view-list-class/${this.trainingTopicId}`);
    }

    get f() {
        return this.formGroup.controls;
    }




    save() {
        this.formGroup.value.trainingClassId = this.trainingClassId
        if (!CommonUtils.isValidForm(this.formGroup)) {
            return;
        }
        this.saveData();
    }

    saveData() {
        // Lưu lại
        this.app.confirmMessage(null,
            () => {

                 this.service.saveOrUpdateTrainingClassForm(this.formGroup.value)
                        .subscribe(res => {
                            // if (res.code == "success" && history.state.thoroughContentId) {
                            //   this.router.navigateByUrl('/employee/thorough-content/view', { state: this.formGroup.value });
                            // } else if (res.code == "success") {
                            //   this.router.navigateByUrl('/employee/thorough-content');
                            // }
                            if (res.code == "success") {
                                    this.router.navigateByUrl(`/employee/training-topic/view-list-class/${this.trainingTopicId}`)

                            }
                        });
            },
            () => {
            }
        )
        // }
    }

    cloneFormGroup(formGroup: FormGroup): FormGroup {
        const copiedControls = {};
        Object.keys(formGroup.controls).forEach(controlName => {
            const control = formGroup.controls[controlName];
            copiedControls[controlName] = new FormControl(control.value);
        });
        return new FormGroup(copiedControls);
    }






    public setDataToForm(res) {
        this.dataToLoadIntoForm = res;
        this.loadDataIntoForm.next(res.data);
    }


}
