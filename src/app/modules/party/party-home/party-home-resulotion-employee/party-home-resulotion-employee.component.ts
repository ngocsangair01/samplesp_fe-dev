import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartyHomeService } from '@app/core/services/party-organization/party-home.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'party-home-resulotion-employee',
  templateUrl: './party-home-resulotion-employee.component.html',
  styleUrls: ['./party-home-resulotion-employee.component.css']
})
export class PartyHomeResulotionEmployeeComponent extends BaseComponent implements OnInit {
  resultList :  any = {};
  constructor(
    private router: Router,
    private partyHomeService: PartyHomeService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyOrganizationHome"));
    this.setMainService(partyHomeService);
   }

  ngOnInit() {
    this.processGetListResponseResolution();
  }

  processGetListResponseResolution(event?){
    this.partyHomeService.getListResponseResolution(event).subscribe(res =>{
      this.resultList = res;
    })
  }

  routerNavigateSign(item: any){
    if (item && item.signDocumentId > 0) {
      this.router.navigate([`/voffice-signing/resolution-month/${item.signDocumentId}`], {state: {backUrl: '/party-organization/home'}});
    }
  }

}
