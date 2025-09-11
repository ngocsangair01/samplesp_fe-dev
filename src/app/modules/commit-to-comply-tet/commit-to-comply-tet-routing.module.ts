import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
    CommitToComplyTetIndexComponent
} from "@app/modules/commit-to-comply-tet/commit-to-comply-tet-index/commit-to-comply-tet-index.component";
import {
    CommitToComplyTetFormComponent
} from "@app/modules/commit-to-comply-tet/commit-to-comply-tet-form/commit-to-comply-tet-form.component";

const routes: Routes = [
    {
        path: '',
        component: CommitToComplyTetIndexComponent
    },
    {
        path: 'create',
        component: CommitToComplyTetFormComponent
    },
    {
        path: 'view/:type/:competitionId',
        component: CommitToComplyTetFormComponent
    },
    {
        path: 'edit/:competitionId',
        component: CommitToComplyTetFormComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CommitToComplyTetRoutingModule {
}
