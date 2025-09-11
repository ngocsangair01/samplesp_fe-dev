import { Component, OnInit, Input } from '@angular/core';
import {contentData} from './dashboard.models'

@Component({
  selector: 'dashboard-card-component',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.css']
})

export class dashboardCardComponent implements OnInit {

  @Input() index:string
  classColor:string

  listColor=["red","blue","skyblue","grey","brown","green"]
  listCurrentColor=[]
  constructor() {

  }
  buildData:contentData
  ngOnInit() {
    this.classColor =  this.listColor[this.index]  
  }


}
