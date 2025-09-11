import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { PartyHomeService } from '@app/core/services/party-organization/party-home.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { APP_CONSTANTS, MEDIUM_MODAL_OPTIONS } from '@app/core/app-config';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PartyCriteriaModalComponent } from './party-criteria-modal/party-criteria-modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'party-member-contract',
  templateUrl: './party-member-contract.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../party-home.component.css']
})
export class PartyMemberContractComponent extends BaseComponent implements OnInit {
  empTypeList = APP_CONSTANTS.EMP_TYPE_LIST
  data :  any = {};
  basicOptions  :  any = {};
  title : string = "Thống kê đảng viên theo diện đối tượng";
  partyName : string = "Tất cả đơn vị"
  formSearch : any = {};
  dateTo : Date = new Date;
  DEFAULT_NUMBER_DISPLAY = 8;
  isHaveData: boolean = true;
  @ViewChild("chartPie")
  chartPie: UIChart;
  innerHTMLLegend: SafeHtml = "";
  fileName: string;
  constructor(
    private router: Router,
    private partyHomeService: PartyHomeService,
    private modalService: NgbModal,
    private sanitized: DomSanitizer
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyOrganizationHome"));
    this.setMainService(partyHomeService);
   }

  ngOnInit() {
   this.initOpttion();
   // Nạp dữ liệu lần đầu
   this.formSearch = {displayValue: this.DEFAULT_NUMBER_DISPLAY};
   this.partyHomeService.getInfoPartyMemberContract(this.formSearch).subscribe(res => {
      this.setDataContract();
   })
   //
  }

  /**
   * Thiết lập theme chart
   */
  private initOpttion = () => {
    this.basicOptions = {
      legend: {
        display: false
      },
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        },
        datalabels: {
          color: '#000000',
        },
      },
      tooltips: {
        enabled: true,
        mode: 'single',
        callbacks: {
          label: function(tooltipItem, data) {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipLabel = data.labels[tooltipItem.index];
            const totalValue = allData.reduce((sum, current) => sum + current, 0);
            const tooltipData = allData[tooltipItem.index];
            return `${tooltipLabel}: ${tooltipData}  (${(tooltipData/totalValue*100).toFixed(2)} %)`;
          }
        }
      }
    };
  }

  /**
  * Hàm lấy dữ liệu thống kê hợp đồng
  */
  private setDataContract(formSearch?: any) {
    // hởi tạo form
    let formValue = {};
    if(formSearch == null){
      formValue = {empType: 1}
    } else {
      formValue = formSearch
    }
    if(formValue['empType'] == 1){
      this.title = "Thống kê đảng viên theo diện đối tượng";
    } else if(formValue['empType'] == 2){
      this.title = "Thống kê đảng viên theo cấp bậc";
    } else {
      this.title = "Thống kê đảng viên theo loại hợp đồng";
    }
    // lấy dữ liệu
    this.partyHomeService.getInfoPartyMemberContract(formValue).subscribe(res => {
      this.data = res;
      if(res.labels && res.labels.length > 0){
        this.isHaveData = true;
      } else {
        this.isHaveData = false;
      }
      setTimeout(() => {
        this.innerHTMLLegend = this.sanitized.bypassSecurityTrustHtml(this.chartPie.generateLegend());
      }, 500)
   })
  }

   // mở popup tìm kiếm
   public actionOpenFormSearch = () => {
    const modalRef = this.modalService.open(PartyCriteriaModalComponent, MEDIUM_MODAL_OPTIONS);
    // Thiết lập data tìm kiếm cho popup
    modalRef.componentInstance.buildFormConfigWithData(this.formSearch);
    // Thiết lập danh sách listType
    modalRef.componentInstance.setListType(this.empTypeList);
    // Xử lý action đóng
    modalRef.result.then((formSearch) => {
      // Nếu đóng hủy thì không làm gì
      if (!formSearch) {
        return;
      }
      // Còn tìm kiếm thì thực hiện tống hợp lại dữ liệu
      this.partyName = formSearch.partyName? formSearch.partyName: "Tất cả đơn vị";
      this.dateTo = formSearch.dateTo;
      this.formSearch = {...formSearch, empType: formSearch.type};
      this.setDataContract(this.formSearch);
    });
  }

  /**
   * Action xuất báo cáo co cau dien doi tuong
   * @param item 
  */
  onReport() {
    if (this.formSearch['empType']  == 2) {
      this.fileName = 'Phân tích cơ cấu đảng viên theo cấp bậc.xlsx'
    } else if (this.formSearch['empType']  == 3) {
      this.fileName = 'Phân tích cơ cấu đảng viên theo loại hợp đồng.xlsx'
    }else{
      this.fileName = 'Phân tích cơ cấu đảng viên theo đối tượng.xlsx'
    }
    this.partyHomeService.exportPartyMemberEmpType({...this.formSearch, partyName: this.partyName}).subscribe(res => {
      saveAs(res, this.fileName);
    });
  }
  
}
