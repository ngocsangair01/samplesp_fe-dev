import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MEDIUM_MODAL_OPTIONS } from '@app/core';
import { PartyHomeService } from '@app/core/services/party-organization/party-home.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PartyVolatilitySearchFormComponent } from './party-volatility-search-form/party-volatility-search-form.component';

@Component({
  selector: 'party-member-volatility',
  templateUrl: './party-member-volatility.component.html',
  styleUrls: ['../../party-home.component.css']
})
export class PartyMemberVolatilityComponent extends BaseComponent implements OnInit {
  partyName: string = "Tất cả đơn vị";
  formSearch: any = {};
  data :  any = {};
  fileName: string ="Báo cáo biến động đảng viên";
  basicOptions  :  any = {};
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
            color: '#495057'
          }
        },
        datalabels: {
          color: '#000000'
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
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
    this.getInfoPartyMemberVolatility({periodType: 3, yearNumber: 3});
  }

  // mở popup tìm kiếm
  public actionOpenFormSearch = () => {
    const modalRef = this.modalService.open(PartyVolatilitySearchFormComponent, MEDIUM_MODAL_OPTIONS);
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
      this.getInfoPartyMemberVolatility(formSearch);
    });
  }

  /**
   * Action xuất báo cáo biến động nhân viên
   * @param item 
   */
  onReport() {
    if (this.formSearch['periodType']  == 1) {
      this.fileName = 'Báo cáo biến động đảng viên_Thang.xlsx'
    }else  if (this.formSearch['periodType']  == 2) {
      this.fileName = 'Báo cáo biến động đảng viên_Quy.xlsx'
    } else if (this.formSearch['periodType']  == 3) {
      this.fileName = 'Báo cáo biến động đảng viên_Nam.xlsx'
    }
    this.partyHomeService.exportPartyMemberVolatility({...this.formSearch, partyName: this.partyName}).subscribe(res => {
      saveAs(res, this.fileName);
    });
  }

  /**
   * Hàm lấy dữ liệu biến động
   * @param formSearch 
   */
  public getInfoPartyMemberVolatility(formSearch: any) {
    this.formSearch = formSearch;
    this.partyHomeService.getInfoPartyMemberVolatility(formSearch).subscribe(res => {
      this.data = res;
    })
  }

}
