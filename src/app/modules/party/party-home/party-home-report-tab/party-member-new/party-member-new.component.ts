import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartyHomeService } from '@app/core/services/party-organization/party-home.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { APP_CONSTANTS } from '@app/core/app-config';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'party-member-new',
  templateUrl: './party-member-new.component.html',
  styleUrls: ['../../party-home.component.css']
})
export class PartyMemberNewComponent extends BaseComponent implements OnInit {
  monthType: FormControl;
  monthTypeList = APP_CONSTANTS.MONTH_TYPE_LIST
  resultList :  any = {};
  labelPrevious :  string = "Tháng trước";
  isIncrease : boolean = true;
  partyOrganizationId : number  = 0;
  constructor(
    private router: Router,
    private partyHomeService: PartyHomeService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyOrganizationHome"));
    this.setMainService(partyHomeService);
    this.monthType = new FormControl(1);
   }

  ngOnInit() {
    this.changePartyType();
  }

  /**
   * hàm lấy giá trị theo id đơn vị
   * @param partyOrganizationId 
   */
  public getPartyNewMemberByPartyOrgId(partyOrganizationId: number){
    this.partyOrganizationId = partyOrganizationId;
    const type = this.monthType.value;
    this.partyHomeService.getPartyNewMember({monthType: type, partyOrganizationId: this.partyOrganizationId}).subscribe(res => {
      this.resultList = res;
      this.isIncrease = this.resultList.isIncrease;
    })
  }

  /**
   * Đối loại Thang lấy số lượng
   */
  public changePartyType() {
    const type = this.monthType.value;
    if(type == 1){
      this.labelPrevious = "Tháng trước";
    } else {
      this.labelPrevious = "Tuần trước";
    }
    this.partyHomeService.getPartyNewMember({monthType: type, partyOrganizationId: this.partyOrganizationId}).subscribe(res => {
      this.resultList = res;
      this.isIncrease = this.resultList.isIncrease;
    })
  }
  
}
