import {Component, OnInit, ViewChildren} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {OrganizationService, OrgSelectorService} from '@app/core';
import {CommonUtils} from '@app/shared/services/common-utils.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TreeNode} from 'primeng/api';
import {CompetitionProgramService} from "@app/core/services/competition-program/competition-program.service";
import {AppComponent} from "@app/app.component";
import {saveAs} from "file-saver";
import {AllowanceService} from "@app/core/services/allowance/allowance.service";
import {EmpTypesService} from "@app/core/services/emp-type.service";
import {CryptoService} from "@app/shared/services";

@Component({
  selector: 'employee-selector-modal',
  templateUrl: './employee-selector-modal.component.html',
})
export class EmployeeSelectorModalComponent implements OnInit {
  nodes: TreeNode[];
  selectedNode: TreeNode;
  showOrgExpried = false;
  defaultFillter: string;
  resultList: any = [];
  form: FormGroup;
  params: any;
  isSingleClickNode = 0;
  checkFocus = 0; // focus vao code

  totalRecords: number;
  first: number = 0;

  subjectSeletionList: any;
  subjectTypeList: any;

  subjectSelected: any;
  isLongLeave: any = false;
  orgSelection: any;
  startTime: any;
  endTime: any;

  resultListTemp: any = [];

  isTimeError: boolean = false
  isApplicationError: boolean = false
  orgRequired: boolean = false
  fileRequired: boolean = false

  dataError: any;

  parseInt = parseInt;

  @ViewChildren('inputCodeSearch') inputCodeSearch;
  @ViewChildren('inputNameSearch') inputNameSearch;
  @ViewChildren('row') row;
  list = [];
  listOld = [];

  constructor(
      public activeModal: NgbActiveModal,
      private formBuilder: FormBuilder,
      private service: OrgSelectorService,
      private app: AppComponent,
      private orgService: OrganizationService,
      private competitionProgramService: CompetitionProgramService,
      private appComponent: AppComponent,
      private empTypesService: EmpTypesService,
      private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.buildForm();

    this.empTypesService.getListEmpType().subscribe(res => {
      this.subjectTypeList = res;
    })

    this.subjectSeletionList = [
      {
        code: true,
        value: 'Theo nhóm đối tượng'
      },
      {
        code: false,
        value: 'Theo danh sách import'
      }
    ];
    this.competitionProgramService.getAllEmpTypeSelection().subscribe(res => {
      this.subjectTypeList = res.data;
    })

    this.handlePreview();
    this.orgRequired = false;
    this.isApplicationError = false;
  }

  /**
   * set init value
   */
  setInitValue(params: { operationKey: '', adResourceKey: '', filterCondition: '', rootId: '', checkPermission: '', objectType: any }) {
    // debugger
    this.params = params;
    this.defaultFillter = this.params.filterCondition || '';
    if (params.objectType && params.objectType[0]) {
      this.subjectSelected = params.objectType[0].subjectSelectionType;
      this.isLongLeave = params.objectType[0].isLongLeave == 1 ? true : false;
      this.orgSelection = params.objectType[0].orgSelection;
      this.list = params.objectType
      this.listOld = Object.assign([], params.objectType[0].subjectSelectionType);
      this.resultListTemp = this.list;
      this.totalRecords = 0
    }
    if (params.objectType && params.objectType[0] && params.objectType[0].startTime && params.objectType[0].endTime) {
      this.startTime = params.objectType[0].startTime;
      this.endTime = params.objectType[0].endTime;
    }
    this.actionInitAjax();
  }

  /**
   * action init ajax
   */
  private actionInitAjax() {
    const filter = this.defaultFillter;
    this.params.filterCondition = CryptoService.encrAesEcb(filter);
    this.service.actionInitAjax(this.params)
        .subscribe((res) => {
          this.nodes = CommonUtils.toTreeNode(res);
        });
  }

