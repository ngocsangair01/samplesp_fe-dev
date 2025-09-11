
import { Component, OnInit, Input, OnChanges, ViewChild, ViewContainerRef, ComponentFactoryResolver, Type, EventEmitter, Output, TemplateRef } from '@angular/core';
import { BaseComponent } from '../base-component/base-component.component';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
})



export class DynamicFormComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() optionTemplates;

  @Input()
  labels

  constructor() {
    super();
  }


  ngOnChanges() {

  }

  ngOnInit() {

  }


}



