import { BaseControl } from '@app/core/models/base.control';
import { Component, OnInit, Input, OnChanges, ComponentFactoryResolver, ViewChild, ViewContainerRef, AfterViewInit, EventEmitter, Output, AfterViewChecked, } from '@angular/core';
import { TranslationService } from 'angular-l10n';

@Component({
  selector: 'radio-button',
  templateUrl: './radio-button.component.html',
})
export class RadioButtonComponent implements OnInit {


  @Input()
  public property: BaseControl;

  @Input()
  configs

  @Input()
  name;

  @Input()
  disabled = false;

  @Output()
  onClick = new EventEmitter();

  constructor() {

  }

  ngOnInit() {
    for (let config of this.configs){
      if (config.isDefault){
        this.property.setValue(config.value)
      }
    }
  }



}
