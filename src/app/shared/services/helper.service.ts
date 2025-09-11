import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  public ORGANIZATION = new BehaviorSubject<any>([]);
  public HEADER_NOTIFICATION = new BehaviorSubject<any>([]);
  public PARTY_ORGANIZATION = new BehaviorSubject<any>([]);
  public MASS_ORGANIZATION = new BehaviorSubject<any>([]);
  public CRITERIA = new BehaviorSubject<any>([]);
  public APP_TOAST_MESSAGE = new BehaviorSubject<any>([]);
  public APP_CONFIRM_DELETE = new BehaviorSubject(null);
  public APP_SHOW_HIDE_LEFT_MENU = new BehaviorSubject<any>([]);
  public APP_SHOW_PROCESSING = new BehaviorSubject<any>([]);
  public CHANGE_FILE = new BehaviorSubject<any>([]);
  public ASSESSMENT_DATA = new BehaviorSubject<any>([]);
  public TRANSFER_EMPLOYEE = new BehaviorSubject<any>([]);
  public EMPLOYEE_URL = new BehaviorSubject<any>([]);
  public ORGANIZATION_MANAGER = new BehaviorSubject<any>([]);
  public ASSESSMENT_MONITOR = new BehaviorSubject<any>([]);
  public APP_BLOCK_CRITICAL = new BehaviorSubject<any>(false);
  constructor() { }


  transferEmployeeData(data) {
    this.TRANSFER_EMPLOYEE.next(data);
  }

  assessmentData(data) {
    this.ASSESSMENT_DATA.next(data);
  }
  /**
   * afterSaveOrganization
   * param data
   */
  afterSaveOrganization(data) {
    this.ORGANIZATION.next(data);
  }
   /**
   * afterSaveOrganization
   * param data
   */
  reloadTreeParty(data) {
    this.PARTY_ORGANIZATION.next(data);
  }


  reloadHeaderNotification(data) {
    this.HEADER_NOTIFICATION.next(data);
  }

  resetParty() {
    this.PARTY_ORGANIZATION.next(null);
  }
  /**
   * afterSaveOrganization
   * param data
   */
  reloadTreeCriteria(data) {
    this.CRITERIA.next(data);
  }

  resetCriteria() {
    this.CRITERIA.next(null);
  }

  /**
   * createMessage
   * param data
   */
  processReturnMessage(data) {
    this.APP_TOAST_MESSAGE.next(data);
  }
  /**
   * processing
   * param data
   */
  isProcessing(isProcessing: boolean) {
    this.APP_SHOW_PROCESSING.next(isProcessing);
  }
  /**
   * processing
   * param data
   */
  setWaitDisplayLoading(isWait: boolean) {
    this.APP_BLOCK_CRITICAL.next(isWait);
  }
  /**
   * confirmDelete
   * param data
   */
  confirmDelete(data) {
    this.APP_CONFIRM_DELETE.next(data);
    // this.APP_CONFIRM_DELETE.pipe(data);
  }

  refreshConfirmDelete() {
    this.APP_CONFIRM_DELETE = new BehaviorSubject({});
  }
  /**
   * Load lại cây đơn vị
   */
  reloadTreeOrganization(data) {
    this.ORGANIZATION.next({type: 'RELOAD_TREE', data: data});
  }

  reloadGridOrganization(data) {
    this.ORGANIZATION.next({type: 'RELOAD_GRID', data: data});
  }
  // search theo tree
  reloadTreeMass(data) {
    this.MASS_ORGANIZATION.next(data);
  }
  resetMass() {
    this.MASS_ORGANIZATION.next(null);
  }

  changFile(data) {
    this.CHANGE_FILE.next(data);
  }

  resolveUrlEmployee(data){
    this.EMPLOYEE_URL.next(data);
  }

  // search theo tree
  reloadTreeOrg(data) {
    this.ORGANIZATION_MANAGER.next(data);
  }
  resetOrg() {
    this.ORGANIZATION_MANAGER.next(null);
  }

  reloadTreeAssessment(data) {
    this.ASSESSMENT_MONITOR.next(data);
  }
  resetAssessment() {
    this.ASSESSMENT_MONITOR.next(null);
  }
}
