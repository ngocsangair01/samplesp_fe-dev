import { Component, Input, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '@app/core/services/setting/category.service';
import { GeneralStandardPositionGroupService } from '@app/core/services/setting/general-standard_position_group.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralStandardPositionGroupFormComponent } from '../general-standard-position-group-form/general-standard-position-group-form.component';
import { GeneralStandardPositionGroupSearchComponent } from '../general-standard-position-group-search/general-standard-position-group-search.component';
import { AppComponent } from './../../../../app.component';
import { APP_CONSTANTS, DEFAULT_MODAL_OPTIONS } from './../../../../core/app-config';
import { CategoryTypeService } from './../../../../core/services/setting/category-type.service';
import { BaseComponent } from './../../../../shared/components/base-component/base-component.component';

@Component({
  selector: 'group-postion-search',
  templateUrl: './group-postion-search.component.html',
  styleUrls: ['./group-postion-search.component.css']
})
export class GroupPostionSearchComponent extends BaseComponent implements OnInit {
  @Input()
  generalStandardPositionGroupComp: GeneralStandardPositionGroupSearchComponent;
  resultList = [];
  formSave: FormGroup;
  catTypeFillter = '';
  categoryId: number;
  constructor(
    private modalService: NgbModal,
    private app: AppComponent,
    public actr: ActivatedRoute,
    private categoryTypeService: CategoryTypeService,
    private generalStandardPositionGroupService: GeneralStandardPositionGroupService,
    private categoryService: CategoryService
  ) {
    super(null, 'CATEGORY');
    this.setMainService(categoryTypeService);
  }

  ngOnInit() {
    this.processSearch();
  }

  processSearch(): void {
    this.categoryService.findByCategoryTypeCode(APP_CONSTANTS.CATEGORY_TYPE_CODE.NHOM_CHUC_DANH).subscribe(res => {
      this.resultList = res.data;
      this.onSelectCategory(res.data[0]);
    });
  }

  onSelectCategory(item): void {
    this.categoryId = item.categoryId;
    this.generalStandardPositionGroupComp.formSearch.removeControl('groupPositionId');
    this.generalStandardPositionGroupComp.formSearch.addControl('groupPositionId', new FormControl(item.categoryId));
    this.generalStandardPositionGroupComp.processSearch(null);
  }

  processDelete(item) {
    if (item && item.generalStandardPositionGroupId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.generalStandardPositionGroupService.deleteById(item.generalStandardPositionGroupId)
          .subscribe(res => {
            if (this.categoryTypeService.requestIsSuccess(res)) {
              this.processSearch();
              this.generalStandardPositionGroupComp.processSearch(null);
            }
          });
      }, () => {// on rejected
      });
      // }
    }
  }

  private activeModelSave(data?: any) {
    const modalRef = this.modalService.open(GeneralStandardPositionGroupFormComponent, DEFAULT_MODAL_OPTIONS);
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
    searchText = searchText.trim();
    if (!items) { return []; }
    if (!searchText) { return items; }
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      return it.name.toLowerCase().includes(searchText);
    });
  }
}
