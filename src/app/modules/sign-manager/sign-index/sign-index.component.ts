import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';

@Component({
  selector: 'sign-index',
  templateUrl: './sign-index.component.html',
})
export class SignIndexComponent extends BaseComponent implements OnInit {

  constructor() { 
    super(null,'SIGN_DOCUMENT');
  }

  ngOnInit() {
  }

}
