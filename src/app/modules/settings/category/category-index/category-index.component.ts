import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';

@Component({
  selector: 'category-index',
  templateUrl: './category-index.component.html',
})
export class CategoryIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null,'CATEGORY');
   }

  ngOnInit() {
  }

}