  /**
   * actionLazyRead
   * @ param event
   */
  public actionLazyRead(event) {
    const params = this.params;
    params.nodeId = event.node.nodeId;
    this.service.actionLazyRead(params)
        .subscribe((res) => {
          event.node.children = CommonUtils.toTreeNode(res);
        });
    this.focusInputSearch();
  }

  /****************** CAC HAM COMMON DUNG CHUNG ****/

  /**
   * buildForm
   */
  private buildForm(): void {
    this.form = this.formBuilder.group({
      methodSelection: [''],
      applicableOrg: new FormArray([]),
      subjectSeletion: [''],
      isLongLeave: [false],
      subjectImported: [''],
      showOrgExpried: false
    });

    if (this.subjectSelected && this.subjectSelected.length > 0 && this.subjectSelected[0] != 'imported') {
      const convertSubjectCodeType = []
      for (let rec in this.subjectSelected){
        if(this.subjectSelected[rec] == 'HSQ/BS'){
          convertSubjectCodeType.push(481)
        }else if(this.subjectSelected[rec] == 'SQ'){
          convertSubjectCodeType.push(482)
        }else if(this.subjectSelected[rec] == 'SQDB'){
          convertSubjectCodeType.push(483)
        }else if(this.subjectSelected[rec] == 'CN'){
          convertSubjectCodeType.push(484)
        }else if(this.subjectSelected[rec] == 'CNVQP'){
          convertSubjectCodeType.push(485)
        }else if(this.subjectSelected[rec] == 'Hợp đồng') {
          convertSubjectCodeType.push(486)
        }
      }
      this.form.get('methodSelection').setValue(true)
      this.form.get('subjectSeletion').setValue(convertSubjectCodeType)
      this.form.get('isLongLeave').setValue(this.isLongLeave)
      this.form.setControl('applicableOrg', this.fb.array(this.orgSelection.map(item => item) || []))
    } else if (this.subjectSelected && this.subjectSelected[0] == 'imported') {  // truong hop import file
      this.form.get('methodSelection').setValue(false)
      this.handlePreview();
    } else {
      // set default value
      const convertSubjectCodeType = [481, 482, 483, 484, 485, 486]
      this.form.get('subjectSeletion').setValue(convertSubjectCodeType)
      this.form.get('methodSelection').setValue(true)
    }
  }

  /**
   * processSearch
   * @ param event
   */
  public processSearch(event) {
    this.resultList = []
    let first = event.first;
    let end;
    if (this.totalRecords - first < 10) {
      end = this.totalRecords
    } else {
      end = first + 10
    }
    for (let i = first, j = 0; i < end; i++, j++) {
      this.resultList[j] = this.resultListTemp[i]
    }
  }

  focusInputSearch() {
    setTimeout(() => {
      if (this.checkFocus === 0) {
        this.inputCodeSearch.first.nativeElement.focus();
      } else {
        this.inputNameSearch.first.nativeElement.focus();
      }
    }, 400);
  }

  close() {
    this.activeModal.close(this.listOld);
  }

  chooseAll(event) {
    this.list = [];
    if (event.currentTarget.checked) {
      this.list = this.resultList
    }
    this.resultList.forEach(e => {
      e.check = event.currentTarget.checked
    })
  }

  handleChoseSubjectType(event) {
    this.resultList = []
    this.resultListTemp = []
    this.isTimeError = false
    this.isApplicationError = false
    this.orgRequired = false
    this.fileRequired = false
    if (event && !this.form.get('subjectSeletion').value || this.form.get('subjectSeletion').value.length == 0) {
      const convertSubjectCodeType = [481, 482, 483, 484, 485, 486]
      this.form.get('subjectSeletion').setValue(convertSubjectCodeType)
    }
    if (event && !this.form.get('applicableOrg').value || this.form.get('applicableOrg').value.length == 0) {
      this.form.get('applicableOrg').setValue(new FormArray([]))
    }
    this.handlePreview()
  }

  get f() {
    return this.form.controls;
  }

