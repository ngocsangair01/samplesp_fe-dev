
import { BaseControl } from '../../core/models/base.control';
import { SysPropertyDetailBean } from './../../core/models/sys-property-details.model';
import { HttpParams, HttpParameterCodec } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PERMISSION_CODE, ACTION_FORM } from '@app/core/app-config';
import { ConfigDefault, UrlConfig } from '@env/environment';
import { UserPermission } from '@app/core/models';
import { FormGroup, FormArray, FormControl, } from '@angular/forms';
import { HrStorage } from '@app/core/services/HrStorage';

@Injectable({
  providedIn: 'root'
})
export class CommonUtils {
  public static isNullOrEmpty(str: any): boolean {
    return !str || (str + '').trim() === '';
  }

  public static isValidId(id: any): boolean {
    if (CommonUtils.isNullOrEmpty(id)) {
      return false;
    }
    if (id === '0') {
      return false;
    }
    return true;
  }

  public static isRealNumber(num: any): boolean {
    if (CommonUtils.isNullOrEmpty(num)) {
      return false;
    }
    if (num === '0' || num === 0) {
      return false;
    }
    return true;
  }

  public static tctReplaceAll(text: string, code: string, decode: string) {
    let old_text = text;
    do {
      old_text = text;
      text = text.replace(code, decode);
    } while (old_text !== text);
    return text;
  }
  public static trim(text: string) {
    if (text == null) {
      return text;
    }
    return text.trim();
  }

  /**
   * return 1 if num1 > num2
   * return 0 if num2 === num2
   * return -1 if num1 < num2
   */
  public static compareNumber(num1: any, num2: any): number {
    return parseFloat(num1) > parseFloat(num2) ? 1 : (parseFloat(num1) === parseFloat(num2) ? 0 : -1);
  }

  /**
   * getPermissionCode
   * @param code: string
   */
  public static getPermissionCode(code: string): string {
    if(code){
      return PERMISSION_CODE[code] || code;
    }
    return PERMISSION_CODE[code] || '';
  }

  /**
   * has Permission
   */
  public static havePermission(operationKey: string, adResourceKey: string): boolean {
    const permissionCode = this.getPermissionCode(operationKey) + ' ' + this.getPermissionCode(adResourceKey);
    const userInfo = HrStorage.getUserToken();
    if (userInfo == null) {
      return false;
    }

    if (!userInfo.userId) {
      return false;
    }

    const userPermissionList: UserPermission[] = userInfo.userPermissionList;
    if (userPermissionList == null || userPermissionList.length <= 0) {
      return false;
    }

    for (const userPermission of userPermissionList) {
      const check = userPermission.operationCode + ' ' + userPermission.resourceCode;
      if (check === permissionCode) {
        return true;
      }
    }

    return false;
  }

  public static getPermissionByResourceCode(resourceCode: string): any {
    const userInfo = HrStorage.getUserToken();
    if (userInfo == null || !userInfo.userId) {
      return false;
    }
    const userPermissionList: UserPermission[] = userInfo.userPermissionList;
    if (userPermissionList == null || userPermissionList.length <= 0) {
      return false;
    }
    return userPermissionList.filter(x => x.resourceCode === resourceCode);
  }
  public static getPermissionByListResourceCode(resourceCodes: string[]): any {
    const userInfo = HrStorage.getUserToken();
    if (userInfo == null || !userInfo.userId) {
      return false;
    }
    const userPermissionList: UserPermission[] = userInfo.userPermissionList;
    if (userPermissionList == null || userPermissionList.length <= 0) {
      return false;
    }

    let listResult = [];

    resourceCodes.forEach(x => {
      listResult = listResult.concat(userPermissionList.filter(y => y.resourceCode === x));
    });
    return listResult;
  }

  /**
   * copyProperties
   * param dest
   * param orgs
   */
  public static copyProperties(dest: any, orig: any): any {
    if (!orig) {
      return dest;
    }

    for (const k in dest) {
      if (orig.hasOwnProperty(k)) {
        dest[k] = orig[k];
      }
    }
    return dest;
  }

