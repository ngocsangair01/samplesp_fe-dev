import {ManagementEmployeeIndexComponent} from './management-employee-index/management-employee-index.component';
import {MassOrganizationIndexComponent} from './mass-organization-index/mass-organization-index.component';
import {ManagementEmployeeImportComponent} from './management-employee-import/management-employee-import.component';
import {ManagementEmployeeAddComponent} from './management-employee-add/management-employee-add.component';
import {MassOrganizationComponent} from './mass-organization.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MassOrganizationSearchComponent} from './mass-organization-search/mass-organization-search.component';
import {MassOrganizationAddComponent} from './mass-organization-add/mass-organization-add.component';
import {MassPositionIndexComponent} from './mass-position/mass-position-index/mass-position-index.component';
import {MassPositionAddComponent} from './mass-position/mass-position-add/mass-position-add.component';
import {MassOrganizationImportComponent} from './mass-organization-import/mass-organization-import.component';
import {MassRequestIndexComponent} from './mass-request-index/mass-request-index.component';
import {MassRequestCriteriaPlanComponent} from './mass-request-criteria-plan/mass-request-criteria-plan.component';
import {MassCriteriaResponseIndexComponent} from './mass-criteria-response/mass-criteria-response-index/mass-criteria-response-index.component';
import {MassCriteriaResponseFormComponent} from './mass-criteria-response/mass-criteria-response-form/mass-criteria-response-form.component';
import {MassRequestViewComponent} from './mass-request-view/mass-request-view.component';
import {DashboardMassComponent} from "@app/modules/mass-organization/dashboard-mass/dashboard-mass.component";

