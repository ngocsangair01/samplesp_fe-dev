import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {MobileConfigService} from "@app/core/services/setting/mobile-config.service";
import {MobileConfigFormComponent} from "@app/modules/settings/mobile-config/mobile-config-form/mobile-config-form.component";
import {DEFAULT_MODAL_OPTIONS} from "@app/core";

@Component({
    selector: 'mobile-config-search',
    templateUrl: './mobile-config-search.component.html',
    styleUrls: ['./mobile-config-search.component.css']
})
export class MobileConfigSearchComponent extends BaseComponent implements OnInit {

    formConfig = {
        id: [''],
        name: ['', [Validators.maxLength(200)]],
        code: ['', [Validators.maxLength(200)]],
        type: [''],
        isActive: [''],
        isName: [false],
        isCode: [false],
        isType: [false],
        isBooleanActive: [false]
    };
    lstType = [
        {id: 1, name: "menu"},
        {id: 2, name: "banner"},
    ]
    constructor(
        private modalService: NgbModal,
        private app: AppComponent,
        private mobileConfigService: MobileConfigService,
    ) {
        super(null, 'CTCT_CONFIG_MOBILE');
        this.setMainService(mobileConfigService);
        this.formSearch = this.buildForm({}, this.formConfig);
        this.processSearch();
    }

    ngOnInit() {
    }

    get f() {
        return this.formSearch.controls;
    }

    processDelete(item) {
        if (item && item.id > 0) {
            this.app.confirmDelete(null, () => {// on accepted
                this.mobileConfigService.deleteById(item.id)
                    .subscribe(res => {
                        if (this.mobileConfigService.requestIsSuccess(res)) {
                            this.processSearch(null);
                        }
                    });
            }, () => {// on rejected

            });
        }
    }

    /**
     * prepare insert/update
     */
    prepareSaveOrUpdate(item?: any): void {
        if (item && item.id > 0) {
            this.mobileConfigService.findOne(item.id)
                .subscribe(res => {
                    this.activeModal(res.data);
                });
        } else {
            this.activeModal();
        }
    }


    /**
     * show modal
     * data
     */
    private activeModal(data?: any) {
        const modalRef = this.modalService.open(MobileConfigFormComponent, DEFAULT_MODAL_OPTIONS);
        if (data) {
            modalRef.componentInstance.buildForms(data);
        }
        modalRef.result.then((result) => {
            if (!result) {
                return;
            }
            if (this.mobileConfigService.requestIsSuccess(result)) {
                this.processSearch();
                if (this.dataTable) {
                    this.dataTable.first = 0;
                }
            }
        });
    }

}
