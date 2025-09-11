import {Component, Input, OnInit} from "@angular/core";
import { BaseComponent } from "@app/shared/components/base-component/base-component.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup} from "@angular/forms";
import {ResponseResolutionMonthService} from "@app/core/services/party-organization/response-resolution-month.service";
import {AppComponent} from "@app/app.component";

@Component({
    selector: 'thorough-resolution-month-content',
    templateUrl: './thorough-resolution-month-content.component.html',
    styleUrls: ['./thorough-resolution-month-content.component.css']
})
export class ThoroughResolutionMonthContentComponent extends BaseComponent implements OnInit {
    formSave: FormGroup;
    isRequired: boolean = false;
    formConfig: any = {
        summaryContent: [null],
        fullContent: [null],
        responseResolutionsMonthId: [null],
    };
    @Input() public responseResolutionsMonthId;

    constructor(
        public activeModal: NgbActiveModal,
        private app: AppComponent,
        private responseResolutionMonthService : ResponseResolutionMonthService,
    ) {
        super();
    }

    ngOnInit() {
        if(this.responseResolutionsMonthId){
            this.responseResolutionMonthService.findBeanById(this.responseResolutionsMonthId).subscribe(
                res => {
                    if (res.data) {
                        this.formSave = this.buildForm(res.data, this.formConfig)
                    }
                }
            );
        }else{
            this.formSave = this.buildForm({responseResolutionsMonthId: this.responseResolutionsMonthId}, this.formConfig)
        }
    }

    public goBack() {
        this.activeModal.close();
    }

    get f() {
        return this.formSave.controls;
    }

    save(){
        this.isRequired = false;
        if(this.formSave.value.fullContent || this.formSave.value.summaryContent){
            this.responseResolutionMonthService.saveOrUpdateContent(this.formSave.value).subscribe(res => {
                if(res.code == "success"){
                    this.activeModal.close();
                }
            })
        }else{
            this.isRequired = true;
        }
    }

}