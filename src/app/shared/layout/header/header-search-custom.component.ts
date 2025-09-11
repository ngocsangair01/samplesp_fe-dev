import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HomeEmployeeService } from '@app/core/services/home/home-employee.service';
import { AppComponent } from '@app/app.component';
import { Router } from '@angular/router';
import { HrStorage } from '@app/core/services/HrStorage';
import { environment } from '@env/environment';
import { debounceTime } from 'rxjs/operators';
import {UserMenu} from "@app/core";

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { Observable, from } from 'rxjs';
// import { map, startWith, filter, pluck } from 'rxjs/operators';
// import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'header-search-custom',
  templateUrl: './header-search-custom.component.html',
  styleUrls: ['./header-search-custom.component.css']
})
export class HeaderSearchCustomComponent implements OnInit {
    results: any[];
    formSearch: FormGroup;
    public API_URL = environment.serverUrl['political'];
    userInfo: any;
    menuList: any[];

    constructor(private formBuilder: FormBuilder
        , private homeEmployeeService: HomeEmployeeService
        , private app: AppComponent
        , private router: Router
    ) {

        this.buildForm();
        const userToken = HrStorage.getUserToken();
        this.menuList = userToken.userMenuList;
        this.menuList.forEach((item: UserMenu) => {
            if (item.parentId != null && this.menuList.find(s => s.sysMenuId == item.parentId) != null) {
                item.fullName = this.getFullName(this.menuList.find(s => s.sysMenuId == item.parentId), item.name);
            } else {
                item.fullName = item.name;
            }
        })

    }

    private getFullName(menu: any, fullName: string): string {
        if (menu.parentId != null && this.menuList.find(s => s.sysMenuId == menu.parentId) != null) {
            fullName = menu.name + '/' + fullName;
            fullName = this.getFullName(this.menuList.find(s => s.sysMenuId == menu.parentId), fullName);
        } else {
            fullName = menu.name + '/' + fullName;
        }
        return fullName;

    }