  /**
   * Clone all properties from source and save typeof dest
   * Author:huynq
   * @param source :object Source
   */
  public static cloneObject(dest: any, source: any): any {
    if (!source) {
      return dest;
    }
    for (const attribute in source) {
      if (source[attribute] !== undefined) {
        if (source[attribute] === null) {
          dest[attribute] = null;
        } else if (typeof source[attribute] === 'object') {
          dest[attribute] = Object.assign({}, source[attribute]);
        } else {
          dest[attribute] = source[attribute];
        }
      }
    }
    return dest;
  }

  /**
   * toPropertyDetails: transfer json to Array<SysPropertyDetailBean>
   */
  public static toPropertyDetails(source: any): Array<SysPropertyDetailBean> {
    const dest: Array<SysPropertyDetailBean> = [];
    if (source.length > 0) {
      for (const item of source) {
        let bean = new SysPropertyDetailBean(item.sysPropertyBO, item.marketCompanyBO);
        bean = CommonUtils.cloneObject(bean, item);
        dest.push(bean);
      }
    }
    return dest;
  }

  /**
   * copyProperties
   * param dest
   * param orgs
   */
  public static buildParams(obj: any): HttpParams {
    return Object.entries(obj || {})
      .reduce((params, [key, value]) => {
        if (value === null) {
          return params.set(key, String(''));
        } else if (typeof value === typeof {}) {
          return params.set(key, JSON.stringify(value));
        } else {
          return params.set(key, String(value));
        }
      }, new HttpParams({ encoder: new CustomEncoder() }));
  }

  /**
   * validateForm
   * @param form: FormGroup
   */
  public static isValidForm(form: any): boolean {
    setTimeout(() => {
      this.markAsTouched(form);
    }, 200);
    if (form.invalid) {
      setTimeout(() => {
        CommonUtils.scrollToSmoothly('.errorMessageDiv.show');
      }, 200);
    }
    return !form.invalid;
  }

  public static isValidFormAndValidity(form: any): boolean {
    this.markAsTouchedAndValidity(form);
    return !form.invalid;
  }

  public static markAsTouched(form: any) {
    if (form instanceof FormGroup) {
      CommonUtils.isValidFormGroup(form);
    } else if (form instanceof FormArray) {
      CommonUtils.isValidFormArray(form);
    } else if (form instanceof FormControl) {
      form.markAsTouched({ onlySelf: true });
      if (form.invalid) {
        console.warn('Validate error field:', form);
      }
    }
  }

  public static offset(el): any {
    const rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }

  public static scrollToSmoothly(querySelectorAll, time?) {
    const elements = document.querySelectorAll(querySelectorAll);
    if (!elements) {
      return;
    }
    const first = elements[0];
    if (!first) {
      return;
    }
    const position = CommonUtils.offset(first);
    if (isNaN(position.top)) {
      console.warn('Position must be a number');
      return;
    }
    if (position.top < 0) {
      console.warn('Position can not be negative');
      return;
    }
    let top = position.top - 100;
    const currentPos = window.scrollY || window.screenTop;
    if (currentPos > position.top) {
      top = position.top + 100;
    }
    try {
      window.scrollTo({ left: 0, top: top, behavior: 'smooth' });
    } catch (e) {
      window.scrollTo(0, top);
    }
  }

  /**
   * markAsTouchedAndValidity
   */
  public static markAsTouchedAndValidity(form: any) {
    if (form instanceof FormGroup) {
      CommonUtils.isValidFormGroupAndValidity(form);
    } else if (form instanceof FormArray) {
      form.markAsTouched({ onlySelf: true });
      CommonUtils.isValidFormArrayAndValidity(form);
    } else if (form instanceof FormControl) {
      form.updateValueAndValidity(); // tạm bổ sung ngày 28/03/2019, trường hợp validate nhập 1 thì bắt buộc nhập các trường còn lại
      form.markAsTouched({ onlySelf: true });
      if (form.invalid) {
        console.warn('Validate error field:', form);
      }
    }
  }

  public static isValidFormArrayAndValidity(form: FormArray) {
    if (form['isHidden'] === true) {// neu form đang bị ẩn thì không cần validate
      return;
    }
    for (const i in form.controls) {
      CommonUtils.markAsTouchedAndValidity(form.controls[i]); // neu form đang bị ẩn thì không cần validate
    }
  }

