import { NgModule } from '@angular/core';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryIndexComponent } from './category-index/category-index.component';
import { CategoryTypeSearchComponent, FilterPipe } from './category-type-search/category-type-search.component';
import { CategoryTypeAddComponent } from './category-type-add/category-type-add.component';
import { CategoryAddComponent } from './category-add/category-add.component';
import { CategorySearchComponent } from './category-search/category-search.component';
import { CategoryService } from '@app/core/services/setting/category.service';
import { CategoryTypeService } from '@app/core/services/setting/category-type.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [
    CategoryIndexComponent,
    CategoryTypeSearchComponent,
    CategoryTypeAddComponent,
    CategoryAddComponent,
    CategorySearchComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    CategoryRoutingModule
  ],
  entryComponents: [CategoryTypeAddComponent, CategoryAddComponent,],
  providers: [
    CategoryService, CategoryTypeService,
  ]
})
export class CategoryModule { }