    /**
     * buildForm
     */
    private buildForm(): void {
        const employeeCode = this.findState('employeeCode');
        const fullName = this.findState('fullName');
        const email = this.findState('email');
        this.formSearch = this.formBuilder.group({
            keyword: [''],
            employeeCode: [employeeCode === null ? true : employeeCode],
            fullName: [fullName === null ? true : fullName],
            email: [email === null ? true : email],
            mobileNumber: [this.findState('mobileNumber')],
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
        // this.homeEmployeeService.search(params).subscribe(res => {
        //   this.results = res;
        // });

    }

    onSelect(event) {
        this.router.navigate([event.url]);
        this.formSearch.get('keyword').setValue(event.fullName);
    }

    onChange($event) {
        if (this.formSearch.value.keyword !== "") {
            setTimeout(() => {
                this.results = this.menuList.filter((i: UserMenu) => {
                    if (i.fullName) return i.fullName.toUpperCase().includes(this.formSearch.value.keyword.trim().toUpperCase()) && i.fullName
                })
                for(const item of this.results){
                    if(!item.url){
                        let sortOrder = 0
                        for (const itemChild of this.getListMenuChild(item.sysMenuId, this.results)){
                            if((sortOrder === 0) || (sortOrder !== 0 && sortOrder> itemChild.sortOrder)){
                                item.url = itemChild.url
                                sortOrder = itemChild.sortOrder
                            }
                        }
                    }
                }
            }, 1000)
        } else {
            this.results = [];
        }

    }

    getListMenuChild(parentId: any, listMenu: any){
        if(listMenu){
            let listNew = [];
            for(const item of listMenu){
                if(item.parentId === parentId){
                    if(item.url){
                        listNew.push(item)
                    }else{
                        for(const itemChild of this.getListMenuChild(item.sysMenuId, listMenu)){
                            listNew.push(itemChild);
                        }
                    }
                }
            }
            return listNew;
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
        // console.log(userToken.userMenuList.filter((i: any) => i.url))
    }

    changeCodition(): void {
        const value = this.formSearch.value;
        HrStorage.setSearchState(value);
    }
  // formSearch: FormGroup;
  // constructor(private http: HttpClient, private formBuilder: FormBuilder) {
  //   this.buildForm();
  // }

  // private buildForm(): void {
  //   this.formSearch = this.formBuilder.group({
  //     hiddenCtrl: [''],
  //     myControl: ['']
  //   });
  // }

  // private fieldList: SuggestionDetails = { Name: Action.Field, Value: [], Valid: ['string'] };
  // private operatorList: SuggestionDetails = { Name: Action.Operator, Value: ['=', '!=', '>'], Valid: ['string'] };
  // private valueList: SuggestionDetails = { Name: Action.Value, Value: [], Valid: ['string'] };
  // private expressionList: SuggestionDetails = { Name: Action.Expression, Value: ['And', 'Or'], Valid: ['string'] };

  // private operator: string[] = this.operatorList.Value;
  // private value: string[] = this.valueList.Value;
  // private expression: string[] = this.expressionList.Value;

  // private get field(): string[] {
  //   return this.fieldList.Value;
  // }

  // filteredOptions: any;
  // private searchList: any = [];

  // private get selectionList(): SelectionDict[] {
  //   return [
  //     { Name: Action.Field, Value: this.field, NextSelection: Action.Operator },
  //     { Name: Action.Operator, Value: this.operator, NextSelection: Action.Value },
  //     { Name: Action.Value, Value: this.value, NextSelection: Action.Expression },
  //     { Name: Action.Expression, Value: this.expression, NextSelection: Action.Field }
  //   ];
  // }

  // private defaultSelection: string = Action.Field;
  // private currentEvent: string;
  // private response: ApiResponse[] = [];

  // ngOnInit() {
  //   this.fieldList
  //   this.getSearchObject();
  //   this.formSearch.get('myControl').valueChanges.subscribe(value => {
  //     this.filteredOptions = this._filter(value);
  //     console.log(this.filteredOptions)
  //   });
  // this.filteredOptions = this.formSearch.controls.myControl.valueChanges.subscribe((value: any) => this._filter(value));
  // }


  // getSearchObject(): void {
  // HTTP response
  //   var response = from([
  //     {
  //       "Result": {
  //         "DisplayName": "Name",
  //         "SearchType": "Field",
  //         "AutoCompleteValues": [
  //           "Biswa",
  //           "Kalyan",
  //           "Das",
  //           "Vicky",
  //           "Awesome"
  //         ]
  //       }
  //     },
  //     {
  //       "Result": {
  //         "DisplayName": "Company",
  //         "SearchType": "Field",
  //         "AutoCompleteValues": [
  //           "Youtube",
  //           "Git",
  //           "Techno",
  //           "Saviour",
  //           "TechnoSaviour"
  //         ]
  //       }
  //     },
  //     {
  //       "Result": {
  //         "DisplayName": "Language",
  //         "SearchType": "Field",
  //         "AutoCompleteValues": [
  //           "DotNet",
  //           "Python",
  //           "Java",
  //           "Javascript",
  //           "Typescript"
  //         ]
  //       }
  //     }
  //   ]);

  //   response.subscribe(val => {
  //     this.response.push(val.Result);
  //     this.fieldList.Value = this.response.filter(r => r.SearchType == Action.Field).map<string>(r => r.DisplayName.toString());
  //     this.formSearch.get('myControl').setValue(''); // trigger the autocomplete to populate new values
  //   })

  // }

  // autocomplete material ui events
  // _filter(value: string): string[] {
  //   let optionListToBePopulated: string[] = this.getOptionList();
  //   this.displayFn(value);
  //   var searchText = this.getSearchText(value);
  //   return optionListToBePopulated.filter(option => option.toLowerCase().indexOf(searchText.toLowerCase().trim()) != -1);
  // }

  // displayFn(value: string): string {
  //   if (!!value)
  //   this.searchList.push(new SelectedOption(value, this.currentEvent, this.getNextEvent(this.currentEvent)));
  //   return this.searchList.length > 0 ? this.searchList.map(s => s.Value).join(' ') : '';
  // }

  // private functions
  // ------------- Get Autocomplete List START --------------------
  // private getOptionList(): string[] {
  //   if (this.searchList == null || this.searchList == undefined || this.searchList.length === 0) {
  //     this.currentEvent = this.defaultSelection;
  //     return this.field;
  //   }

  //   let lastElement: SelectedOption = <SelectedOption>this.searchList.slice(-1).pop();
  //   let currentList = this.selectionList.find(s => s.Name.toLowerCase() === lastElement.Next.toLowerCase());
  //   this.currentEvent = currentList ? currentList.Name : this.defaultSelection;
  //   return currentList ? this.getValues(currentList) : this.field;
  // }

  // private getValues(currentList: SelectionDict): string[] {
  //   if (this.currentEvent.toLowerCase() != 'value') return currentList.Value;
  //   var selectedField = this.getlastField();
  //   var selectedValue = selectedField ? selectedField.Value : ''
  //   var filteredResponse = this.response.find(r => r.DisplayName === selectedValue);
  //   return filteredResponse ? filteredResponse.AutoCompleteValues : [];
  // }
  // ------------- Get Autocomplete List END --------------------



  // --------------- START : Get the search text based on which the autocomplete will populate --------
  // private getSearchText(value: string): string {
  //   var oldText = this.searchList ? this.searchList.map(s => s.Value).join(' ') : '';
  //   this.handleBackspace(value);
  //   return value.trim().replace(oldText, '');
  // }

  // private handleBackspace(searchValue: string): void {
  //   var oldText = this.searchList ? this.searchList.map(s => s.Value).join(' ') : '';
  //   var previousListName = (this.searchList && this.searchList.length != 0) ? this.searchList[this.searchList.length - 1].PopulatedFrom : '';
  //   var prevList = this.selectionList.find(s => s.Name.toLowerCase() === previousListName.toLowerCase());
  //   var prevListValue = prevList ? prevList.Value : [];


  //   if (previousListName == Action.Value) {
  //     var lastField = this.getlastField();
  //     var lastFieldValue = lastField ? lastField.Value : '';
  //     var filteredResponse = this.response.find(r => r.DisplayName === lastFieldValue);
  //     prevListValue = filteredResponse ? filteredResponse.AutoCompleteValues : [];
  //   }

  //   if ((prevListValue ? prevListValue.indexOf(searchValue) === -1 : false) && oldText.trim().length > searchValue.trim().length)
  //     this.searchList.pop();
  // }

  // --------------- END : Get the search text based on which the autocomplete will populate --------

//   private getNextEvent(currentEvent: string): string {
//     var currentList = this.selectionList.find(s => s.Name.toLowerCase() === currentEvent.toLowerCase());
//     return currentList ? currentList.NextSelection : this.defaultSelection;
//   }

//   private getlastField(): SelectedOption | undefined {
//     if (this.searchList.length === 0) return undefined;
//     let i: number = this.searchList.length - 1;
//     for (i; i >= 0; i--) {
//       if (this.searchList[i].PopulatedFrom == Action.Field)
//         return this.searchList[i];
//     }
//     return undefined;
//   }
}

// class SelectedOption {
//   public Value: string;
//   public PopulatedFrom: string;
//   public Next: string;

//   constructor(value: string, populatedFrom: string, next: string) {
//     this.Value = value;
//     this.PopulatedFrom = populatedFrom;
//     this.Next = next;
//   }
// }

// class SuggestionDetails {
//   public Name: string;
//   public Valid: string[];
//   public Value: string[];
// }

// class SelectionDict {
//   public Name: string;
//   public Value: string[];
//   public NextSelection: string;
// }

// Server response
// class ApiResponse {
//   public DisplayName: string;
//   public SearchType: string;
//   public AutoCompleteValues: string[];
// }

// enum Action {
//   Field = 'Field',
//   Operator = 'Operator',
//   Value = 'Value',
//   Expression = 'Expression'
// }
