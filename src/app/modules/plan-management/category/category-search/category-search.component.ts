import { CategoryAddComponent } from './../category-add/category-add.component';
import { AppComponent } from './../../../../app.component';
import { CategoryTypeService } from './../../../../core/services/setting/category-type.service';
import { CommonUtils } from './../../../../shared/services/common-utils.service';
import { BaseComponent } from './../../../../shared/components/base-component/base-component.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '@app/core/services/setting/category.service';
import { ValidationService } from '@app/shared/services';

@Component({
  selector: 'category-search',
  templateUrl: './category-search.component.html',
})
export class CategorySearchComponent extends BaseComponent implements OnInit {
  public commonUtils =  CommonUtils;
  constructor(
    public actr: ActivatedRoute,
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private categoryTypeService: CategoryTypeService,
    private app: AppComponent
  ) {
    super(null,'CATEGORY');
    this.setMainService(categoryService);
    this.formSearch = this.buildForm({}, {
      code: ['', [ValidationService.maxLength(50)]],
      name: ['', [ValidationService.maxLength(500)]],
    });
  }

  ngOnInit() {
    this.processSearch();
  }

  get f () {
    return this.formSearch.controls;
  }

  /**
   * prepare insert/update
   */
  prepareSaveOrUpdate(item?: any): void {
    if (item && item.categoryId > 0) {
      this.categoryService.findOne(item.categoryId)
        .subscribe(res => {
          this.categoryTypeService.findOne(res.data.categoryTypeId)
            .subscribe(resSCType => {
              res.data.categoryTypeName = resSCType.data.name;
              this.activeFormModal(this.modalService, CategoryAddComponent, res.data);
          });
        });
    } else {
      if (!this.formSearch.get('categoryTypeId')) {
        this.app.warningMessage('category.chooseCategoryType', '');
        return;
      }
      this.categoryTypeService.findOne(this.formSearch.get('categoryTypeId').value)
        .subscribe(resSCType => {
          const data = {
            categoryTypeId  : resSCType.data.categoryTypeId,
            categoryTypeName: resSCType.data.name
          };
          this.activeFormModal(this.modalService, CategoryAddComponent, data);
      });
    }
  }
}
