import {Component, Input, OnInit} from "@angular/core";
import { BaseComponent } from "@app/shared/components/base-component/base-component.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {FormArray, FormGroup, Validators} from "@angular/forms";
import {CommonUtils} from "@app/shared/services";
import {ResponseResolutionMonthService} from "@app/core/services/party-organization/response-resolution-month.service";
import {AppComponent} from "@app/app.component";

@Component({
    selector: 'thorough-resolution-month-form',
    templateUrl: './thorough-resolution-month-form.component.html',
    styleUrls: ['./thorough-resolution-month-form.component.css']
})
export class ThoroughResolutionMonthFormComponent extends BaseComponent implements OnInit {
    formSearch: FormGroup;
    data: [];
    recordsTotal: any;
    resultList: any;
    isEmptyEmployee: any;
    formConfig: any = {
        thoroughResolution: [null, Validators.required],
        listEmployeeId: [null],
        responseResolutionsMonthId: [null],
        first: [0],
        rows: [10],
    };
    thoroughResolutionOptions = [
        {label:"Quán triệt cho toàn tổ chức", value: 1},
        {label:"Quán triệt cho cấp ủy", value: 2},
        {label:"Quán triệt cho cá nhân cụ thể ", value: 3}
    ];
    @Input() public responseResolutionsMonthId;

    constructor(
        public activeModal: NgbActiveModal,
        private app: AppComponent,
        private responseResolutionMonthService : ResponseResolutionMonthService,
    ) {
        super();
    }

    ngOnInit() {
        this.formSearch = this.buildForm({responseResolutionsMonthId: this.responseResolutionsMonthId}, this.formConfig)
        this.formSearch.controls['listEmployeeId'] = new FormArray([]);
    }

    public goBack() {
        this.activeModal.close();
    }

    get f() {
        return this.formSearch.controls;
    }

    changeSelectEmployee(){
        this.isEmptyEmployee = false;
        this.formSearch.value['listEmployeeId']  = this.formSearch.get('listEmployeeId').value;
        this.processSearchEmployee();
    }

    processSearchEmployee(event?): void{
        if(event){
            this.formSearch.value['first'] = event.first;
            this.formSearch.value['rows'] = event.rows;
        }
        this.responseResolutionMonthService.getEmployeeBySelectThorough(this.formSearch.value).subscribe(res => {
            this.resultList = res
        })
    }

    getListEmp(){
        this.isEmptyEmployee = false;
        if(this.formSearch.value.thoroughResolution == 3 && this.formSearch.value.listEmployeeId.length == 0){
            this.isEmptyEmployee = true
        }else{
            if (!CommonUtils.isValidForm(this.formSearch)) {
                return
            }
            this.responseResolutionMonthService.processThorough(this.formSearch.value).subscribe(res => {
                if(res.code == "success"){
                    this.activeModal.close();
                }
            })
        }
    }
}