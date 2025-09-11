import { NgModule } from '@angular/core';
import { CategoryService } from '@app/core/services/setting/category.service';
import { CategoryTypeService } from '@app/core/services/setting/category-type.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { GeneralStandardPositionGroupFormComponent } from './general-standard-position-group-form/general-standard-position-group-form.component';
import { GeneralStandardPositionGroupSearchComponent } from './general-standard-position-group-search/general-standard-position-group-search.component';
import { GeneralStandardPositionGroupIndexComponent } from './general-standard-position-group-index/general-standard-position-group-index.component';
import { GeneralStandardPositionGroupRoutingModule } from './general-standard-position-group-routing.module';
import { GroupPostionSearchComponent, FilterPipe } from './group-postion-search/group-postion-search.component';

@NgModule({
  declarations: [
    FilterPipe,
    GeneralStandardPositionGroupSearchComponent,
    GeneralStandardPositionGroupIndexComponent,
    GeneralStandardPositionGroupFormComponent,
    GroupPostionSearchComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    GeneralStandardPositionGroupRoutingModule
  ],
  entryComponents: [GeneralStandardPositionGroupFormComponent,],
  providers: [
    CategoryService, CategoryTypeService,
  ]
})
export class GeneralStandardPositionGroupModule { }
