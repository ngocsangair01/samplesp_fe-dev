import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    AllowancePeriodIndexComponent
} from "@app/modules/population/allowance-period/allowance-period-index/allowance-period-index.component";
import {
    AllowancePeriodFormComponent
} from "@app/modules/population/allowance-period/allowance-period-forrn/allowance-period-form.component";

const routes: Routes = [
    {
        path: '',
        component: AllowancePeriodIndexComponent
    },
    {
        path: 'create',
        component: AllowancePeriodFormComponent
    },
    {
        path: 'edit/:id',
        component: AllowancePeriodFormComponent
    },
    {
        path: 'view/:id',
        component: AllowancePeriodFormComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AllowancePeriodRoutingModule { }
