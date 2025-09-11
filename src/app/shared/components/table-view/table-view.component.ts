
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, OnChanges } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { CommonUtils } from '@app/shared/services';
import {TranslationService} from "angular-l10n";
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";

@Component({
  selector: 'table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent extends BaseComponent implements OnInit, OnChanges {
  @Input()
  public title: any;

  @Input()
  columnsConfig;

  @Input()
  resultList;

  @Input()
  actionButtonTemplate: TemplateRef<any>;

  @Input()
  optionTemplate: TemplateRef<any>;

  @Input()
  btnHeaderTemplate: TemplateRef<any>;

  @Input()
  isShowVertical;

  @Input()
  isShowHideVertical

  fieldNames;


  @Output()
  public lazyLoad: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('ptable') ptable: any;



  selectedRows

  constructor(private app: AppComponent,
    public translation: TranslationService) {
    super( );

  }

  ngOnInit() {
    this.fieldNames = this.getFieldNames();
  }


  getFieldNames(){
    let fieldNames = [];
    for (let config of this.columnsConfig){
      if (config.name){
        fieldNames.push(config.name);
      }
    }
    return fieldNames;
  }

  ngOnChanges() {
    this.resetIndexPage();
  }

  resetIndexPage() {
    if(this.resultList){
      this.ptable._first = parseInt(this.resultList.first, 10);
    } else {
      this.ptable._first = 0;
    }
    
  }


  onLazyLoad(event) {
    this.lazyLoad.emit(event);
  }

  onSelectChange(){

  }

  onTablePageChange(event) {
    const param = {first: 0, rows: event};
    this.changeRow = event;
    this.onLazyLoad(param)
  }

}
