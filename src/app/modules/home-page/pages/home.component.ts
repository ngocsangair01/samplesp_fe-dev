import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { AppParamService } from '../../../core/services/app-param/app-param.service';
import { WarningManagerService } from '../../reports/warning-manager/warning-manager.service';
import { DashboardService } from '../service/dash-board-service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {
    listCard: any[] = [];
    userStorage: any;
    orgId: any;
    currentColor = [];
    listTotalCard: any[] = [];
    branchList: any[] = [];
    listWarning: any;
    branchCode: any;
    listIndex: any[] = [];
    constructor(
        private dashboardService: DashboardService,
        private warningManagerService: WarningManagerService,
        private appParamService: AppParamService,
        private router: Router
    ) {
        super();
        this.listTotalCard.push({
            resourceCode: 'resource.ctct_tcd_dashboard_dvctn',
            header: 'dashboard.partyMgmt.header.card.01',
            link: '/party-organization/party-member?UnofficalMember'
        });
        this.listTotalCard.push({
            resourceCode: 'resource.ctct_tcd_dashboard_dvhtgdb',
            header: 'dashboard.partyMgmt.header.card.02',
            link: '/transfer-activity-controller/pendingMember/1'
        });
        this.listTotalCard.push({
            resourceCode: 'resource.ctct_tcd_dashboard_dvtm',
            header: 'dashboard.partyMgmt.header.card.03',
            link: '/party-organization/party-member?TotalNewMember'
        });
        this.listTotalCard.push({
            header: 'dashboard.partyMgmt.header.card.06',
            resourceCode: 'resource.ctct_tcd_dashboard_tcdcnbc',
        });
        this.listTotalCard.push({
            header: 'dashboard.partyMgmt.header.card.04',
            resourceCode: 'resource.ctct_tcd_dashboard_tcdcrnq',
        });
        this.listTotalCard.push({
            header: 'dashboard.partyMgmt.header.card.05',
            resourceCode: 'resource.ctct_tcd_dashboard_tldv',
        });
        this.listTotalCard.push({
            header: 'dashboard.staffMgmt.header.card.01',
            resourceCode: 'resource.ctct_cb_dashboard_slcbtshsq',
            link: '/staff-manager-controller/list-curriculum-vitae/9'
        });
        this.listTotalCard.push({
            header: 'dashboard.staffMgmt.header.card.02',
            resourceCode: 'resource.ctct_cb_dashboard_sqqstd',
            link: '/staff-manager-controller/list-curriculum-vitae/10'
        });

        this.listTotalCard.push({
            header: 'dashboard.staffMgmt.header.card.03',
            resourceCode: 'resource.ctct_cb_dashboard_qncncshsq',
            link: '/staff-manager-controller/list-curriculum-vitae/10'
        });

        this.listTotalCard.push({
            header: 'dashboard.staffMgmt.header.card.04',
            resourceCode: 'resource.ctct_cb_dashboard_qncnqtpvtn',
            link: '/staff-manager-controller/list-curriculum-vitae/11'
        });

        this.listTotalCard.push({
            header: 'dashboard.staffMgmt.header.card.05',
            resourceCode: 'resource.ctct_cb_dashboard_qncnqtpvtn',
            link: '/staff-manager-controller/list-curriculum-vitae/12'
        });

        this.listTotalCard.push({
            header: 'dashboard.staffMgmt.header.card.06',
            resourceCode: 'resource.ctct_cb_dashboard_cbsqtqh',
            link: '/staff-manager-controller/list-curriculum-vitae/14'
        });
        this.listTotalCard.push({
            header: 'dashboard.staffMgmt.header.card.07',
            resourceCode: 'resource.ctct_cb_tb', // fake max quyeenf
            link: '/staff-manager-controller/list-curriculum-vitae/15'
        });
        this.listTotalCard.push({
            header: 'dashboard.staffMgmt.header.card.08',
            resourceCode: 'resource.ctct_cb_tb', // fake max quyeenf
            // link: '/staff-manager-controller/list-curriculum-vitae/15'
        });

        this.listTotalCard.push({
            header: 'dashboard.propaganda.header.card.01',
            resourceCode: 'resource.ctct_th_dashboard_ttcnkt', // fake max quyeenf
            link: '/propaganda/reward-info/home'
        });

        this.listTotalCard.push({
            header: 'dashboard.propaganda.header.card.02',
            resourceCode: 'resource.ctct_th_dashboard_ttcnkt', // fake max quyeenf
            link: '/propaganda/information-pay-suggest-manager/home'
        });

        this.listTotalCard.push({
            header: 'dashboard.mass.header.card.03',
            resourceCode: 'resource.ctct_ctqc_dashboard_tsdvtl',
            link: '/mass/member-mgmt/is-youngth-member/1'
        });

        this.listTotalCard.push({
            header: 'dashboard.mass.header.card.04',
            resourceCode: 'resource.ctct_ctqc_dashboard_tscdv',
            link: '/mass/member-mgmt/is-union-member/1'
        });

        this.listTotalCard.push({
            header: 'dashboard.mass.header.card.02',
            resourceCode: 'resource.ctct_ctqc_dashboard_hpncs',
            link: '/mass/org-mgmt/womanOrg/1'
        });

        this.listTotalCard.push({
            header: 'dashboard.mass.header.card.05',
            resourceCode: 'resource.ctct_ctqc_dashboard_cdvtc',
            link: '/mass/member-mgmt/is-union-member/1'
        });

        this.listTotalCard.push({
            header: 'dashboard.mass.header.card.01',
            resourceCode: 'resource.ctct_ctqc_dashboard_cdvtc',
            link: '/mass/member-mgmt/is-woman-member/1'
        });

        this.listTotalCard.push({
            header: 'dashboard.protectmgmt.header.card.06',
            resourceCode: 'resource.ctct_bvan_dashboard_vttyths',
            link: '/protect-security/curriculum-vitae-security/list-party-member/1'
        });

        this.listTotalCard.push({
            header: 'dashboard.protectmgmt.header.card.05',
            resourceCode: 'resource.ctct_bvan_dashboard_vttytdcd',
            link: '/protect-security/curriculum-vitae-security/list-party-member/3'
        });

        this.listTotalCard.push({
            header: 'dashboard.protectmgmt.header.card.04',
            resourceCode: 'resource.ctct_bvan_dashboard_vtty',
            link: '/protect-security/curriculum-vitae-security/list-party-member/2'
        });

        this.listTotalCard.push({
            header: 'dashboard.protectmgmt.header.card.03',
            resourceCode: 'resource.ctct_bvan_dashboard_tcct',
            link: '/protect-security/curriculum-vitae-security/list-party-member/4'
        });

        this.listTotalCard.push({
            header: 'dashboard.protectmgmt.header.card.02',
            resourceCode: 'resource.ctct_bvan_dashboard_nstgdatd',
            link: '/protect-security/project-member/list-project-member/6/1'
        });

        this.listTotalCard.push({
            header: 'dashboard.protectmgmt.header.card.01',
            resourceCode: 'resource.ctct_bvan_dashboard_datd',
            link: '/protect-security/project-member/list-project-member/5/1'
        });

        this.listTotalCard.push({
            header: 'dashboard.inspect.header.card.01',
            resourceCode: 'resource.ctct_ktgs_dashboard_dvvpkl',
            link: '/inspect/discipline-member/list-discipline-member/1'
        });

        this.listTotalCard.push({
            header: 'dashboard.mobilization.header.card.01',
            resourceCode: 'resource.ctct_dv_dashboard_dvtch',
            link: '/mass-mobilization/democratic-meeting/list-democratic-meeting/1'
        });

        this.listTotalCard.push({
            header: 'dashboard.mobilization.header.card.02',
            resourceCode: 'resource.ctct_dv_dashboard_nvtgth',
            link: '/mass-mobilization/democratic-meeting/list-democratic-meeting/1'
        });

    }


    ngOnInit() {
        this.getListCardFromVPS();
    }

    getListCardFromVPS() {
        const lstCardVPS = this.listTotalCard;
        this.listCard = []; // important: reset before insert to active ngOnChanges listener
        lstCardVPS.forEach((value, index) => {
            this.listCard.push({
                id: index,
                header: value.header,
                link: value.link ? value.link : null,
                colorIndex: Math.floor(Math.random() * 6)
            });



        });
        this.getStatistic();
        
        this.appParamService.getListBranchCode("BRANCH_CODE").subscribe(
            res => {
                this.branchList = res.data;
                let branchList = res.data;
                let index = 0;
                for (const item of branchList) {
                    let data = { parName: item.parName, parCode: item.parCode, index: index }
                    this.listIndex.push(data);
                    index++;
                }
                if (res.data && res.data.length > 0) {
                    this.getWarning(branchList[0].parCode)
                }
            }
        )
    }

    coverCode(item) {
        if (!item) {
            return item = "";
        }
        let itemString = item.split("_");
        if (item === "POLITICAL_BRANCH") {
            return "political"
        }
        if (itemString.length === 1) {
            return itemString[0].toLowerCase();
        } else {
            let string = "";
            for (let i = 0; i < itemString.length; i++) {
                if (i === 0) {
                    string += itemString[i].toLowerCase();
                } else {
                    let string1 = itemString[i].toLowerCase();
                    string += string1.charAt(0).toUpperCase() + string1.slice(1);
                }
            }
            return string;
        }
    }

    getStatistic() {
        if (this.listCard && this.listCard.length > 0) {
            this.listCard.forEach((value, index) => {
                if (value.header == 'dashboard.partyMgmt.header.card.01') {
                    this.dashboardService.getUnofficalMember().subscribe(res => {
                        value.content = res.data;
                    })
                }
                if (value.header == 'dashboard.partyMgmt.header.card.03') {
                    this.dashboardService.getTotalNewMember().subscribe(res => {
                        value.content = res.data;
                    });
                }
            });
        }
    }


    getListIndex() {
        let number = 0;
        while (number < 30) {
            let index = Math.floor(Math.random() * 6);
            this.currentColor.push(index)
            number++;
        }
    }

    containIndex(index) {
        let i = this.currentColor.length
        while (i--) {
            if (this.currentColor[i] == index) {
                return true;
            }
        }
        return false
    }

    /**
     * Lay cau hinh cac thuoc tinh
     */
    navigate(link: string) {
        this.router.navigate([link]);
    }

    handleChange(e) {
        const index = e.index;
        if (index === 1) {
            this.router.navigate(['/party-organization/party-congress-employee']);
        } else if (index === 2) {
            this.router.navigate(['/party-organization/question-and-answer']);
        }
    }

    getWarning(warningType: String) {
        this.warningManagerService.getWarning(warningType).subscribe(res => {
            if (res.data) {
                this.listWarning = res.data;
            } else {
                this.listWarning = [];
            }
        })

    }

    exportOrMoveUrl(warningType: number, warningManagerId: any, url: string, name: string) {
        var warningManagerForm = {
            id: warningManagerId
        };
        if (warningType != null) {
            if (warningType == 1) {
                this.warningManagerService.export(warningManagerForm)
                    .subscribe(res => {
                        saveAs(res, this.getNow() + "_" + name + ".xlsx");
                    });
            } else if (!CommonUtils.isNullOrEmpty(url)) {
                this.router.navigate([url]);
            }
        }
    }

    change(e) {
        setTimeout(() => {
            var result = document.getElementsByClassName("ui-tabview-selected");
            let idx = -1;
            if (result && result.length >= 0) {
                let elm = result[0].classList;
                if (elm) {
                    elm.forEach(x => {
                        if (x.includes("tab-index-")) {
                            let arr = x.split('-');
                            idx = parseInt(arr[2]);
                        }
                    })
                }
            }
            let data = this.listIndex.find(item => item.index == idx);
            if (data) {
                this.getWarning(data.parCode);
            } else {
                this.listWarning = [];
            }
        }, 100);
    }

    getNow() {
        var toDay = new Date();
        var getMonth = toDay.getMonth() + 1;
        var getDay = toDay.getDate();
        var year = toDay.getFullYear();
        return getDay + "/" + getMonth + "/" + year;
    }
}
