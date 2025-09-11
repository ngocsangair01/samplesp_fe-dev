import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { APP_CONSTANTS, HELP_MAPPING_MENU } from '@app/core';

@Component({
  selector: 'help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
  url: any;
  listMenuMappingHelp: any;

  constructor(public sanitizer: DomSanitizer) { 
    this.listMenuMappingHelp = HELP_MAPPING_MENU;
   }

  ngOnInit() {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://10.60.133.34:8000/");
  }

  onChangeMenu(_url: string){
    const menuMappingHelp = this.listMenuMappingHelp.find(e =>e.url == _url);
    if(menuMappingHelp != null){
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(menuMappingHelp.url_help);
    }
  }

  openModal() {
    const inputGroupInfo = document.getElementsByClassName('btn-info');
    const inputGroupDanger = document.getElementsByClassName('btn-danger');
    Array.prototype.forEach.call(inputGroupInfo, function(element) {
      element.style.zIndex = '0';
    })
    Array.prototype.forEach.call(inputGroupDanger, function(element) {
      element.style.zIndex = '0';
    })
  }
}