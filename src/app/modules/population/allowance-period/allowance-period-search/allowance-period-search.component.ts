import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {Router} from "@angular/router";
import {AppComponent} from "@app/app.component";
import {APP_CONSTANTS} from "@app/core";
import {AllowancePeriodService} from "@app/core/services/population/allowance-period.service";

@Component({
    selector: 'allowance-period-search',
    templateUrl: './allowance-period-search.component.html',
    styleUrls: ['./allowance-period-search.component.css']
})
export class AllowancePeriodSearchComponent extends BaseComponent implements OnInit {
    formConfig = {
        name: [null],
        allowanceType: [null],
        orgType: [null],
        approveOrgId: [null],
        startDate: [null],
        endDate: [null],
        startYear: [null],
        endYear: [null],
        status: [null],
        isName: [false],
        isAllowanceType: [false],
        isOrgType: [false],
        isApproveOrgId: [false],
        isStartDate: [false],
        isEndDate: [false],
        isStartYear: [false],
        isEndYear: [false],
        isStatus: [false],
    };
    yearList: Array<any>;
    currentDate = new Date();
    currentYear = this.currentDate.getFullYear();
    orgTypeOptions;
    allowanceTypeOptions = []
    statusList = [
        { name: 'Dự thảo', value: 0 },
        { name: 'Đang triển khai', value: 1 },
        { name: 'Đã hoàn thành', value: 2 },
    ]

    constructor(private router: Router,
                private allowancePeriodService : AllowancePeriodService,
                private app: AppComponent,
    ) {
        super();
        this.yearList = this.getYearList();
        this.setMainService(allowancePeriodService);
        this.allowancePeriodService.checkPermissionAllowance().subscribe(res => {
            if(res){
                this.allowanceTypeOptions = []
                if(res.illnessAllowance === 1){
                    this.allowanceTypeOptions.push({ name: 'Trợ cấp bệnh', value: 3 })
                }
                if(res.infertilityAllowance === 1){
                    this.allowanceTypeOptions.push({ name: 'Trợ cấp hiếm muộn', value: 4 })
                }
                if(res.supportAllowance === 1){
                    this.allowanceTypeOptions.push({ name: 'Hỗ trợ', value: 2 })
                }
            }
        })
        this.orgTypeOptions = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;
    }

    ngOnInit() {
        this.formSearch = this.buildForm({}, this.formConfig);
        this.processSearch();
    }

    private getYearList() {
        const yearList = [];
        for (let i = (this.currentYear - 20); i <= (this.currentYear + 20); i++) {
            const obj = {
                year: i
            };
            yearList.push(obj);
        }
        return yearList;
    }

    get f() {
        return this.formSearch.controls;
    }

    additional(){
        this.router.navigate(['/population/allowance-period/create'])
    }

    edit(item) {
        this.router.navigate(['/population/allowance-period/edit', item.allowancePeriodId])
    }

    viewDetail(item) {
        this.router.navigate(['/population/allowance-period/view', item.allowancePeriodId])
    }

    processDelete(item){
        this.app.confirmDelete(null, () => {// on accepted
            this.allowancePeriodService.deleteById(item.allowancePeriodId).subscribe(res => {
                if (res.code == 'warning') {

                } else {
                    this.processSearch();
                }
            })
        }, () => {

        });

    }

    changeProcess(item, status){
        if(item){
            this.allowancePeriodService.updateStatus({allowancePeriodId: item.allowancePeriodId, status: status}).subscribe(res =>{
                if(res.code == 'success'){
                    this.processSearch();
                }
            })
        }
    }
}
