import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import {BaseControl} from "@app/core/models/base.control";
import {FormGroup} from "@angular/forms";
import {APP_CONSTANTS} from "@app/core";

@Component({
    selector: 'emp-army-proposed-add-select-filter-list',
    templateUrl: './emp-army-proposed-add-select-filter.component.html'
})
export class EmpArmyProposedAddSelectFilterComponent extends BaseComponent implements OnInit {

    @Input()
    public property: string;
    @Input()
    public list: any;
    listProposed= [];
    valueChecked = '';
    checkedId = ''
    @Output()
    onSelectProposed: EventEmitter<any> = new EventEmitter();
    formConfig = {
        armyProposedDetailId: [''],
        property: [''],
        list: [''],
        listCheck: [''],
        conditionCode: ['']
    }
    form: FormGroup

    constructor(
    ) {
        super();
    }

    ngOnInit() {
        if(this.list.value.placeholder != null){
            let arrayProposed = this.list.value.placeholder.split('\n');
            for (let item in arrayProposed){
                let splitArrayProposed = arrayProposed[item].split('-');
                let valueArrayProposed = splitArrayProposed[1].trim();
                let selectProposed = {
                    label: valueArrayProposed,
                    value: valueArrayProposed,
                };
                this.listProposed.push(selectProposed);
            }
        }
        if(this.list.value.conditionValue !== null){
            let listConditionValue = this.list.value.conditionValue.substring(1).split('\t');
            for(let item in listConditionValue){
                let splitListConditionValue = listConditionValue[item].split('\n');
                for(item in this.listProposed){
                    if(splitListConditionValue[1] === this.property+":"+this.listProposed[item].value){
                        this.valueChecked = this.listProposed[item].value;
                        this.checkedId = splitListConditionValue[0];
                    }else if(splitListConditionValue[1].split(':')[0] === this.property){
                        this.checkedId = splitListConditionValue[0];
                    }
                }
            }
        }
        this.form = this.buildForm({
            property: this.property,
            list: this.list.value.placeholder,
            conditionCode: this.list.value.conditionCode,
            armyProposedDetailId: this.checkedId,
            listCheck: this.valueChecked,
        }, this.formConfig)
    }

    getChangeSelectProposed(item:any){
        this.onSelectProposed.emit(item)
    }

}