  public static isValidFormArray(form: FormArray) {
    if (form['isHidden'] === true) {
      return;
    }
    if (form.length == 0) {
      form.markAsTouched({ onlySelf: true });
      return
    }
    for (const i in form.controls) {
      CommonUtils.markAsTouched(form.controls[i]); // neu form đang bị ẩn thì không cần validate
    }
  }

  public static isValidFormGroup(form: FormGroup) {
    if (form['isHidden'] === true) {
      return;
    }
    Object.keys(form.controls).forEach(key => {
      CommonUtils.markAsTouched(form.get(key));
    });
  }

  public static isValidFormGroupAndValidity(form: FormGroup) {
    if (form['isHidden'] === true) {
      return;
    }
    Object.keys(form.controls).forEach(key => {
      CommonUtils.markAsTouchedAndValidity(form.get(key));
    });
  }

  /**
   * hàm xử lý lấy nationId hiện tại theo quốc gia
   */
  public static getNationId(): number {
    const selectedMarket = HrStorage.getSelectedMarket();
    if (selectedMarket == null) {
      return 1740;
    }
    return CommonUtils.nvl(selectedMarket.nationId, 1740);
  }

  public static getOrganizationId(){
    const userInfo = HrStorage.getUserToken();
    const userPermissionList: UserPermission[] = userInfo.userPermissionList;
    if (userPermissionList == null || userPermissionList.length <= 0) {
      return '';
    }
    if(userPermissionList[0].defaultDomain){
      return userPermissionList[0].defaultDomain;
    }
    if(userPermissionList[0].grantedDomain){
      let lstOrg = userPermissionList[0].grantedDomain.split(',');
      return lstOrg[0];
    }
    return '';
  }

  /**
   * hàm xử lý lấy nationId hiện tại theo quốc gia
   */
  public static getCurrentMarketCompanyId(): number {
    const selectedMarket = HrStorage.getSelectedMarket();
    if (selectedMarket == null) {
      return -1;
    }
    return CommonUtils.nvl(selectedMarket.marketCompanyId, -1);
  }

  /**
   * hàm xử lý lấy ngôn ngữ hiện tại của hệ thống
   */
  public static getCurrentLanguage(): any {
    const selectedLanguage = HrStorage.getSelectedLang();
    if (selectedLanguage == null) {
      return null;
    }
    return selectedLanguage;
  }

  /**
   * Hàm lấy DateFormat hiện tại theo MarketCompany. Ko có trả về mặc định
   */
  public static getDateFormat(): string {
    const nationProperty = HrStorage.getSelectedMarket();
    if (nationProperty === null || nationProperty === undefined || !nationProperty.dateFormat) {
      return ConfigDefault.dateFormat;
    }
    return nationProperty.dateFormat;
  }

  /**
   * hàm xử lý lấy UserMenu hiện tại
   */
  public static getUserMenu(): any[] {
    const userToken = HrStorage.getUserToken();
    if (userToken == null) {
      return [];
    }
    return userToken.userMenuList;
  }

  /**
   * hàm xử lý lấy Expired time
   */
  public static getTokenExpiresIn(): any {
    const userToken = HrStorage.getUserToken();
    if (userToken == null) {
      return null;
    }
    return userToken.tokenExpiresIn;
  }

  /**
   * hàm xử lý lấy getUserPermission hiện tại
   */
  public static getUserPermission(): any[] {
    const userToken = HrStorage.getUserToken();
    if (userToken == null) {
      return [];
    }
    return userToken.userPermissionList;
  }

  /**
   * hàm xử lý lấy nationId hiện tại theo quốc gia
   */
  public static toTreeNode(res: any): any {
    for (const node of res) {
      if (!node.leaf) {
        delete node.icon;
        if (node.children && node.children.length > 0) {
          node.children = CommonUtils.toTreeNode(node.children);
        }
      }
    }
    return res;
  }

  /**
   * hàm xử lý them dataTable vào node
   */
  public static toTreeNodeTable(res: any): any {
    for (let node of res) {
      if (node.expanded == false && node.selectedId == null) {
        // res.children.delete(node);
      } else {
        node.data = node.dataTable;
        node.children = CommonUtils.toTreeNodeTable(node.children);
      }
    }
    return res;
  }

