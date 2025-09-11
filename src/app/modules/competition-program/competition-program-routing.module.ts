import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CompetitionProgramIndexComponent} from "@app/modules/competition-program/competition-program-index/competition-program-index.component";
import {CompetitionProgramFormComponent} from "@app/modules/competition-program/competition-program-form/competition-program-form.component";

const routes: Routes = [
    {
        path: '',
        component: CompetitionProgramIndexComponent
    },
    {
        path: 'create',
        component: CompetitionProgramFormComponent
    },
    {
        path: 'view/:type/:competitionId',
        component: CompetitionProgramFormComponent
    },
    {
        path: 'edit/:competitionId',
        component: CompetitionProgramFormComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompetitionProgramRoutingModule {
}
