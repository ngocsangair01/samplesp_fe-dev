import { DEFAULT_MODAL_OPTIONS } from './../../../../core/app-config';
import { CategoryTypeAddComponent } from './../category-type-add/category-type-add.component';
import { CategoryTypeService } from './../../../../core/services/setting/category-type.service';
import { AppComponent } from './../../../../app.component';
import { CategorySearchComponent } from './../category-search/category-search.component';
import { BaseComponent } from './../../../../shared/components/base-component/base-component.component';
import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'category-type-search',
  templateUrl: './category-type-search.component.html',
  styleUrls: ['./category-type-search.component.css']
})
export class CategoryTypeSearchComponent extends BaseComponent implements OnInit {
  @Input()
  categorySearchComp: CategorySearchComponent;
  resultList = [];
  formSave: FormGroup;
  catTypeFillter = '';
  categoryTypeId: number;
  paramUsedList = [];
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private app: AppComponent,
    public actr: ActivatedRoute,
    private categoryTypeService: CategoryTypeService,
  ) {
    super(null,'CATEGORY');
    this.setMainService(categoryTypeService);
    categoryTypeService.listParamUsed()
    .subscribe(arg => {
      this.paramUsedList = arg.data;
    });
  }

  ngOnInit() {
    this.processSearch();
  }

  processSearch(): void {
    this.categoryTypeService.findAll().subscribe(res => {
      this.resultList = res.data;
      this.onSelectCategoryType(res.data[0]);
    });
  }

  onSelectCategoryType(item): void {
    this.categoryTypeId = item.categoryTypeId;
    this.categorySearchComp.formSearch.removeControl('categoryTypeId');
    this.categorySearchComp.formSearch.addControl('categoryTypeId', new FormControl(item.categoryTypeId));
    this.categorySearchComp.processSearch(null);
  }

  prepareSaveOrUpdate(item?: any): void {
    if (item && item.categoryTypeId > 0) {
      this.categoryTypeService.findOne(item.categoryTypeId)
        .subscribe(res => {
          this.activeModelSave(res.data);
      });
    } else {
      this.activeModelSave();
    }
  }

  processDelete(item) {
    if (item && item.categoryTypeId > 0) {
      if (this.paramUsedList.includes(item.code)) {
        this.categoryTypeService.processReturnMessage({type: 'WARNING', code: 'categoryTypeUsed'});
      } else {
        this.app.confirmDelete(null, () => {// on accepted
          this.categoryTypeService.deleteById(item.categoryTypeId)
          .subscribe(res => {
            if (this.categoryTypeService.requestIsSuccess(res)) {
              this.processSearch();
              this.categorySearchComp.processSearch(null);
            }
          });
        }, () => {// on rejected
        });
      }
    }
  }

  private activeModelSave(data?: any) {
    const modalRef = this.modalService.open(CategoryTypeAddComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.categoryTypeService.requestIsSuccess(result)) {
        this.processSearch();
      }
    });
  }
}

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    searchText= searchText.trim();
    if (!items) { return []; }
    if (!searchText) { return items; }
    searchText = searchText.toLowerCase();
    return items.filter( it => {
      return it.name.toLowerCase().includes(searchText);
    });
   }
}