  /**
   * hàm xử lý them dataTable vào node
   */
  public static toTreeNodeTableForCriteria(res: any): any {
    for (let node of res) {
      const orgId = Number(node.data)
      node.data = node.dataTable;
      node.data.organizationId = orgId;
      node.children = CommonUtils.toTreeNodeTableForCriteria(node.children);
    }
    return res;
  }

  /**
   * nvl
   * param value
   * param defaultValue
   */
  public static nvl(value: any, defaultValue: number = 0): number {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }
    return value;
  }

  /**
   * convert To FormData mutilpart request post
   */
  public static convertFormFile(dataPost: any): FormData {
    const filteredData = CommonUtils.convertData(dataPost);
    const formData = CommonUtils.objectToFormData(filteredData, '', []);
    return formData;
  }

  /**
   * objectToFormData
   */
  public static objectToFormData(obj, rootName, ignoreList): FormData {
    const formData = new FormData();
    function appendFormData(data, root) {
      if (!ignore(root)) {
        root = root || '';
        if (data instanceof File) {
          if (data.type !== 'vhr_stored_file') {
            formData.append(root, data);
          }
        } else if (Array.isArray(data)) {
          let index = 0;
          for (let i = 0; i < data.length; i++) {
            if (data[i] instanceof File) {
              if (data[i].type !== 'vhr_stored_file') {
                appendFormData(data[i], root + '[' + index + ']');
                index++;
              }
            } else {
              appendFormData(data[i], root + '[' + i + ']');
            }
          }
        } else if (data && typeof data === 'object') {
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              if (root === '') {
                appendFormData(data[key], key);
              } else {
                appendFormData(data[key], root + '.' + key);
              }
            }
          }
        } else {
          if (data !== null && typeof data !== 'undefined') {
            formData.append(root, data);
          }
        }
      }
    }

    function ignore(root) {
      return Array.isArray(ignoreList) && ignoreList.some(function (x) { return x === root; });
    }

    appendFormData(obj, rootName);
    return formData;
  }

  /**
   * convertData
   */
  public static convertData(data: any): any {
    if (typeof data === typeof {}) {
      return CommonUtils.convertDataObject(data);
    } else if (typeof data === typeof []) {
      return CommonUtils.convertDataArray(data);
    } else if (typeof data === typeof true) {
      return CommonUtils.convertBoolean(data);
    }
    return data;
  }

  /**
   * convertDataObject
   * param data
   */
  public static convertDataObject(data: Object): Object {
    if (data) {
      for (const key in data) {
        if (data[key] instanceof File) {

        } else {
          data[key] = CommonUtils.convertData(data[key]);
        }
      }
    }
    return data;
  }

  public static convertDataArray(data: Array<any>): Array<any> {
    if (data && data.length > 0) {
      for (const i in data) {
        data[i] = CommonUtils.convertData(data[i]);
      }
    }
    return data;
  }

  public static convertBoolean(value: Boolean): number {
    return value ? 1 : 0;
  }

  /**
   * tctGetFileSize
   * param files
   */
  public static tctGetFileSize(files) {
    try {
      let fileSize;
      // if (typeof files === typeof []) {
      //   fileSize = files[0].size;
      // } else {
      fileSize = files.size;
      // }
      fileSize /= (1024 * 1024); // chuyen ve MB
      return fileSize.toFixed(2);
    } catch (ex) {
      console.error(ex.message);
    }
  }

  /**
   * createForm controls
   */
  public static createForm(formData: any, options: any, validate?: any): FormGroup {
    const formGroup = new FormGroup({});
    for (const property in options) {
      if (formData.hasOwnProperty(property)) {
        options[property][0] = formData[property];
      }
      formGroup.addControl(property, new FormControl(options[property][0], options[property][1]));
    }
    if (validate) {
      formGroup.setValidators(validate);
    }
    return formGroup;
  }

  /**
   * createFormNew use Dynamic Input
   */
  public static createFormNew(resource
    , actionForm: ACTION_FORM
    , formData: any
    , options: any
    , propConfigs?: Array<SysPropertyDetailBean>
    , validate?: any): FormGroup {
    const formGroup = new FormGroup({});
    for (const property in options) {
      const config = propConfigs && propConfigs.length > 0
        ? propConfigs.filter(item => item.propertyCode === property && item.actionForm === actionForm)[0] : null;
      const control = new BaseControl();
      control.propertyName = property;
      control.actionForm = actionForm;
      control.resource = resource;
      control.configBaseControl(config, options[property][1]);
      control.setValue(options[property][0]);

      if (formData.hasOwnProperty(property)) {
        control.setValue(formData[property]);
      }
      control.setValidators(control.getListValidation());
      formGroup.addControl(property, control);
      formGroup.get(property).updateValueAndValidity();
    }
    if (validate) {
      formGroup.setValidators(validate);
    }
    return formGroup;
  }
  /**
  * create BaseControl use Dynamic Input
  */
  public static createControl(actionForm: ACTION_FORM
    , propertyName: any
    , propertyValue?: any
    , propertyValidate?: any
    , propConfigs?: Array<SysPropertyDetailBean>): BaseControl {

    const config = propConfigs && propConfigs.length > 0
      ? propConfigs.filter(item => item.propertyCode === propertyName && item.actionForm === actionForm)[0] : null;
    const control = new BaseControl();
    control.propertyName = propertyName;
    control.actionForm = actionForm;
    control.resource = propConfigs && propConfigs.length > 0 ? propConfigs[0].resourceCode : null;
    control.configBaseControl(config, propertyValidate);
    if (propertyValue) {
      control.setValue(propertyValue);
    }
    control.setValidators(control.getListValidation());
    return control;
  }
  public static convertEnumToChoiceArray(data: any) {
    const result = [];
    for (const prop in data) {
      result.push({
        code: data[prop],
        name: data[prop]
      });
    }
    return result;
  }
  /**
   * pureDataToTreeNode: for workFlows - Menu
   * @param dataSource: array Menu in VPS
   * @param pureData: array Workflows in VHCM_System
   */
  public static pureDataToTreeNode(dataSource: any, pureData: any): any {
    const dataDest = [];
    for (const item of pureData) {
      const tmp = dataSource.find(x => x.nodeId === item.nodeId);
      if (tmp) {
        tmp.isMainAction = item.isMainAction ? item.isMainAction : null;
        tmp.workFlowId = item.workFlowId ? item.workFlowId : null;
        tmp.wfMenuMappingId = item.wfMenuMappingId ? item.wfMenuMappingId : null;
        tmp.referenceNum = dataSource.filter(x => x.parentId === tmp.nodeId).length;
        dataDest.push(tmp);
      }
    }
    return CommonUtils.sort(dataDest, 'sortOrder');
  }
  /**
   * sort
   * @param dataSource: array
   * @param fieldSort: field choosed to sort
   * @param ascending: ascending: 1; descending: -1; default: 1.
   */
  public static sort(dataSource: any, fieldSort: any, ascending?: number) {
    if (!ascending) {
      ascending = 1;
    }
    return dataSource.sort((left, right): number => {
      if (left[fieldSort] < right[fieldSort]) {
        return -ascending;
      }
      if (left.sortOrder > right.sortOrder) {
        return ascending;
      }
      return 0;
    });
  }
  public static convertVpsMenus(data: any, keyId?: string): any {
    keyId = keyId || 'nodeId';
    const dataMap = data.reduce((m, d) => {
      m[d[keyId]] = Object.assign({}, d);
      return m;
    }, {});

    const listTemp = data.filter(d => {
      if (d.parentId !== null) { // assign child to its parent
        const parentNode = dataMap[d.parentId];
        if (!parentNode) {
          return true;
        }
        if (parentNode['items'] === undefined || parentNode['items'] === null) {
          parentNode['items'] = [];
        }
        parentNode.items.push(dataMap[d[keyId]]);
        return false;
      }
      return true; // root node, do nothing
    }).map(d =>  dataMap[d[keyId]]);
    return listTemp;
  }
  // Check giao quá trình giữa 2 khoảng ngày
  public static tctCompareDates(date1, date2): number {
    const diff = date1 - date2;
    return (diff < 0) ? -1 : (diff === 0) ? 0 : 1;
  }
  public static betweenDate(check, startDate, endDate): boolean {
    return (CommonUtils.tctCompareDates(startDate, check) < 0) && (CommonUtils.tctCompareDates(check, endDate) < 0);
  }
  /**
   * check date conflict time
   * @param Date startDate1
   * @param Date endDate1
   * @param Date startDate2
   * @param Date endDate2
   * @return true or false
   */
  public static isConflictDate(startDate1, endDate1, startDate2, endDate2) {
    if (CommonUtils.isNullOrEmpty(endDate2)) {
      return (CommonUtils.isNullOrEmpty(endDate1) || (CommonUtils.tctCompareDates(startDate2, endDate1) < 0));
    } else {
      return (CommonUtils.isNullOrEmpty(endDate1) && (CommonUtils.tctCompareDates(startDate1, endDate2) < 0))
        || (!CommonUtils.isNullOrEmpty(endDate1)
          && (CommonUtils.betweenDate(startDate1, startDate2, endDate2)
            || CommonUtils.betweenDate(endDate1, startDate2, endDate2)
            || CommonUtils.betweenDate(startDate2, startDate1, endDate1)
            || CommonUtils.betweenDate(endDate2, startDate1, endDate1))
        );
    }
  }
  public static logoutAction() {
    HrStorage.clear();
    const URL = UrlConfig.ssoAddress + '/logout?service=';
    const serviceUrl = UrlConfig.clientAddress;
    window.location.href = URL + this.toUrlString(serviceUrl);
  }
  public static logoutAssessmentSystem() {
    HrStorage.clear();
    const URL = UrlConfig.ssoAddress + '/logout?service=';
    const serviceUrl = UrlConfig.clientAddress + "/assessment";
    window.location.href = URL + this.toUrlString(serviceUrl);
  }
  private static toUrlString(src: any) {
    let dest = src;
    while (dest.indexOf(':') >= 0) {
      dest = dest.replace(':', '%3A');
    }
    while (dest.indexOf('/') >= 0) {
      dest = dest.replace('/', '%2F');
    }
    return dest;
  }
  public static joinStringFromArray(listObject: any, fieldName: any, separator?: any) {
    if (!separator) {
      separator = ',';
    }
    const arrTemp = [];
    listObject.forEach((o) => { arrTemp.push(o[fieldName]); });
    return arrTemp.join(separator);
  }

  public static removeAccents(str) {
    var AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ", "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ"
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
      var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
      var char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    return str;
  }

  /**
   * Hàm lấy danh sách năm trong khoảng xác định so với năm hiện tại
   * @param firstRange
   * @param secondRange
   */
  public static getYearList(firstRange: number, secondRange: number): any {
    const listYear = [];
    const currentYear = new Date().getFullYear();
    for (let i = (currentYear - firstRange); i <= (currentYear + secondRange); i++) {
      const obj = {
        year: i
      };
      listYear.push(obj);
    }
    return listYear;
  }

  public static getMonthList() {
    const monthList = [];
    for (let i = 1; i < 13; i++) {
      const month = {
        name: `Tháng ${i}`,
        month: i
      };
      monthList.push(month);
    }
    return monthList;
  }

  /**
   * Lay ra quy theo ngay truyen vao
   * @param d(date)
   */
  public static getQuarter(d?) {
    d = d || new Date(); // If no date supplied, use today
    var q = [1, 2, 3, 4];
    return q[Math.floor(d.getMonth() / 3)];
  }



  public static clearFormArray(formArray: FormArray) {
    if (formArray) {
      while (formArray.length !== 0) {
        formArray.removeAt(0);
      }
    }

    return formArray;
  }

  public static executeFunctionByName(functionName, context, event) {
    let args = null;
    const indexCharStart = functionName.indexOf('(');
    const indexCharEnd = functionName.indexOf(')');
    if (indexCharStart !== - 1) {
      const strArgs = functionName.substring(indexCharStart + 1, indexCharEnd);
      args = strArgs.split(",").map(el => {
        if (el === "$event") {
          el = event;
        }
        return el;
      });
      functionName = functionName.substring(0 , indexCharStart);
    }
    return context[functionName].apply(context, args);
  }
}

class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}