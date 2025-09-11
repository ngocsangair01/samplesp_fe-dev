import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM } from '@app/core/app-config';
import { IdeologicalExpressionReportService } from '@app/core/services/propaganda/ideological-expression-report.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { ValidationService } from '@app/shared/services/validation.service';
import * as moment from 'moment';
import { TreeNode } from 'primeng/api';

@Component({
    selector: 'ideological-expression-report-form',
    templateUrl: './ideological-expression-report-form.component.html',
})
export class IdeologicalExpressionReportFormComponent extends BaseComponent implements OnInit {

    nodes: TreeNode[];
    adResourceKey = "resource.ideologicalExpressionReport";
    formSearch: FormGroup;
    formConfig = {
        ideologicalExpressionReportId: [''],
        organizationId: [''],
        reportType: [1],
        dateRange: [2],
        fromDate: [''],
        toDate: [''],
        comment: ['']
    };
    isReport = false;
    isUpdate = false;

    constructor(
        private service: IdeologicalExpressionReportService,
        private app: AppComponent
    ) {
        super(null, CommonUtils.getPermissionCode("resource.ideologicalExpressionReport"));
        this.setMainService(service);
        this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
            [ValidationService.notAffter("fromDate", "toDate", "common.label.toDate")]);
        if (moment().weekday() >= 3) {
            this.f['fromDate'].setValue(moment().weekday(-5).toDate().getTime());
            this.f['toDate'].setValue(moment().weekday(3).toDate().getTime());
        } else {
            this.f['fromDate'].setValue(moment().weekday(-11).toDate().getTime());
            this.f['toDate'].setValue(moment().weekday(-5).toDate().getTime());
        }
    }

    ngOnInit() {
        this.processSearch();
    }

    get f() {
        return this.formSearch.controls;
    }

    search() {
        this.clearValidators();
        this.processSearch();
        this.isReport = false;
        this.isUpdate = false;
    }

    processReport() {
        this.addValidators();
        this.f['comment'].clearValidators();
        this.f['comment'].updateValueAndValidity();
        if (!CommonUtils.isValidForm(this.formSearch)) {
            return;
        }
        this.service.report(this.formSearch.value).subscribe(res => {
            this.nodes = this.toTreeNode(res);
        });
        this.isReport = true;
    }

    processSaveOrUpdate() {
        this.addValidators();
        this.f['comment'].setValidators(ValidationService.required);
        this.f['comment'].updateValueAndValidity();
        if (!CommonUtils.isValidForm(this.formSearch)) {
            return;
        }

        this.app.confirmMessage(null, () => { // on accepted
            this.service.saveOrUpdate(this.formSearch.value)
                .subscribe(res => {
                    if (this.service.requestIsSuccess(res)) {
                        this.f['comment'].clearValidators();
                        this.f['comment'].setValue('');
                        this.search();
                    }
                });
        }, () => {

        });
    }

    prepareSaveOrUpdate(id) {
        this.service.findOne(id).subscribe(res => {
            this.formSearch = this.buildForm(res.data, this.formConfig, ACTION_FORM.VIEW,
                [ValidationService.notAffter("fromDate", "toDate", "common.label.toDate")]);
            this.isUpdate = true;
            this.processReport();
        });
    }

    processDelete(id) {
        this.app.confirmDelete(null, () => {// on accepted
            this.service.deleteById(id)
                .subscribe(res => {
                    if (this.service.requestIsSuccess(res)) {
                        this.search();
                    }
                });
        }, () => {// on rejected

        });
    }

    setToDate() {
        const date = new Date(this.f['fromDate'].value);
        switch (this.f['dateRange'].value) {
            case 2:
                this.f['toDate'].setValue(date.setDate(date.getDate() + 6));
                break;
            case 3:
                this.f['toDate'].setValue(date.setMonth(date.getMonth() + 1));
                break;
            case 4:
                this.f['toDate'].setValue(date.setMonth(date.getMonth() + 3));
                break;
            case 5:
                this.f['toDate'].setValue(date.setFullYear(date.getFullYear() + 1));
                break;
            default:
        }
    }

    toTreeNode(res: any): any {
        if (res) {
            for (let node of res) {
                node.data = {
                    name: node.name,
                    isParent: node.isParent,
                    count: node.count,
                    count1: node.count1,
                    count2: node.count2
                };
                node.expanded = false;
                node.children = this.toTreeNode(node.children);
            }
        }

        return res;
    }

    addValidators() {
        this.f['organizationId'].setValidators(ValidationService.required);
        this.f['organizationId'].updateValueAndValidity();
        this.f['reportType'].setValidators(ValidationService.required);
        this.f['reportType'].updateValueAndValidity();
        this.f['fromDate'].setValidators(ValidationService.required);
        this.f['fromDate'].updateValueAndValidity();
        this.f['toDate'].setValidators(ValidationService.required);
        this.f['toDate'].updateValueAndValidity();
    }

    clearValidators() {
        this.f['organizationId'].clearValidators();
        this.f['organizationId'].updateValueAndValidity();
        this.f['reportType'].clearValidators();
        this.f['reportType'].updateValueAndValidity();
        this.f['fromDate'].clearValidators();
        this.f['fromDate'].updateValueAndValidity();
        this.f['toDate'].clearValidators();
        this.f['toDate'].updateValueAndValidity();
        this.f['comment'].clearValidators();
        this.f['comment'].updateValueAndValidity();
    }

}