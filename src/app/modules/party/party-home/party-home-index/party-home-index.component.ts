import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PartyMemberDecreaseComponent } from '../party-home-report-tab/party-member-decrease/party-member-decrease.component';
import { PartyMemberIncreaseComponent } from '../party-home-report-tab/party-member-increase/party-member-increase.component';
import { PartyMemberNewComponent } from '../party-home-report-tab/party-member-new/party-member-new.component';
import { PartyMemberTotalComponent } from '../party-home-report-tab/party-member-total/party-member-total.component';

@Component({
  selector: 'party-home-index',
  templateUrl: './party-home-index.component.html',
  styleUrls: ['./party-home-index.component.css']
})
export class PartyHomeIndexComponent implements OnInit {
  activeTab = 1;
  partyOrganizationId: FormControl = new FormControl();
  @ViewChild('partyMemberNew')
  partyMemberNew: PartyMemberNewComponent;
  @ViewChild('partyMemberTotal')
  partyMemberTotal: PartyMemberTotalComponent;
  @ViewChild('partyMemberIncrease')
  partyMemberIncrease: PartyMemberIncreaseComponent;
  @ViewChild('partyMemberDecrease')
  partyMemberDecrease: PartyMemberDecreaseComponent;
  constructor(
    private router: Router,
  ) { 
    const { state } = this.router.getCurrentNavigation().extras;
    if (state && state.activetTab) {
      this.activeTab = state.activetTab;
    }
  }

  ngOnInit() {
  }

  /**
   * Hàm tìm kiếm dữ liệu theo đơn vị cho 4 vùng hiển thị đầu
   * @param item 
   */
  onChangePartyOrganization(item: any){
    const partyOrganizationId = item.partyOrganizationId ? item.partyOrganizationId: 0
    // Tổng số đảng viên
    this.partyMemberTotal.partyOrganizationId = partyOrganizationId.value;
    this.partyMemberTotal.getPartyMemberTotal(partyOrganizationId);
    // số lượng đảng viên mới
    this.partyMemberNew.getPartyNewMemberByPartyOrgId(partyOrganizationId);
    // SỐ lượng đảng viên tăng
    this.partyMemberIncrease.getPartyIncreaseMember(partyOrganizationId);
    // Số lượng Đảng viên giảm
    this.partyMemberDecrease.getPartyDecreaseMember(partyOrganizationId);
  }

}
