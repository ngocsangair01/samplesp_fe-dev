import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'import-error',
  templateUrl: './import-error.component.html'
})
export class ImportErrorComponent implements OnInit {

  @Input()
  public data: any;
  constructor() { }

  ngOnInit() {
  }

}
