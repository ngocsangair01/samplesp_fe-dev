import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HomeEmployeeService } from '@app/core/services/home/home-employee.service';
import { AppComponent } from '@app/app.component';
import {ActivatedRoute, Router} from '@angular/router';
import { HrStorage } from '@app/core/services/HrStorage';
import {environment, UrlConfig} from '@env/environment';
import {EmployeeResolver} from "@app/shared/services/employee.resolver";
import {UserMenu} from "@app/core";

@Component({
  selector: 'header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.css']
})
export class HeaderSearchComponent implements OnInit {
  results: string[];
  formSearch: FormGroup;
  public API_URL = environment.serverUrl['political'];
  userInfo: any;
  constructor(private formBuilder: FormBuilder
            , private homeEmployeeService: HomeEmployeeService
            , private app: AppComponent
            , private router: Router
             ) {
    this.buildForm();
  }
  /**
   * buildForm
   */
  private buildForm(): void {
    const employeeCode = this.findState('employeeCode');
    const fullName = this.findState('fullName');
    const email = this.findState('email');
    const mobile_number = this.findState('mobile_number');
    this.formSearch = this.formBuilder.group({
      keyword: [''],
      employeeCode: [employeeCode === null ? true : employeeCode],
      fullName: [fullName === null ? true : fullName],
      email: [email === null ? true : email],
      mobileNumber: [mobile_number === null ? true : mobile_number],
      cmt: [this.findState('cmt')],
      tax: [this.findState('tax')],
      // bh: [this.findState('bh')],
    });
  }
  findState(key: string): boolean {
    const searchState = HrStorage.getSearchState();
    if (searchState == null) {
      return null;
    }
    return searchState[key] === true ? true : false;
  }
  search() {
    const params = this.formSearch ? this.formSearch.value : null;
    if (!params.employeeCode && !params.fullName && !params.email
      && !params.cmt && !params.mobileNumber && !params.tax
      ) {
      this.app.warningMessage('quickSearch.mustChose');
      this.results = [];
      return;
    }
    this.homeEmployeeService.search(params).subscribe(res => {
      this.results = res;
    });
  }
  onSelect(event) {
    window.location.href = "/employee/curriculum-vitae/"+ event.employeeId+ "/view";
    this.formSearch.get('keyword').setValue(event.fullName);
    this.onBlur(event);
    document.getElementById('closeModal').click();
  }
  onChange($event) {
    if ($event.target.value !== "") {
        setTimeout(() => {
            this.search()
        }, 1000)
    } else {
        this.results = [];
    }
  }
  onBlur($event) {
    this.results = [];
  }
  /**
   * ngOnInit
   */
  ngOnInit(): void {
    this.getUserInfo();
  }
 /**
   * ngOnInit
   */
  getUserInfo() {
    const userToken = HrStorage.getUserToken();
    this.userInfo = userToken.userInfo;
  }
  openModal() {
    const inputGroupInfo = document.getElementsByClassName('btn-info');
    const inputGroupDanger = document.getElementsByClassName('btn-danger');
    const leftMenu = document.getElementsByClassName('left-menu');
    Array.prototype.forEach.call(inputGroupInfo, function(element) {
      element.style.zIndex = '0';
    })
    Array.prototype.forEach.call(inputGroupDanger, function(element) {
      element.style.zIndex = '0';
    })
    Array.prototype.forEach.call(leftMenu, function(element) {
      element.style.zIndex = '0';
    })
  }
  changeCodition(): void {
    const value = this.formSearch.value;
    HrStorage.setSearchState(value);
  }
}
