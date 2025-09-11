import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { PartyHomeService } from '@app/core/services/party-organization/party-home.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { APP_CONSTANTS, MEDIUM_MODAL_OPTIONS } from '@app/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PartyCriteriaModalComponent } from '../party-member-contract/party-criteria-modal/party-criteria-modal.component';
import { formatDate } from '@angular/common';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'party-member-structure',
  templateUrl: './party-member-structure.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../party-home.component.css']
})
export class PartyMemberStructureComponent extends BaseComponent implements OnInit {
  structureTypeList = APP_CONSTANTS.STRUCTURE_TYPE_LIST
  dataStructure : any = {};
  basicOptions  :  any = {};
  title : string = "Cơ cấu Đảng viên theo độ tuổi";
  fileName : string = "BaoCaoCoCauDangVien";
  partyName : string = "Tất cả đơn vị"
  myDate: string ="";
  formSearch : any = null
  currentDate = new Date();
  DEFAULT_NUMBER_DISPLAY = 8;
  isHaveData: boolean = true;
  @ViewChild("chartPie")
  chartPie: UIChart;
  innerHTMLLegend: SafeHtml = "";
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
    // Nạp dữ liệu
    this.setDataStructure();   
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
           color: '#000000'
         }
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

  private setDataStructure(formSearch?: any) {
    let formValue = {};
    if(formSearch == null){
      formValue = {structureType: 1, displayValue: this.DEFAULT_NUMBER_DISPLAY}
    } else {
      formValue = {...formSearch, structureType: formSearch.type}
      this.currentDate = this.formSearch['dateTo'];
    }
    this.formSearch = formValue;
    if (formValue['structureType']  == 1) {
      this.title = "Cơ cấu Đảng viên theo độ tuổi";
    } else if (formValue['structureType']  == 2) {
      this.title = "Cơ cấu Đảng viên theo tuổi Đảng";
    } else if (formValue['structureType']  == 3) {
      this.title = "Cơ cấu Đảng viên theo chuyên ngành đào tạo";
    } else if (formValue['structureType']  == 4) {
      this.title = "Cơ cấu Đảng viên theo trình độ đào tạo";
    } else if (formValue['structureType']  == 5) {
      this.title = "Cơ cấu Đảng viên theo giới tính";
    } else if (formValue['structureType']  == 6) {
      this.title = "Cơ cấu Đảng viên theo dân tộc";
    } else if (formValue['structureType']  == 7) {
      this.title = "Cơ cấu Đảng viên theo quốc tịch";
    } else if (formValue['structureType']  == 8) {
      this.title = "Cơ cấu Đảng viên theo tôn giáo";
    }else if (formValue['structureType']  == 9) {
      this.title = "Cơ cấu Đảng viên theo tình trạng hôn nhân";
    }
    this.myDate = "- Đến ngày " + formatDate(this.currentDate, 'dd/MM/yyyy', 'en-US');
    this.partyHomeService.getInfoPartyMemberStructure(formValue).subscribe(res => {
      this.dataStructure = res;
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
    modalRef.componentInstance.setListType(this.structureTypeList);
    // Xử lý action đóng
    modalRef.result.then((formSearch) => {
      // Nếu đóng hủy thì không làm gì
      if (!formSearch) {
        return;
      }
      // Còn tìm kiếm thì thực hiện tống hợp lại dữ liệu
      this.partyName = formSearch.partyName? formSearch.partyName: "Tất cả đơn vị";
      this.formSearch = formSearch;
      this.setDataStructure(formSearch);
    });
  }
  public onReport() {
    if (this.formSearch['structureType']  == 1) {
      this.fileName = 'Bao_cao_co_cau_dang_vien_theo_do_tuoi.xlsx'
    }else  if (this.formSearch['structureType']  == 2) {
      this.fileName = 'Bao_cao_co_cau_dang_vien_theo_tuoi_dang.xlsx'
    } else if (this.formSearch['structureType']  == 3) {
      this.fileName = 'Bao_cao_co_cau_dang_vien_theo_chuyen_nganh_dao_tao.xlsx'
    } else if (this.formSearch['structureType']  == 4) {
      this.fileName = 'Bao_cao_co_cau_dang_vien_theo_trinh_do_dao_tao.xlsx'
    } else if (this.formSearch['structureType']  == 5) {
      this.fileName = 'Bao_cao_co_cau_dang_vien_theo_gioi_tinh.xlsx'
    } else if (this.formSearch['structureType']  == 6) {
      this.fileName = 'Bao_cao_co_cau_dang_vien_theo_dan_toc.xlsx'
    } else if (this.formSearch['structureType']  == 7) {
      this.fileName = 'Bao_cao_co_cau_dang_vien_theo_quoc_tich.xlsx'
    } else if (this.formSearch['structureType']  == 8) {
      this.fileName = 'Bao_cao_co_cau_dang_vien_theo_ton_giao.xlsx'
    }else if (this.formSearch['structureType']  == 9) {
      this.fileName = 'Bao_cao_co_cau_dang_vien_theo_tinh_trang_hon_nhan.xlsx'
    }
      
    this.partyHomeService.exportPartyMemberStructure({...this.formSearch, partyName: this.partyName}).subscribe(res => {
      saveAs(res,this.fileName);
    });
  }
}
