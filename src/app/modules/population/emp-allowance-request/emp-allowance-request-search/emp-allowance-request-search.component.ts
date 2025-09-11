import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {Router} from "@angular/router";
import {AppComponent} from "@app/app.component";
import {AllowancePeriodService} from "@app/core/services/population/allowance-period.service";
import {EmpAllowanceRequestService} from "@app/core/services/population/emp-allowance-request.service";
import {APP_CONSTANTS, DEFAULT_MODAL_OPTIONS} from "@app/core";
import {WelfarePolicyCategoryService} from "@app/core/services/population/welfare-policy-category.service";
import {CommonUtils} from "@app/shared/services";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
    EmpAllowanceRequestPopupComponent
} from "@app/modules/population/emp-allowance-request/emp-allowance-request-popup/emp-allowance-request-popup.component";
import {MassOrganizationService} from "@app/core/services/mass-organization/mass-organization.service";
import {HrStorage} from "@app/core/services/HrStorage";
import {CategoryService} from "@app/core/services/setting/category.service";

@Component({
    selector: 'emp-allowance-request-search',
    templateUrl: './emp-allowance-request-search.component.html',
    styleUrls: ['./emp-allowance-request-search.component.css']
})
export class EmpAllowanceRequestSearchComponent extends BaseComponent implements OnInit {
    deseaseCode = 'DANH_MUC_BENH';
    deseaseOptions;
    formConfig = {
        allowancePeriodId: [null],
        isAllowancePeriodId: [null],
        allowanceType: [null],
        isAllowanceType: [null],
        year: [null],
        isYear: [null],
        welfarePolicyCategoryId: [null],
        isWelfarePolicyCategory: [null],
        orgType: [null],
        isOrgType: [null],
        approveOrgId: [null],
        isApproveOrgId: [null],
        employeeId: [null],
        isEmployeeId: [null],
        objectName: [null],
        isObjectName: [null],
        startDate: [null],
        isStartDate: [null],
        endDate: [null],
        isEndDate: [null],
        status: [null],
        isStatus: [null],
        documentState: [null],
        isDocumentState: [null],
        objectType: [1],
        deseaseId: [null],
        isDeseaseId: [null],
    };
    AllowancePeriodList: any;
    allowanceTypeOptions = [];
    yearList: Array<any>;
    currentDate = new Date();
    currentYear = this.currentDate.getFullYear();
    welfarePolicyCategoryList : any;
    orgTypeOptions;
    statusList = [
        { name: 'Dự thảo', value: 0 },
        { name: 'Chờ tiếp nhận', value: 1 },
        { name: 'Đã tiếp nhận', value: 2 },
        { name: 'Bị từ chối', value: 3 },
        { name: 'Chờ thanh toán', value: 5 },
        { name: 'Đã thanh toán', value: 6 },
    ];
    documentStateList = [
        { name: 'Đủ', value: 1 },
        { name: 'Thiếu', value: 2 }
    ];
    resultListObjectType1 = this.resultList;
    resultListObjectType2 = this.resultList;
    branch : number = 3;
    massOrgIdByEmp: any = null;

    constructor(private router: Router,
                private empAllowanceRequestService : EmpAllowanceRequestService,
                private allowancePeriodService : AllowancePeriodService,
                private welfarePolicyCategoryService : WelfarePolicyCategoryService,
                private categoryService: CategoryService,
                private massOrganizationService : MassOrganizationService,
                private modalService: NgbModal,
                private app: AppComponent,
    ) {
        super();
        this.setMainService(empAllowanceRequestService);
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
        this.categoryService.findByCategoryTypeCode(this.deseaseCode).subscribe(res => {
            this.deseaseOptions =  res.data
        })
    }

    ngOnInit() {
        this.allowancePeriodService.getAllAllowancePeriodSearch().subscribe(res => {
            this.AllowancePeriodList = res
        })
        this.welfarePolicyCategoryService.findAllByType(2).subscribe(res => {
            this.welfarePolicyCategoryList = res
        });
        this.yearList = this.getYearList();
        this.orgTypeOptions = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;
        this.formSearch = this.buildForm({}, this.formConfig);
        this.processSearchObjectType1();
        this.processSearchObjectType2();
    }

    processSearchObjectType(){
        this.processSearchObjectType1();
        this.processSearchObjectType2();
    }

    public processSearchObjectType1(event?): void {
        if (!CommonUtils.isValidForm(this.formSearch)) {
            return;
        }
        const params = this.formSearch ? this.formSearch.value : null;
        params.objectType = 1
        this.empAllowanceRequestService.search(params, event).subscribe(res => {
            this.resultListObjectType1 = res;
        });
        if (!event) {
            if (this.dataTable) {
                this.dataTable.first = 0;
            }
        }
    }

    public processSearchObjectType2(event?): void {
        if (!CommonUtils.isValidForm(this.formSearch)) {
            return;
        }
        const params = this.formSearch ? this.formSearch.value : null;
        params.objectType = 2
        this.empAllowanceRequestService.processSearchObjectType2(params, event).subscribe(res => {
            this.resultListObjectType2 = res;
        });
        if (!event) {
            if (this.dataTable) {
                this.dataTable.first = 0;
            }
        }
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
        this.router.navigate(['/population/emp-allowance-request/create'])
    }

    edit(item) {
        this.router.navigate(['/population/emp-allowance-request/edit', item.empAllowanceRequestId])
    }

    viewDetail(item) {
        this.router.navigate(['/population/emp-allowance-request/view', item.empAllowanceRequestId])
    }

    processUpdate(item, type: any){
        const modalRef = this.modalService.open(EmpAllowanceRequestPopupComponent, DEFAULT_MODAL_OPTIONS);
        const data = {
            empAllowanceRequestId: item.empAllowanceRequestId,
            type: type
        }
        modalRef.componentInstance.setFormValue(data);
        modalRef.result.then((result) => {
            this.processSearchObjectType();
        });
    }

    processUpdateStatus(item, status: any){
        var formData: any = {};
        formData['empAllowanceRequestId'] = item.empAllowanceRequestId;
        formData['type'] = 4;
        formData['status'] = 1;
        this.empAllowanceRequestService.updateStatus(formData).subscribe(res=>{
            if (res.code == "success") {
                this.processSearchObjectType();
            }
        })
    }

    processDelete(item){
        this.app.confirmDelete(null, () => {// on accepted
            this.empAllowanceRequestService.deleteById(item.empAllowanceRequestId).subscribe(res => {
                if (res.code == 'warning') {

                } else {
                    this.processSearchObjectType();
                }
            })
        }, () => {

        });

    }

    changeOrgType(){
        if(this.formSearch.controls['orgType'].value){
            if(this.formSearch.controls['orgType'].value === 2){
                this.branch = 3
            }else if(this.formSearch.controls['orgType'].value === 3){
                this.branch = 1
            }else if(this.formSearch.controls['orgType'].value === 4){
                this.branch = 2
            }else if(this.formSearch.controls['orgType'].value === 1){
                this.branch = 0
            }
            this.massOrganizationService.getListMassOrgByEmployeeId(HrStorage.getUserToken().userInfo.employeeId, this.branch).subscribe(res =>{
                if(res && res.length > 0){
                    const arr = res[0].orgPath.split('/');
                    this.massOrgIdByEmp =  arr[0] != ""? arr[0]: arr[1];
                }
            });
        }
    }
}
