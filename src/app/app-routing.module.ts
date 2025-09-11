import {NgModule, Component} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ContentLayoutComponent} from './layouts/content-layout/content-layout.component';
import {CONTENT_ROUTES} from '@app/shared';
import {AuthGuard} from '@app/core';
import {AssessmentLayoutComponent} from './layouts/assessment-layout/assessment-layout.component';
import {ASSESSMENT_ROUTES} from './shared/routes/assessment-layout.routes';
import {HomeMenuComponent} from './layouts/home-menu/home-menu.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/auth-sso',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeMenuComponent,
        canActivate: [AuthGuard], // Should be replaced with actual auth guard
        runGuardsAndResolvers: 'always',
    },
    {
        path: '',
        component: ContentLayoutComponent,
        canActivate: [AuthGuard], // Should be replaced with actual auth guard
        runGuardsAndResolvers: 'always',
        children: CONTENT_ROUTES,
    },
    {
        path: '',
        component: AssessmentLayoutComponent,
        canActivate: [AuthGuard], // Should be replaced with actual auth guard
        children: ASSESSMENT_ROUTES,
        runGuardsAndResolvers: 'always'
    }, {
        path: 'auth-sso',
        loadChildren: './modules/auth-sso/auth-sso.module#AuthSsoModule',
    }, {
        path: '**', redirectTo: '/home', pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            onSameUrlNavigation: 'reload',
            scrollPositionRestoration: 'enabled'
        })
    ],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule {
}