  clearTable() {
    this.resultList = [];
    this.form.get('methodSelection').setValue('')
    this.form.get('subjectSeletion').setValue('')
    this.form.get('isLongLeave').setValue(false)
    this.form.get('subjectImported').setValue('')
    this.dataError = null
    this.form.controls['applicableOrg'] = new FormArray([]);
  }

  clodeModal() {
    this.activeModal.close();
  }

  applyListStaff() {
    let isInValid = false;
    if (this.form.get('methodSelection').value &&
        (!this.form.get('applicableOrg').value || this.form.get('applicableOrg').value.length == 0) ) {
      this.orgRequired = true;
      isInValid = true;
    }
    if (this.startTime == undefined || this.endTime == undefined) {
      this.isTimeError = true;
      isInValid = true;
    }

    if (this.resultListTemp == 0) {
      this.resultListTemp[0] = [{}];
    }
    if (this.form.get('methodSelection').value && this.form.get('subjectSeletion').value && this.form.get('subjectSeletion').value.length > 0) {
      const convertSubjectCodeType = []
      for (let rec in this.form.get('subjectSeletion').value){
        if(this.form.get('subjectSeletion').value[rec] == 481){
          convertSubjectCodeType.push('HSQ/BS')
        }else if(this.form.get('subjectSeletion').value[rec] == 482){
          convertSubjectCodeType.push('SQ')
        }else if(this.form.get('subjectSeletion').value[rec] == 483){
          convertSubjectCodeType.push('SQDB')
        }else if(this.form.get('subjectSeletion').value[rec] == 484){
          convertSubjectCodeType.push('CN')
        }else if(this.form.get('subjectSeletion').value[rec] == 485){
          convertSubjectCodeType.push('CNVQP')
        }else if(this.form.get('subjectSeletion').value[rec] == 486) {
          convertSubjectCodeType.push('Hợp đồng')
        }
      }
      this.resultListTemp[0]['subjectSelectionType'] = convertSubjectCodeType
      this.resultListTemp[0]['isLongLeave'] = this.form.get('isLongLeave').value
      this.resultListTemp[0]['orgSelection'] = this.form.get('applicableOrg').value
      this.resultListTemp[0]['startTime'] = this.startTime
      this.resultListTemp[0]['endTime'] = this.endTime
    } else if (!this.form.get('methodSelection').value && this.resultListTemp[0] && this.resultListTemp[0].objectId) {
      this.resultListTemp[0]['subjectSelectionType'] = ['imported']
    } else {
      this.isApplicationError = true;
      isInValid = true;
    }
    if (isInValid) return;

    this.activeModal.close(this.resultListTemp);
  }

  subjectSeletionChange(){
    this.isApplicationError = this.form.get('subjectSeletion').value.length == 0;
    this.handlePreview()
  }

