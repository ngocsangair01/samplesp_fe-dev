import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { GroupTabComponent } from './group-tab/group-tab.component';
import { IndividualTabComponent } from './individual-tab/individual-tab.component';
import { OrganizationTabComponent } from './organization-tab/organization-tab.component';

@Component({
  selector: 'transfer-auto-tab',
  templateUrl: './transfer-auto-tab.component.html',
  styleUrls: ['./transfer-auto-tab.component.css']
})
export class TransferAutoTabComponent implements OnInit {
  activeTab = 1;
  @Input()
  public disabled: boolean = false;
  @Input()
  private lstPromulgate: any[];
  @ViewChild('orgTab')
  orgTab: OrganizationTabComponent;
  @ViewChild('individualTab')
  individualTab: IndividualTabComponent;
  @ViewChild('groupTab')
  groupTab: GroupTabComponent;

  constructor(
    private cdr: ChangeDetectorRef
  ) { 
    
  }

  ngAfterViewChecked(){
    this.cdr.detectChanges();
  }

  /**
   * Lấy số lượng cá nhân đã chọn
   */
  get numberOfIndividual() {
    if(this.individualTab && this.individualTab.getLstData){
      return this.individualTab.getLstData.length;
    }
    return 0;
  }

  /**
   * Lấy số lượng đơn vị đã chọn
   */
  get numberOfOrg() {
    if(this.orgTab && this.orgTab.getLstData){
      return this.orgTab.getLstData.length;
    }
    return 0;
  }

  /**
   * Lấy số lượng nhóm đã chọn
   */
  get numberOfGroup() {
    if(this.groupTab && this.groupTab.getLstData){
      return this.groupTab.getLstData.length;
    }
    return 0;
  }

  ngOnInit() {
  }

  /**
   * Hàm lấy tất cả dữ liệu từ các tab
   */
  public getAllDataList() {
    const lstIndividual = this.individualTab.getLstData;
    const lstOrg = this.orgTab.getLstData;
    const lstGroup = this.groupTab.getLstData;
    return lstIndividual.concat(lstOrg, lstGroup);
  }
}
