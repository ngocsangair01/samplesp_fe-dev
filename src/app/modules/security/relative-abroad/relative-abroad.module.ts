import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared';
import {RelativeAbroadRoutingModule} from "@app/modules/security/relative-abroad/relative-abroad-routing.module";
import {
    RelativeAbroadIndexComponent
} from "@app/modules/security/relative-abroad/relative-abroad-index/relative-abroad-index.component";
import {
    RelativeAbroadSearchComponent
} from "@app/modules/security/relative-abroad/relative-abroad-search/relative-abroad-search.component";
import {
    RelativeAbroadFormComponent
} from "@app/modules/security/relative-abroad/relative-abroad-form/relative-abroad-form.component";
import {
    RelativeAbroadImportComponent
} from "@app/modules/security/relative-abroad/relative-abroad-import/relative-abroad-import.component";

@NgModule({
    declarations: [
        RelativeAbroadIndexComponent,
        RelativeAbroadSearchComponent,
        RelativeAbroadFormComponent,
        RelativeAbroadImportComponent],
    imports: [
        SharedModule,
        CommonModule,
        RelativeAbroadRoutingModule,
    ]
})
export class RelativeAbroadModule { }
