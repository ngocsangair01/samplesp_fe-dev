import {Component, Input, OnInit} from "@angular/core";
import { BaseComponent } from "@app/shared/components/base-component/base-component.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {FormArray, FormGroup} from "@angular/forms";
import {ResponseResolutionMonthService} from "@app/core/services/party-organization/response-resolution-month.service";
import {AppComponent} from "@app/app.component";

@Component({
    selector: 'thorough-resolution-month-search',
    templateUrl: './thorough-resolution-month-search.component.html',
    styleUrls: ['./thorough-resolution-month-search.component.css']
})
export class ThoroughResolutionMonthSearchComponent extends BaseComponent implements OnInit {
    formSearch: FormGroup;
    data: [];
    recordsTotal: any;
    resultList: any;
    formConfig: any = {
        responseResolutionsMonthId: [null],
        listEmployeeId: [null],
        isReaded: [null],
        first: [0],
        rows: [10],
    };
    statusRead = [
        {label:"Đã đọc", value: 1},
        {label:"Chưa đọc", value: 0}
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
        this.processSearchEmployee();
    }

    public goBack() {
        this.activeModal.close();
    }

    get f() {
        return this.formSearch.controls;
    }

    processSearchEmployee(event?): void{
        if(event){
            this.formSearch.value['first'] = event.first;
            this.formSearch.value['rows'] = event.rows;
        }
        this.formSearch.value['listEmployeeId']  = this.formSearch.get('listEmployeeId').value;
        this.responseResolutionMonthService.searchEmployeeByThorough(this.formSearch.value).subscribe(res => {
            this.resultList = res
        })
    }
}