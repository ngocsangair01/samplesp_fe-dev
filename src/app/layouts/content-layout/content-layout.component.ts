import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import {  UserToken } from '@app/core';
import { HrStorage } from '@app/core/services/HrStorage';
import { HelperService } from '@app/shared/services/helper.service';
import { LocaleService, TranslationService } from 'angular-l10n';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.css']
})
export class ContentLayoutComponent implements OnInit {

  public items: MenuItem[];
  home: MenuItem;
  public isMinium = false;
  public isBack = true;
  private listUrlEmployee = [];
  public disableBreadCrumb = false;
  private userToken: UserToken;
  public currentUrl: string = '';
  public isCurtailLayout: boolean = false;
  public isExtendLayout: boolean = false;
  public isMobileLayout: boolean = false;

  constructor(
    public locale: LocaleService,
    public router: Router,
    public translation: TranslationService,
    public helperService: HelperService) {
  }
  public navViewChange(isMinium) {
    this.isMinium = isMinium;
  }

  public navFlipChange(isBack) {
    this.isBack = isBack;
  }

  ngOnInit() {
    this.isMinium = (true === HrStorage.getNavState());
    this.isBack = (true === HrStorage.getNavFlipState());
  }
  public headerViewChange(event: any) {
      this.isCurtailLayout = event.isExtendMenu;
      this.isExtendLayout = event.isHiddenMenu;
      this.isMobileLayout = event.isMenuMobile;
  }
}
