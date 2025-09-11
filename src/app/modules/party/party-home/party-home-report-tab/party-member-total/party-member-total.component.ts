import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartyHomeService } from '@app/core/services/party-organization/party-home.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { APP_CONSTANTS } from '@app/core/app-config';
import { FormControl } from '@angular/forms';
import { PartyHomeIndexComponent } from '../../party-home-index/party-home-index.component';

@Component({
  selector: 'party-member-total',
  templateUrl: './party-member-total.component.html',
  styleUrls: ['../../party-home.component.css']
})
export class PartyMemberTotalComponent extends BaseComponent implements OnInit {
  partyMemberType: FormControl;
  partyMemberTotal: number;
  partyMemberTypeList = APP_CONSTANTS.PARTY_MEMBER_TYPE_LIST
  formSearch: any = {};
  data :  any = {};
  partyOrganizationId : number = 0;
  constructor(
    private router: Router,
    private partyHomeService: PartyHomeService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyOrganizationHome"));
    this.setMainService(partyHomeService);
    this.partyMemberType = new FormControl(1);
   }

  ngOnInit() {
    this.getPartyMemberTotal();
  }

  /**
   * Lấy tổng số lượng Đảng viên
   * @param partyOrganizationId 
   */
  public getPartyMemberTotal(partyOrganizationId?: number) {
    this.partyOrganizationId = partyOrganizationId? partyOrganizationId: 0;
    const type = this.partyMemberType.value;
    this.partyHomeService.getPartyMemberTotal({partyMemberType: type, partyOrganizationId: this.partyOrganizationId}).subscribe(res => {
      this.partyMemberTotal = res;
    })
  }

  /**
   * Đối loại Đảng viên lấy số lượng
   */
  public changePartyType() {
    const type = this.partyMemberType.value;
    this.partyHomeService.getPartyMemberTotal({partyMemberType: type, partyOrganizationId: this.partyOrganizationId}).subscribe(res => {
      this.partyMemberTotal = res;
    })
  }

}