const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardMassComponent
    },
    {  // to chuc phu nu
        path: 'organization-women',
        component: MassOrganizationComponent,
        children: [
            {
                path: '',
                component: MassOrganizationIndexComponent
            },
            {
                path: 'search/:id',
                component: MassOrganizationSearchComponent
            }, {
                path: 'mass-organization-edit/:id',
                component: MassOrganizationAddComponent,
            }, {
                path: 'mass-organization-add',
                component: MassOrganizationAddComponent,
            }, {
                path: "mass-organization-view/:id",
                component: MassOrganizationAddComponent,
            },
            {
                path: "mass-organization-import",
                component: MassOrganizationImportComponent,
            },
        ]
    }, { // to chuc thanh nien
        path: 'organization-youth',
        component: MassOrganizationComponent,
        children: [
            {
                path: '',
                component: MassOrganizationIndexComponent
            },
            {
                path: 'search/:id',
                component: MassOrganizationSearchComponent
            }, {
                path: 'mass-organization-edit/:id',
                component: MassOrganizationAddComponent,
            }, {
                path: 'mass-organization-add',
                component: MassOrganizationAddComponent,
            }, {
                path: "mass-organization-view/:id",
                component: MassOrganizationAddComponent,
            },
            {
                path: "mass-organization-import",
                component: MassOrganizationImportComponent,
            },
        ]
    }, { // to chuc cong doan
        path: 'organization-union',
        component: MassOrganizationComponent,
        children: [
            {
                path: '',
                component: MassOrganizationIndexComponent
            },
            {
                path: 'search/:id',
                component: MassOrganizationSearchComponent
            }, {
                path: 'mass-organization-edit/:id',
                component: MassOrganizationAddComponent,
            }, {
                path: 'mass-organization-add',
                component: MassOrganizationAddComponent,
            }, {
                path: "mass-organization-view/:id",
                component: MassOrganizationAddComponent,
            },
            {
                path: "mass-organization-import",
                component: MassOrganizationImportComponent,
            },
        ]
    },
    { // massMember-women
        path: 'women/employee-management',
        component: ManagementEmployeeIndexComponent,
    }, {
        path: "women/employee-management/edit/:id",
        component: ManagementEmployeeAddComponent,
    }, {
        path: "women/employee-management/add",
        component: ManagementEmployeeAddComponent,
    }, {
        path: "women/employee-management/view/:id",
        component: ManagementEmployeeAddComponent,
    },
    // massMember-youth
    {
        path: "youth/employee-management",
        component: ManagementEmployeeIndexComponent,
    }, {
        path: "youth/employee-management/edit/:id",
        component: ManagementEmployeeAddComponent,
    }, {
        path: "youth/employee-management/add",
        component: ManagementEmployeeAddComponent,
    }, {
        path: "youth/employee-management/view/:id",
        component: ManagementEmployeeAddComponent,
    },
    // massMember-union
    {
        path: "union/employee-management",
        component: ManagementEmployeeIndexComponent,
    }, {
        path: "union/employee-management/edit/:id",
        component: ManagementEmployeeAddComponent,
    }, {
        path: "union/employee-management/add",
        component: ManagementEmployeeAddComponent,
    }, {
        path: "union/employee-management/view/:id",
        component: ManagementEmployeeAddComponent,
    },
    //massPosition
    {
        path: 'woman/mass-position',
        component: MassPositionIndexComponent,
    },
    {
        path: 'woman/mass-position-add',
        component: MassPositionAddComponent
    },
    {
        path: 'woman/mass-position-edit/:id',
        component: MassPositionAddComponent
    },
    {
        path: 'woman/mass-position-view/:id',
        component: MassPositionAddComponent
    },
    {
        path: 'youth/mass-position',
        component: MassPositionIndexComponent,
    },
    {
        path: 'youth/mass-position-add',
        component: MassPositionAddComponent
    },
    {
        path: 'youth/mass-position-edit/:id',
        component: MassPositionAddComponent
    },
    {
        path: 'youth/mass-position-view/:id',
        component: MassPositionAddComponent
    },
    {
        path: 'union/mass-position',
        component: MassPositionIndexComponent,
    },
    {
        path: 'union/mass-position-add',
        component: MassPositionAddComponent
    },
    {
        path: 'union/mass-position-edit/:id',
        component: MassPositionAddComponent
    },
    {
        path: 'union/mass-position-view/:id',
        component: MassPositionAddComponent
    },
    {
        path: 'woman/mass-request',
        component: MassRequestIndexComponent
    },
    {
        path: 'youth/mass-request',
        component: MassRequestIndexComponent
    },
    {
        path: 'union/mass-request',
        component: MassRequestIndexComponent
    },
    {
        path: 'woman/mass-request/create-plan/:id',
        component: MassRequestCriteriaPlanComponent
    },
    {
        path: 'youth/mass-request/create-plan/:id',
        component: MassRequestCriteriaPlanComponent
    },
    {
        path: 'union/mass-request/create-plan/:id',
        component: MassRequestCriteriaPlanComponent
    },
    {
        path: 'woman/mass-request/view-detail/:id',
        component: MassRequestViewComponent
    },
    {
        path: 'youth/mass-request/view-detail/:id',
        component: MassRequestViewComponent
    },
    {
        path: 'union/mass-request/view-detail/:id',
        component: MassRequestViewComponent
    },
    {
        path: 'women-member',
        component: ManagementEmployeeImportComponent
    },
    {
        path: 'youth-member',
        component: ManagementEmployeeImportComponent
    },
    {
        path: 'union-member',
        component: ManagementEmployeeImportComponent
    },
    {
        path: 'woman/mass-criteria-response',
        component: MassCriteriaResponseIndexComponent
    },
    {
        path: 'woman/mass-criteria-response/perform-criteria/:massCriteriaResponseId',
        component: MassCriteriaResponseFormComponent
    },
    {
        path: 'woman/mass-criteria-response/view/:massCriteriaResponseId',
        component: MassCriteriaResponseFormComponent
    },
    {
        path: 'youth/mass-criteria-response',
        component: MassCriteriaResponseIndexComponent
    },
    {
        path: 'youth/mass-criteria-response/perform-criteria/:massCriteriaResponseId',
        component: MassCriteriaResponseFormComponent
    },
    {
        path: 'youth/mass-criteria-response/view/:massCriteriaResponseId',
        component: MassCriteriaResponseFormComponent
    },
    {
        path: 'union/mass-criteria-response',
        component: MassCriteriaResponseIndexComponent
    },
    {
        path: 'union/mass-criteria-response/perform-criteria/:massCriteriaResponseId',
        component: MassCriteriaResponseFormComponent
    },
    {
        path: 'union/mass-criteria-response/view/:massCriteriaResponseId',
        component: MassCriteriaResponseFormComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MassOrganizationRoutingModule {
}
