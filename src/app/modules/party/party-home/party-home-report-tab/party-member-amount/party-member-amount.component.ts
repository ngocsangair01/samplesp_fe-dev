import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MEDIUM_MODAL_OPTIONS } from '@app/core';
import { PartyHomeService } from '@app/core/services/party-organization/party-home.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PartyVolatilitySearchFormComponent } from '../party-member-volatility/party-volatility-search-form/party-volatility-search-form.component';

@Component({
  selector: 'party-member-amount',
  templateUrl: './party-member-amount.component.html',
  styleUrls: ['../../party-home.component.css']
})
export class PartyMemberAmountComponent extends BaseComponent implements OnInit {
  data :  any = {};
  basicOptions  :  any = {};
  partyName : any = "Tất cả đơn vị"
  fileName: string ="Báo cáo số lượng Đảng viên";
  constructor(
    private router: Router,
    private partyHomeService: PartyHomeService,
    private modalService: NgbModal,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyOrganizationHome"));
    this.setMainService(partyHomeService);
   }

  ngOnInit() {
   this.initData();
   this.initOpttion();
  }

  /**
   * Thiết lập theme chart
   */
  private initOpttion = () => {
    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef'
          }
        },
        datalabels: {
          color: '#000000'
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          }
        },
        y: {
          ticks: {
            color: '#ebedef',
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          }
        },
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            },
            scaleLabel: {
              display: true,
              labelString: 'Số lượng đảng viên'
            }
          }
        ]
      }
    };
  }

  /**
   * Thiết lập dữ liệu
   */
  private initData = () => {
    this.getInfoPartyMemberAmount({periodType: 3, yearNumber: 5});
  }
  
  // mở popup tìm kiếm
  public actionOpenFormSearch = () => {
    const modalRef = this.modalService.open(PartyVolatilitySearchFormComponent, MEDIUM_MODAL_OPTIONS);
     // Thiết lập chọn nhiều đơn vị
     modalRef.componentInstance.setIsMultibleParty(true);
    // Thiết lập data tìm kiếm cho popup
    modalRef.componentInstance.buildFormConfigWithData(this.formSearch);
    // Xử lý action đóng
    modalRef.result.then((formSearch) => {
      // Nếu đóng hủy thì không làm gì
      if (!formSearch) {
        return;
      }
      // Còn tìm kiếm thì thực hiện tống hợp lại dữ liệu
      this.partyName = formSearch.partyName? formSearch.partyName: "Tất cả đơn vị";
      this.formSearch = formSearch;
      this.getInfoPartyMemberAmount(formSearch);
    });
  }

  /**
   * Hàm export báo cáo ố lượng
   */
  onReport() {
    if (this.formSearch['periodType']  == 1) {
      this.fileName = 'Báo cáo số lượng Đảng viên_Thang.xlsx'
    }else  if (this.formSearch['periodType']  == 2) {
      this.fileName = 'Báo cáo số lượng Đảng viên_Quy.xlsx'
    } else if (this.formSearch['periodType']  == 3) {
      this.fileName = 'Báo cáo số lượng Đảng viên_Nam.xlsx'
    }
    this.partyHomeService.exportPartyMemberAmount({...this.formSearch, partyName: this.partyName}).subscribe(res => {
      saveAs(res, this.fileName);
    });
  }

  /**
   * Hàm lấy thông tin form search
   * @param formSearch 
   */
  private getInfoPartyMemberAmount(formSearch) {
    this.formSearch = formSearch;
    this.partyHomeService.getPartyMemberAmount(formSearch).subscribe(res => {
      this.data = res;
    })
  };
}
