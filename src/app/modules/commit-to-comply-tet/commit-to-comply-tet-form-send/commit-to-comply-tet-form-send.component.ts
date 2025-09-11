import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig} from 'primeng/api';
import {DynamicDialogRef} from 'primeng/api';
import {CommonUtils, ValidationService} from '@app/shared/services';
import {BaseComponent} from '@app/shared/components/base-component/base-component.component';
import {FormGroup} from '@angular/forms';
import {
    EmployeesRegistrationListService
} from "@app/core/services/employee-registration-list/employees-registration-list.service";

@Component({
    templateUrl: './commit-to-comply-tet-form-send.component.html',
})
export class CommitToComplyTetFormSendComponent extends BaseComponent implements OnInit {
    checkedEmail = false;
    raise = '';
    formConfig = {
        checkedId: [''],
        subject: ['', ValidationService.required],
        message : ['', ValidationService.required],
        sendEmail: [0],
        sendSms: [0],
        competitionProgramId: [null],
    }

    form: FormGroup

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private service: EmployeesRegistrationListService,
    ) {
        super(null, CommonUtils.getPermissionCode("CTCT_BVAN_TET_COMMIT"));
    }

    ngOnInit() {
        this.form = this.buildForm('', this.formConfig)
        if (this.config.data) {
            let value = {...this.config.data};
            this.form = this.buildForm(value, this.formConfig);
        }
    }

    changeSendEmail(event){
        if (event.currentTarget.checked) {
            this.checkedEmail = true
            this.form.controls['sendEmail'].setValue('1')

        }else{
            this.checkedEmail = false
            this.form.controls['sendEmail'].setValue('0')
        }
    }

    changeSendSms(event){
        if (event.currentTarget.checked) {
            this.form.controls['sendSms'].setValue('1')
        }else{
            this.form.controls['sendSms'].setValue('0')
        }
    }

    public goBack() {
        this.ref.close(true)
    }

    save() {
        if(this.form.value.checkedId.length == 0){
            this.raise = "Chưa chọn cá nhân/ đơn vị nhận thông báo!"
            return
        }
        else if ((this.form.value.sendSms == 0 && this.form.value.sendEmail == 0)) {
            this.raise = "Chưa chọn hình thức gửi thông báo!"
            return
        }
        else if((this.form.value.sendEmail == 1 && (!this.form.value.subject || !this.form.value.message)) ||
            (this.form.value.sendSms == 1 && !this.form.value.message)){
            this.raise = "Chưa nhập đủ các trường dữ liệu để gửi thông báo!"
            return
        }else if((this.form.value.sendSms == 1 && this.form.value.message.length > 500) || (this.form.value.sendEmail == 1 && this.form.value.sendSms == 1 && this.form.value.message.length > 500)){
            this.raise = "Nội dung gửi sms không thể vượt quá 500 ký tự!"
            return
        }else if(this.form.value.sendEmail == 1 && this.form.value.subject.length > 990){
            this.raise = "Tiêu đề gửi sms không thể vượt quá 990 ký tự!"
            return
        }
        if (this.form.value.sendSms == 1){
            this.service.sendSms({"employeeCodeList": this.form.value.checkedId, "message": this.form.value.message, "subject": this.form.value.subject})
                .subscribe(res => {
                    if (res.type == "SUCCESS")
                        this.goBack()
                })
        }
        if (this.form.value.sendEmail == 1){
            this.service.sendMail({"employeeCodeList": this.form.value.checkedId, "message": this.form.value.message, "subject": this.form.value.subject})
                .subscribe(res => {
                    if (res.type == "SUCCESS")
                        this.goBack()
                })
        }
    }
}
