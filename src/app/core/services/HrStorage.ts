import { CommonUtils } from '@app/shared/services/common-utils.service';
import { UserToken } from '../models';
import { Injectable } from '@angular/core';
import { CryptoService } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
class StorageData {
  userToken: UserToken;
  navState: boolean;
  navFlipState: boolean;
  searchState: any;
  listLang: any;
  listMarket: any;
  currentUrl: any;
  intro: any;
  branchListViewTableau: any[] = []
}
export class HrStorage {
  public static data: StorageData;
  private static expriteIn = '_expriteIn';
  private static instanceName = '_HrStorage';

  private static storage = localStorage;

  /**
   * init
   */
  public static init(): void {

  }
  /**
   * isExprited
   */
  public static isExprited(): boolean {
    return false;
  }
  /**
   * clear
   */
  public static clear(): void {
    this.storage.removeItem(this.instanceName);
  }
  /**
   * storedData
   */
  public static storedData(): StorageData {
    const storedData = this.storage.getItem(this.instanceName);
    if (CommonUtils.isNullOrEmpty(storedData)) {
      return null;
    }
    return CryptoService.decr(storedData);
  }
  /**
   * get
   */
  public static get(key: string): any {
    if (this.isExprited()) {
      return null;
    }
    const storedData = this.storedData();
    if (storedData == null) {
      return null;
    }
    return storedData[key];
  }
  /**
   * get
   */
  public static set(key: string, val: any): any {
    let storedData = this.storedData();
    if (storedData == null) {
      storedData = new StorageData();
    }
    storedData[key] = val;

    this.storage.setItem(this.instanceName, CryptoService.encr(storedData));
  }
  /**
   * getUserToken
   */
  public static getUserToken(): UserToken {
    return this.get('userToken');
  }
  /**
   * setUserToken
   */
  public static setUserToken(userToken) {
    return this.set('userToken', userToken);
  }
  /**
   * getNavState
   */
  public static getNavState(): boolean {
    const navState = this.get('navState');
    return navState === null ? false : navState;
  }
  /**
   * setNavState
   */
  public static setNavState(navState: boolean): void {
    this.set('navState', navState);
  }
  /**
   * getNavFlipState
   */
  public static getNavFlipState(): boolean {
    const navFlipState = this.get('navFlipState');
    return navFlipState === null ? false : navFlipState;
  }
  /**
   * setNavFlipState
   */
  public static setNavFlipState(navFlipState: boolean): void {
    this.set('navFlipState', navFlipState);
  }
  /**
   * getSearchState
   */
  public static getSearchState(): any {
    return this.get('searchState');
  }
  /**
   * setNavFlipState
   */
  public static setSearchState(searchState: any): void {
    this.set('searchState', searchState);
  }
  /**
   * getSelectedLang
   */
  public static getSelectedLang(): any {
    const listLang = this.getListLang();
    if (listLang == null) {
      return null;
    }
    for (const item of listLang) {
      if (item.isDefault === 1) {
        return item;
      }
    }
    return listLang[0];
  }
   /**
   * setSelectedLang
   */
  public static setSelectedLang(object: any): void {
    const listLang = this.getListLang();
    if (listLang == null) {
      return;
    }
    for (const item of listLang) {
      if (object.code === item.code) {
        item.isDefault = 1;
      } else {
        item.isDefault = null;
      }
    }
    this.setListLang(listLang);
  }
  /**
   * getListLang
   */
  public static getListLang(): any {
    return this.get('listLang');
  }
  /**
   * setListLang
   */
  public static setListLang(listLang: any): void {
    this.set('listLang', listLang);
  }
  /**
   * getCurrentMarket
   */
  public static getSelectedMarket(): any {
    const listMarket = this.getListMarket();
    if (listMarket == null) {
      return null;
    }
    for (const item of listMarket) {
      if (item.isDefault && item.isDefault === 1) {
        return item;
      }
    }
    return listMarket[0];
  }
  /**
   * setSelectedMarket
   */
  public static setSelectedMarket(object: any): void {
    const listMarket = this.getListMarket();
    if (listMarket == null) {
      return;
    }
    for (const item of listMarket) {
      if (object.marketCompanyId === item.marketCompanyId) {
        item.isDefault = 1;
      } else {
        item.isDefault = null;
      }
    }
    this.setListMarket(listMarket);
  }
  /**
   * getListMarket
   */
  public static getListMarket(): any {
    return this.get('listMarket');
  }
  /**
   * setListMarket
   */
  public static setListMarket(listMarket: any): void {
    this.set('listMarket', listMarket);
  }

  /**
   * getCurrentUrl
   */
  public static getCurrentUrl(): any {
    return this.get('currentUrl');
  }
  /**
   * setCurrentUrl
   */
  public static setCurrentUrl(currentUrl: any): void {
    this.set('currentUrl', currentUrl);
  }
  /**
   * getIntro
   */
  public static getIntro(): any {
    return this.get('intro');
  }
  /**
   * setIntro
   */
  public static setIntro(intro: any): void {
    this.set('intro', intro);
  }
  /**
   * introIsDone
   * @ param screenCode
   */
  public static introIsDone(screenCode: string) {
    const intro = this.getIntro();
    if (intro == null || intro.length === 0) {
      return false;
    }
    return intro.indexOf(screenCode) > -1;
  }
  /**
   * introIsDone
   * @ param screenCode
   */
  public static introSetDone(screenCode: string) {
    let intro = this.getIntro();
    if (intro == null || intro.length === 0) {
      intro = [];
    }
    if (intro.indexOf(screenCode) > -1) {
      return;
    }
    intro.push(screenCode);
    this.setIntro(intro);
  }
  
  /**
   * getPermissionByCode
   */
  public static getDefaultDomainByCode(operationCode: string, resourceCode: string) {
    const token = this.getUserToken();
    for (const obj of token.userPermissionList) {
      if (obj['operationCode'] === operationCode && obj['resourceCode'] === resourceCode) {
        return obj['defaultDomain'];
      }
    }
    return null;
  }

  /**
   * getGrantedDomainByCode
   */
  public static getGrantedDomainByCode(operationCode: string, resourceCode: string) {
    const token = this.getUserToken();
    for (const obj of token.userPermissionList) {
      if (obj['operationCode'] === operationCode && obj['resourceCode'] === resourceCode) {
        return obj['grantedDomain'];
      }
    }
    return null;
  }
  
  /**
   * getTheme
   */
  public static getTheme(): any {
    return this.get('theme');
  }
  /**
   * setTheme
   */
  public static setTheme(theme: any): void {
    this.set('theme', theme);
  }

  /**
   * getBranchListViewTableau
   */
  public static getBranchListViewTableau(): any[] {
    return this.get('branchListViewTableau');
  }
  /**
   * setBranchListViewTableau
   */
  public static setBranchListViewTableau(branchListViewTableau: any[]): void {
    this.set('branchListViewTableau', branchListViewTableau);
  }

  /**
   * getBackground
   */
  public static getBackground(): any {
    return this.get('background');
  }
  /**
   * setBackground
   */
  public static setBackground(background: any): void {
    this.set('background', background);
  }
}
