import {ACTION_FORM} from '@app/core';
import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ValidationService} from '@app/shared/services';
import {FileControl} from '@app/core/models/file.control';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseComponent} from '@app/shared/components/base-component/base-component.component';
import * as moment from 'moment';
import {AssessmentFormulaService} from "@app/core/services/assessment-formula/assessment-formula.service";
import {HelperService} from "@app/shared/services/helper.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CompetitionResultService} from "@app/core/services/competition-result/competition-result.service";
import {UnitRegistrationService} from "@app/core/services/unit-registration/unit-registration.service";

@Component({
    selector: 'competition-unit-registration-update',
    templateUrl: './competition-unit-registration-update-result.component.html',
    styleUrls: ['./competition-unit-registration-update-result.component.css']

})
export class UnitRegistrationUpdateResultComponent extends BaseComponent implements OnInit {
    formSave: FormGroup;
    generalAssessmentList: any;
    validateCompletionRate = '';
    validateDetailDescription = '';
    validateGeneralAssessment = '';
    validateOtherEvaluation = '';
    public isGeneralAssessment: boolean = false;
    empTypeList: any;
    fileControl = new FileControl(null);
    competitionRegistrationCode: string = "";
    competitionName: string = "";
    competitionProgramCode: string = "";
    checked: boolean;
    checkedPercent: boolean;
    preCompletionRateInput: string = "";
    generalAssessment: any;
    inputWidth: string = "2";

    formConfig = {
        competitionRegistrationId: [''], // id đăng ký đơn vị
        competitionRegistrationCode: [''], // code đăng ký đơn vị
        competitionProgramCode: [''], //code chương trình thi đua
        competitionName: [''], // tên chương trình thi đua
        updatedTime: [''], // ngày cập nhật
        completionRate: ['', [ValidationService.required]], // tỉ lệ hoàn thành
        detailDescription: ['', [ValidationService.required]], // mô tả chi tiết
        resultEvaluation: ['', [ValidationService.required]], // đánh giá
        status: [''], // trạng thái trình ký
        generalAssessment: [''],
        typeCompetitionResult: ['',],
        otherEvaluation: ['', [ValidationService.required]]
    };


    constructor(private router: Router,
                public actr: ActivatedRoute,
                public a: AssessmentFormulaService,
                public helperService: HelperService,
                public activeModal: NgbActiveModal,
                public competitionResultService: CompetitionResultService,
                public unitRegistrationService: UnitRegistrationService
    ) {
        super();
        this.formSave = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT, []);
        this.generalAssessmentList = [
            {
                id: 'COMPLETED',
                name: "Hoàn thành"
            },
            {
                id: 'NOT_COMPLETED',
                name: "Không hoàn thành"
            },
            {
                id: 'GOOD_COMPLETED',
                name: "Hoàn thành tốt"
            },
            {
                id: 'EXCELLENTLY',
                name: "Hoàn thành xuất sắc"
            },
            {
                id: 'ORTHER',
                name: "Khác"
            }
        ];


    }


    /**
     * ngOnInit
     */
    ngOnInit() {

        this.formSave.controls['updatedTime'].setValue(moment(new Date().getTime()));
        this.competitionProgramCode = localStorage.getItem('dataCompetitionCode');
        this.competitionName = localStorage.getItem('dataCompetitionName');
        this.competitionRegistrationCode = localStorage.getItem('dataCompetitionRegistrationCode');
        this.formSave.get('competitionName').setValue(this.competitionName);
        this.formSave.get('competitionProgramCode').setValue(this.competitionProgramCode);

    }

    public setFormValue(propertyConfigs: any, data?: any) {
        this.propertyConfigs = propertyConfigs;
        this.formSave = this.buildForm(data, this.formConfig);
    }

    changeLeadSendMessage(event) {
        if (event.currentTarget.checked) {
            this.checked = true
        } else {
            this.checked = false
        }
    }



    /**
     * Kích hoạt để chọn kết quả cuối cùng
     * @param event
     */
    public onChangeResultFinal(event) {
        if (event.target.checked) {
            this.isGeneralAssessment = true;
        } else {
            this.isGeneralAssessment = false;
        }
    }

    modelChanged(event) {
        const inputData = event.target.value
        let check = inputData.split('')
        const reg = new RegExp(/^[0-9]*$/g);
        const isValid = reg.test(inputData)
        if (isValid || inputData === '') {
            if (inputData === '') {
                this.checkedPercent = false;
            } else {
                this.validateCompletionRate = ""
                this.checkedPercent = true;
            }
            //fix bug hiển thị số 0% của tỉ lệ hoàn thành
            if (check[0] == '0' && check[1]!="") {
                this.preCompletionRateInput = check[0]
                this.inputWidth ="2"
            }else{
                this.preCompletionRateInput = event.target.value
                this.inputWidth = inputData.length + 1
            }

            if (inputData.length == 2 && inputData === '0' || inputData === '-') {
                event.target.value = '';
                this.checkedPercent = false
            } else {
                event.target.value = this.preCompletionRateInput
            }
        }else{
            event.target.value = this.preCompletionRateInput
        }
    }

    handleValid(event){
        if(event.target.value){
            this.validateDetailDescription = ''
        }
    }

    handleOtherEvaluation(event){
        if (event.target.value){
            this.validateOtherEvaluation = ''
        }
    }

    public checkRequire() {
        let flat = true;
        if (this.formSave.value.completionRate.trim().length == 0) {
            this.validateCompletionRate = "Trường tỷ lệ hoàn thành không để trống!"
            flat = false;
        }
        if (this.formSave.value.detailDescription.length == 0) {
            this.validateDetailDescription = "Trường mô tả chi tiết không được để trống!"
            flat = false
        }
        return flat;
    }


    /**
     * processSaveOrUpdate
     */

    processSaveOrUpdate() {

        let flat =  this.checkRequire();

        if (this.checked) {
            if (this.formSave.value.generalAssessment.length == 0) {
                this.formSave.controls['generalAssessment'].setValue('COMPLETED');

            } else if (this.formSave.get('generalAssessment').value == "OTHER" && this.formSave.value.otherEvaluation.length == 0) {
                this.validateOtherEvaluation = "Trường đánh giá khác không để trống!"
                return false;
            }
            this.formSave.get('typeCompetitionResult').setValue('FINAL_RESULT')
            this.formSave.value['resultEvaluation'] = this.formSave.get('generalAssessment').value;
            this.formSave.value['otherEvaluation'] = this.formSave.get('otherEvaluation').value;
            this.formSave.value['competitionProgramCode'] = this.formSave.get('competitionProgramCode').value;

        } else {
            this.formSave.get('typeCompetitionResult').setValue('RESULT')
            this.formSave.get('resultEvaluation').setValue('EMPTY')
        }

        let rate = this.formSave.value.completionRate.split('')
        const reg = new RegExp(/^[0-9]*$/g);
        const isValid = reg.test(this.formSave.get('completionRate').value)
        let rateOutput = "";
        if (isValid===false) {
            for (let i = 0; i < rate.length - 1; i++) {
                rateOutput += rate[i]
            }
            this.formSave.value['completionRate'] = rateOutput;
        }

        if (flat) {

            this.competitionResultService.saveResult(this.formSave.value).subscribe(res => {
                this.activeModal.close(res)
            })
        }

    }


    get f() {
        return this.formSave.controls;
    }

    // quay lai
    public goBack() {
        this.activeModal.close()
    }

    myGreeting() {
        window.location.reload()
    }


}