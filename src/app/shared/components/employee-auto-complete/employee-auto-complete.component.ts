import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseControl } from '@app/core/models/base.control';
import { DynamicApiService } from '@app/core';

@Component({
  selector: 'employee-auto-complete',
  templateUrl: './employee-auto-complete.component.html'
})

export class EmployeeAutoCompleteComponent implements OnInit {

  @Input()
  public property: BaseControl;

  @Output()
  onChange: EventEmitter<any> = new EventEmitter();


  public inputStyle = { minHeight: '28px', width: '100%', borderRadius: '0px' };

  filteredList = [];

  constructor(
    private dynamicApiService: DynamicApiService,
  ) { }
  ngOnInit() {
    if (!this.property) {
      this.property = new BaseControl();
    }

  }

  setProperty(emp){
    this.dynamicApiService.getByCodeNotDisplayLoading('get-employee', {keySearch: emp})
    .subscribe(res => {
      if (res.length > 0){
        this.property.setValue(res[0])
      }
    })
  }

  getEmpInfo(event) {
    this.dynamicApiService.getByCodeNotDisplayLoading('get-employee', {keySearch: event.query})
    .subscribe(res => this.filteredList = res)
  }

  onSelect() {
    this.property.setValue(this.property.value);
    this.onChange.emit()
  }
  onClear(event) {
    this.property.setValue(null);
  }
  onBlur() {
    if (!this.property.value || !this.property.value.employeeId) {
      this.property.setValue(null);
    }
  }
}
