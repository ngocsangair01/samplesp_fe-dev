import { CommonUtils } from './../../../../shared/services/common-utils.service';
import { TranslationService } from 'angular-l10n';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';
import { RetiredContactService } from '@app/core/services/employee/retired-contact.service';

@Component({
    selector: 'layout-emloyee',
    providers: [EmployeeResolver],
    templateUrl: './layout-emloyee.component.html'
})
export class LayoutEmployeeComponent implements OnInit, OnDestroy {
    @Input()
    formSearch: FormGroup;
    hardItems = [];
    items;
    isView: boolean = false;
    navigationSubscription;
    private _employeeId;
    employeeBean;
    constructor(
        private translation: TranslationService,
        private employeeResolver: EmployeeResolver,
        private curriculumVitaeService: CurriculumVitaeService,
        private retiredContactService: RetiredContactService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) {
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                const params = this.activatedRoute.snapshot.params;
                if (this._employeeId !== params.id) {
                    this.curriculumVitaeService.getEmployeeInfo(params.id).subscribe(
                        res => {
                            if (res.type === 'SUCCESS') {
                                this._employeeId = params.id;
                                this.createTabRouterLink();
                                this.employeeResolver.resolve(res.data.employeeId);
                                this.employeeBean = res.data;
                                if (CommonUtils.havePermission("action.view", "resource.partyMember")) {
                                    this.retiredContactService.findById(this._employeeId).subscribe(
                                        res2 => {
                                            if (res2.data.length > 0) {
                                                this.buildDefaultMenu();
                                            }
                                        }
                                    );
                                }

                                if (this.activatedRoute.children.length === 0) {
                                    this.router.navigate(['/employee/retired', this._employeeId]);
                                }
                            } else {
                                if (this._employeeId) {
                                    this.router.navigate(['/employee/retired', this._employeeId]);
                                } else {
                                    this.router.navigate(['/employee/retired']);
                                }
                            }
                        }
                    );
                } else {
                    if (this.activatedRoute.children.length === 0) {
                        this.router.navigate(['/employee/retired']);
                    }
                }
            }
        });

        const subPaths = this.router.url.split('/');
        if (subPaths.length > 4) {
            this.isView = subPaths[4] === 'view';
        }
    }

    ngOnInit() {

    }

    createTabRouterLink() {
        this.buildDefaultMenu();
    }

    private buildDefaultMenu() {
        this.items = [];
        const listResource = [];
        let listPermission: any;
        for (const item of this.hardItems) {
            listResource.push(CommonUtils.getPermissionCode("resource." + item.resource));
        }
        listPermission = CommonUtils.getPermissionByListResourceCode(listResource);
        for (const item of this.hardItems) {
            const resourceCode = CommonUtils.getPermissionCode("resource." + item.resource)
            if (this.hasPermission("action.view", resourceCode, listPermission)) {
                this.items.push(item);
            }
        }
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    public redirectTo(item) {
        this.router.navigate(item.routerLink);
    }

    private hasPermission(operationKey: string, resourceCode: string, listPermissions): boolean {
        if (!listPermissions || listPermissions.length <= 0) {
            return false;
        }
        const rsSearch = listPermissions.findIndex(x => x.operationCode === CommonUtils.getPermissionCode(operationKey) && x.resourceCode === resourceCode);
        if (rsSearch < 0) {
            return false;
        }
        return true;
    }
}
