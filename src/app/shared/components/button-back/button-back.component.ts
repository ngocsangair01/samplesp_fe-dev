import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'button-back',
  templateUrl: './button-back.component.html'
})
export class ButtonBackComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }
  backClicked() {
    this.location.back();
  }
}
