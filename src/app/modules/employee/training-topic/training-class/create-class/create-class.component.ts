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
    selector: 'create-class',
    templateUrl: './create-class.component.html',
    styleUrls: ['./create-class.component.css']
})
export class CreateClassComponent extends BaseComponent implements OnInit {
    viewMode = false;
    formGroup: FormGroup;
    header;
    isCreate = false;
    isMobileScreen: boolean = false;
    trainingTopicId
    formConfig = {
        trainingClassId: [null],
        trainingTopicId: [null],  // id chuong trinh dao tao
        titleTrainingTopic: [null], // tiêu đề chuong trinh dao tao
        thoroughLevel: [null], // cap trien khai
        thoroughLevelName: [null], // cap trien khai
        name: [null,ValidationService.required], //ten lop hoc
        classId: [null,ValidationService.required], //id lop hoc
        url: [null,ValidationService.required], //Link lop hoc
        objectType: [null], //Doi tuong dao tao,
        startDateTrainingTopic: [null], // ngay bat dau cua chuyen de
        endDateTrainingTopic: [null], // ngay ket thuc cua chuyen de
        startDate: [null, [ValidationService.required]], // ngay bat dau
        endDate: [null, ValidationService.required], // ngay ket thuc
        objectTypeTraining: [null], // ten nhom doi tuong
    };



    emptyFilterMessage = this.translation.translate('selectFilter.emptyFilterMessage');

    userInfo = {employeeId: null};


    parentStartDate;
    resourceCode = 'CTCT_TRAINING_CLASS';
    userDomain;

    progressStatus = '';
    PROGRESS = {
        WAITING: 'WAITING',
        INPROGRESS: 'INPROGRESS',
        ENDED: 'ENDED'
    }

    resBranch;

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


        this.formGroup = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT);
        // let grantedDomain = HrStorage.getGrantedDomainByCode(CommonUtils.getPermissionCode('action.insert')
        //     , CommonUtils.getPermissionCode('CTCT_TRAINING_TOPIC'));
        // if (grantedDomain) {
        //     this.partyOrgService.findAllByDomain(grantedDomain).subscribe(res => {
        //
        //     })
        // }
        // this.partyMemebersService.findLoginPartyMember().subscribe(resUserData => {
        const subPaths = this.router.url.split('/');
        if (subPaths.length > 4) {
            this.trainingTopicId = subPaths[4]
        }
        if (this.trainingTopicId) {
            this.header = "Thông tin thêm mới";

            this.service.findInfoToCreateTrainingClass(this.trainingTopicId).subscribe(res => {
                this.formGroup = this.buildForm(res.data, this.formConfig, ACTION_FORM.INSERT);
            });
        }
    }







    ngOnInit() {

    }

    previous() {
        this.router.navigateByUrl('/employee/training-topic');
    }

    get f() {
        return this.formGroup.controls;
    }






    save() {
        if (!CommonUtils.isValidForm(this.formGroup) || this.validateEndDate() || this.validateStartDate()) {
            return;
        }


        this.saveData();



    }

    saveData() {

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
                            this.router.navigateByUrl(`/employee/training-topic`)
                        }
                    });
            },
            () => {
            }
        )
        // }
    }

    navigate(trainingTopicId) {
        this.router.navigateByUrl(`/employee/training-topic/create-update/${trainingTopicId}`);
    }

    cloneFormGroup(formGroup: FormGroup): FormGroup {
        const copiedControls = {};
        Object.keys(formGroup.controls).forEach(controlName => {
            const control = formGroup.controls[controlName];
            copiedControls[controlName] = new FormControl(control.value);
        });
        return new FormGroup(copiedControls);
    }

    validateStartDate() {
        if(this.formGroup.controls['startDateTrainingTopic'].value && this.formGroup.controls['startDate'].value) {
            const startDate = this.formGroup.controls['startDate'].value
            const startDateTrainingTopic = this.formGroup.controls['startDateTrainingTopic'].value
            if (startDate < startDateTrainingTopic) {
                return true;
            }
        }
        return false;
    }

    validateEndDate() {
        if(this.formGroup.controls['endDate'].value && this.formGroup.controls['startDate'].value) {
            const endDate = this.formGroup.controls['endDate'].value
            const startDate = this.formGroup.controls['startDate'].value
            if (endDate < startDate) {
                return true;
            }
        }
        return false;
    }

}
