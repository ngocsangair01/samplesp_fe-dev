import { Component, Input, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataPickerService } from '@app/core';
import { CommonUtils, CryptoService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'multi-data-picker-modal',
  templateUrl: './multi-data-picker-modal.component.html',
})
export class MultiDataPickerModalComponent {
  
  @Input()
  params: any;
  form: FormGroup;
  resultList: any = {};
  l10nCodeField: string;
  l10nNameField: string;
  titleChose: string;
  placeholder: string;
  fnSearch;
  list = [];
  listOld = [];
  @ViewChildren('row') row;
  @ViewChildren('inputSearch') inputSearch;
  constructor(
    private service: DataPickerService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal) {
    this.buildForm();
  }


  /**
   * set init value
   */
  setInitValue(params: {
    operationKey: ''
    , adResourceKey: ''
    , filterCondition: ''
    , objectBO: ''
    , codeField: ''
    , nameField: ''
    , emailField: ''
    , orderField: ''
    , selectField: ''
    , nameData: ''
    , systemCode: ''
    , isSearchByPartyDomainData: ''
    , isNotSearchByOrgDomainData: ''
    , list: ''
  }) {
    this.params = params;
    this.params.filterCondition = CryptoService.encrAesEcb(this.params.filterCondition);
    if (params.list) {
      this.list = Object.assign([], params.list);
      this.listOld = Object.assign([], params.list);
    }
    this.titleChose = params.objectBO + '.dataPickerTitle' + (params.nameData ? '.' + params.nameData : '');
    this.placeholder = params.objectBO + '.dataPickerPlaceholder' + (params.nameData ? '.' + params.nameData : '');
    this.l10nCodeField = params.objectBO + '.' + params.codeField + (params.nameData ? '.' + params.nameData : '');
    this.l10nNameField = params.objectBO + '.' + params.nameField + (params.nameData ? '.' + params.nameData : '');
    if (params.systemCode) {
      this.service.setSystemCode(params.systemCode);
    } else {
      this.service.setSystemCode('political');
    }
    this.processSearch(null);
  }

  /**
   * buildForm
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      codeInput: [''],
    });

    this.form.get('codeInput').valueChanges.subscribe(value => {
      this.processSearchTimeout();
    });
  }

  /**
   * processSearch
   * @ param event
   */
  processSearch(event) {
    if (CommonUtils.isValidForm(this.form)) {
      const paramsSearch = this.form.value;
      Object.keys(this.params).forEach(key => {
        paramsSearch[key] = this.params[key] || '';
      });
      this.service.search(paramsSearch, event).subscribe(res => {
        this.resultList = res;
        for (let data of this.resultList.data) {
          for (let objSelect of this.list) {
            if (data.selectField === objSelect.selectField) {
              data.check = true;
            }
          }
        }
      });
    }
  }

  processSearchTimeout() {
    if (this.fnSearch) {
      clearTimeout(this.fnSearch);
    }
    this.fnSearch = setTimeout(() => {
      const paramsSearch = this.form.value;
      Object.keys(this.params).forEach(key => {
        paramsSearch[key] = this.params[key] || '';
      });
      this.service.search(paramsSearch).subscribe(res => {
        this.resultList = res;
        let resultListData = []
        for (let data of res.data) {
          var obj = Object.assign({}, data);
          for (let objSelect of this.list) {
            if (data.selectField === objSelect.selectField) {
              obj.check = true;
            }
          }
          resultListData.push(obj);
        }
        this.resultList.data = resultListData;
      });
    }, 1000);
  }

  /**
   * @ param item
   */
  change(event, item) {
    if (event.currentTarget.checked) {
      this.list.push(item);
    } else {
      let index = this.list.findIndex(x => x.selectField === item.selectField);
      this.list.splice(index, 1);
    }
  }

  chose() {
    this.activeModal.close(this.list);
  }

  changeIndex(index) { // tính index của element đang focus
    let currentIndex = -1; // chưa có item nào được focus
    for (let i = 0; i < this.row._results.length; i++) {
      const item = this.row._results[i];
      if (item.nativeElement.classList.contains('datapickerSelected')) {
        item.nativeElement.classList.remove('datapickerSelected');
        currentIndex = i;
        break;
      }
    }
    let nextIndex = currentIndex += index;
    nextIndex = (nextIndex <= 0) ? 0 : (nextIndex >= this.row._results.length ? this.row._results.length - 1 : nextIndex);
    this.row._results[nextIndex].nativeElement.classList.add('datapickerSelected');
  }

  onSelectEnter() {
    for (const item of this.row._results) {
      if (item.nativeElement.className.includes('datapickerSelected')) {
        item.nativeElement.firstElementChild.firstElementChild.click();
        this.inputSearch.first.nativeElement.focus();
        return;
      }
    }
    this.processSearch(null);
  }

  close() {
    this.activeModal.close(this.listOld);
  }

}