  handlePreview(event?: any) {
    if(!event) {
      this.totalRecords = 0;
    }
    this.resultList = [];
    let isInvalid = false
    if (this.startTime == undefined || this.endTime == undefined) {
      this.isTimeError = true
      isInvalid = true
    }
    if (!this.form.get('subjectSeletion').value || this.form.get('subjectSeletion').value.length == 0) {
      this.isApplicationError = true
      isInvalid = true
    }
    if (!this.form.get('applicableOrg').value || this.form.get('applicableOrg').value.length == 0) {
      this.orgRequired = true;
      isInvalid = true
    }
    if (isInvalid) return;
    // if (this.form.get('methodSelection').value) { // case chon doi tuong

      let orgSelectionArr: string[] = this.form.get('applicableOrg').value;
      let subjectSelectionArr: string[] = this.form.get('subjectSeletion').value;
      if (subjectSelectionArr.length == 0) return;
      else {
        if (this.startTime == undefined || this.endTime == undefined) {
          this.isTimeError = true;
          return;
        }
        this.isApplicationError = false;
        this.isTimeError = false;

        let params = {
          'orgs': orgSelectionArr,
          'subjects': subjectSelectionArr,
          'is-long-leave': this.form.get('isLongLeave').value,
          'start-time': this.startTime,
          'end-time': this.endTime
        }
        this.competitionProgramService.getEmpByType(params, event)
            .subscribe(res => {
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].objectTypeName = 'Cá nhân'
              }
              this.resultList = [...this.resultList, ...res.data];
              this.resultList[0].startTime = this.startTime
              this.resultList[0].endTime = this.endTime
              this.resultListTemp = this.resultList;

              this.first = res.first;
              this.totalRecords = res.recordsFiltered;
            })
      }
    // }
    // else {  // case import
    //   this.resultList = []
    //   let first = event ? event.first : 0;
    //   let end;
    //   if (this.totalRecords - first < 10) {
    //     end = this.totalRecords
    //   } else {
    //     end = first + 10
    //   }
    //   for (let i = first, j = 0; i < end; i++, j++) {
    //     this.resultList[j] = this.resultListTemp[i]
    //   }
    //
    //   this.resultList[0].startTime = this.startTime
    //   this.resultList[0].endTime = this.endTime
    //   this.isApplicationError = false;
    // }

  }

  // readFile(event) {
  //   let file = event.target.files[0];
  //
  //   let fileReader = new FileReader();
  //   fileReader.readAsBinaryString(file);
  //
  //   fileReader.onload = (e) => {
  //     var workBook = XLSX.read(fileReader.result, {type: 'binary'});
  //     var sheetNames = workBook.SheetNames;
  //     var data = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]])
  //
  //     this.resultListTemp = [];
  //     for (let i = 0; i < data.length; i++) {
  //       let objectType = data[i]['Đối tượng'];
  //       if (objectType == 'Cá nhân') objectType = 'INDIVIDUAL';
  //       if (objectType == 'Tập thể') objectType = 'ORGANIZATION';
  //
  //       this.resultListTemp.push({
  //         index: data[i]['Stt'],
  //         objectType: objectType,
  //         objectTypeName: data[i]['Đối tượng'],
  //         organization: data[i]['Tên đơn vị'],
  //         employeeCode: data[i]['Mã nhân viên/ Mã đơn vị'],
  //         employeeName: data[i]['Tên'],
  //         phoneNumber: data[i]['Số điện thoại'],
  //         email: data[i]['Email'],
  //       })
  //     }
  //     this.totalRecords = data.length
  //     this.appComponent.successMessage('success', 'Import file thành công')
  //   }
  // }

  downloadTemplate() {
    this.competitionProgramService.downloadTemplate()
        .subscribe(res => {
          saveAs(res, "template_import_subject.xls")
        })
  }

  validateOrg() {
    this.handlePreview()
    if (!this.form.get('applicableOrg').value || this.form.get('applicableOrg').value.length == 0) {
      this.orgRequired = true;
    } else {
      this.orgRequired = false;
    }
  }

  processImport() {
    if (this.form.get('subjectImported') && this.form.get('subjectImported').value != '') {
      this.fileRequired = false
      const data = {
        fileImport: this.form.get('subjectImported').value
      }
      this.competitionProgramService.processImport(data).subscribe(res => {
        if (res.type == 'SUCCESS') {
          for (let i = 0; i < res.data.length; i++) {
            this.resultList[i] = res.data[i]
            this.resultList[i].startTime = this.startTime
            this.resultList[i].endTime = this.endTime
          }
          this.resultListTemp = this.resultList
          this.isApplicationError = false;
          this.dataError = null;
          this.applyListStaff();
        }
        else {
          this.dataError = res.data;
        }
      })
    } else {
      this.fileRequired = true
    }
  }

  sumStt(a: number, b: number) {
    a = Math.floor(a/10) + a%10;
    b = parseInt(String(b));
    return a + b;
  }

  sum(a: number, b: number) {
    a = parseInt(String(a));
    b = parseInt(String(b));
    return a + b;
  }
}
