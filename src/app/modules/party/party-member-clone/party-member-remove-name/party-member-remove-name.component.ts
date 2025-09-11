import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileControl } from '@app/core/models/file.control';
import { DocumentService } from '@app/core/services/document/document.service';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import * as moment from 'moment';
import { ACTION_FORM } from './../../../../core/app-config';

@Component({
    selector: 'party-member-remove-name',
    templateUrl: './party-member-remove-name.component.html'
})
export class PartyMemberRemoveNameComponent extends BaseComponent implements OnInit {
    formPartyMemberExclusion: FormGroup;
    dateValue: Date;
    formConfig = {
        employeeId: [''],
        partyMemberId: [''],
        employeeCode: [''],
        fullName: [''],
        partyOfficialAdmissionDate: [''],
        positionName: [''],
        empTypeName: [''],
        dateOfBirth: [''],
        genderName: [''],
        personalIdNumber: [''],
        phoneNumber: [''],
        documentId: [255],
        actionDate: [''],
        reason: ['', [Validators.maxLength(1000)]],
        status: [2],
        documentNumber: ['', Validators.required],
        organizationId: ['']
    };
    constructor(
        private router: Router,
        public actr: ActivatedRoute,
        private partyMemebersService: PartyMemebersService,
        private documentService: DocumentService
    ) {
        super(null, CommonUtils.getPermissionCode("resource.partyMember"));
        this.formPartyMemberExclusion = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW);
        this.formPartyMemberExclusion.addControl('files', new FileControl(null));
    }
    ngOnInit() {
        const employeeId = this.actr.snapshot.params.id;
        this.formPartyMemberExclusion.get('employeeId').setValue(employeeId);
        this.onChangeInforEmployee();
    }

    get f() {
        return this.formPartyMemberExclusion.controls;
    }

    onChangeInforEmployee() {
        if (this.formPartyMemberExclusion.value.employeeId != '') {
            this.partyMemebersService.findEmployeeExclusionById(this.formPartyMemberExclusion.value.employeeId).subscribe(res => {
                const partyOfficialAdmissionDate = new Date(res.data[0].partyOfficialAdmissionDate);
                this.formPartyMemberExclusion.get('partyMemberId').setValue(res.data[0].partyMemberId);
                this.formPartyMemberExclusion.get('fullName').setValue(res.data[0].fullName);
                this.formPartyMemberExclusion.get('partyOfficialAdmissionDate').setValue(moment(partyOfficialAdmissionDate).format('DD/MM/YYYY'));
                this.formPartyMemberExclusion.get('positionName').setValue(res.data[0].positionName);
                this.formPartyMemberExclusion.get('empTypeName').setValue(res.data[0].empTypeName);
                this.formPartyMemberExclusion.get('dateOfBirth').setValue(res.data[0].dateOfBirth);
                this.formPartyMemberExclusion.get('genderName').setValue(res.data[0].genderName);
                this.formPartyMemberExclusion.get('personalIdNumber').setValue(res.data[0].personalIdNumber);
                this.formPartyMemberExclusion.get('phoneNumber').setValue(res.data[0].phoneNumber);
                this.formPartyMemberExclusion.get('organizationId').setValue(res.data[0].organizationId);
            })
        } else {
            this.formPartyMemberExclusion.get('partyMemberId').setValue('');
            this.formPartyMemberExclusion.get('fullName').setValue('');
            this.formPartyMemberExclusion.get('partyOfficialAdmissionDate').setValue('');
            this.formPartyMemberExclusion.get('positionName').setValue('');
            this.formPartyMemberExclusion.get('empTypeName').setValue('');
            this.formPartyMemberExclusion.get('dateOfBirth').setValue('');
            this.formPartyMemberExclusion.get('genderName').setValue('');
            this.formPartyMemberExclusion.get('personalIdNumber').setValue('');
            this.formPartyMemberExclusion.get('phoneNumber').setValue('');
            this.formPartyMemberExclusion.get('organizationId').setValue('');
        }
    }

    onChangeActionDate() {
        if (this.formPartyMemberExclusion.value.documentId != '') {
            this.documentService.findByNumber(this.formPartyMemberExclusion.value.documentId).subscribe(res => {
                this.dateValue = res.data.effectiveDate;
                this.formPartyMemberExclusion.get('actionDate').setValue(res.data.effectiveDate);
            })
        }
    }

    /**
   * goBack
   */
    public goBack() {
        this.router.navigate(['/party-organization/party-member-clone']);
    }

    exclusion() {
        this.formPartyMemberExclusion.controls['files'].updateValueAndValidity();
        if (!CommonUtils.isValidForm(this.formPartyMemberExclusion)) {
            return;
        }
        this.partyMemebersService.insertPartyMemberStatus(this.formPartyMemberExclusion.value).subscribe(res => {
            if (this.partyMemebersService.requestIsSuccess(res)) {
                this.goBack();
            }
        })
    }
}