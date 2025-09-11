import {Component, OnInit} from '@angular/core';
import {EmployeeResolver} from "@app/shared/services/employee.resolver";
import {HrStorage} from "@app/core/services/HrStorage";
import {OrganizationService, UserMenu} from "@app/core";
import {environment} from '@env/environment';
import {BackgroundService} from "@app/shared/services/background.service";
import {NotificationService} from "@app/core/services/notification/notification.service";
import {CommonUtils} from "@app/shared/services";
import {Router} from "@angular/router";
import {CurriculumVitaeService} from "@app/core/services/employee/curriculum-vitae.service";
import {AppComponent} from "@app/app.component";

@Component({
    selector: 'app-home=menu',
    templateUrl: './home-menu.component.html',
    styleUrls: ['./home-menu.component.css']
})
export class HomeMenuComponent implements OnInit {
    time: string = '';
    date: string = '';
    name: string = '';
    organizationName = '';
    mainPositionName = '';
    partyNumber: string = '';
    strPartyCongressTitle: string = '';
    email: string = '';
    public selectedBackground = 0;
    resultList = [];
    totalNotification = 0;
    public API_URL = environment.serverUrl['political'];
    userInfo: any;
    menuList: any[];
    // check menu tồn tại từ vps
    isCD: boolean = false;
    isTH: boolean = false;
    isCTQC: boolean = false;
    isDV: boolean = false;
    isBVAN: boolean = false;
    isCB: boolean = false;
    isKTGS: boolean = false;
    isTCD: boolean = false;
    isSHVB: boolean = false;

    constructor(
        private router: Router,
        private backgroundService: BackgroundService,
        private notificationService: NotificationService,
        private employee: EmployeeResolver,
        private organizationService : OrganizationService,
        private curriculumVitaeService: CurriculumVitaeService,
        private app: AppComponent
    ) {
        const userToken = HrStorage.getUserToken();
        this.menuList = userToken.userMenuList;
        this.menuList.forEach((item: UserMenu) => {
            if(item.code === 'CTCT_CD') {
                this.isCD = true;
            }
            if(item.code === 'CTCT_TCD') {
                this.isTCD = true;
            }
            if(item.code === 'CTCT_KTGS') {
                this.isKTGS = true;
            }
            if(item.code === 'CTCT_CB') {
                this.isCB = true;
            }
            if(item.code === 'CTCT_BVAN') {
                this.isBVAN = true;
            }
            if(item.code === 'CTCT_DV') {
                this.isDV = true;
            }
            if(item.code === 'CTCT_CTQC') {
                this.isCTQC = true;
            }
            if(item.code === 'CTCT_TH') {
                this.isTH = true;
            }
            if(item.code === 'CTCT_SHVB') {
                this.isSHVB = true;
            }
        })
    }

    ngOnInit() {
        setInterval(() => {
            this.time = this.getTime();
            this.date = this.getDate();
        })
        this.getUserInfo();
        let theme = HrStorage.getBackground() || 0;
        this.fSelectedBackground(theme);
        this.processSearch();
    }

    getTime() {
        let now: any = new Date();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();
        if (hour.toString().length === 1) {
            hour = '0' + hour;
        }
        if (minute.toString().length === 1) {
            minute = '0' + minute;
        }
        if (second.toString().length === 1) {
            second = '0' + second;
        }
        let time = hour + ':' + minute;
        return time;
    }

    getDate() {
        let now: any = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let date = now.getDate();
        let day = now.getDay();
        if (month.toString().length === 1) {
            month = '0' + month;
        }
        if (date.toString().length === 1) {
            date = '0' + date;
        }
        if (day === 0) {
            day = "Chủ nhật";
        } else {
            for (let i = 1; i <= 6; i++) {
                if (day === i) {
                    day = "Thứ " + (i + 1);
                }
            }
        }
        let dateTime = day + ', ' + ' ngày ' + date + ' tháng ' + month + ' năm ' + year;
        return dateTime;
    }

    getUserInfo() {
        const userToken = HrStorage.getUserToken();
        this.userInfo = userToken.userInfo;
        this.organizationService.findOneForHomeInfo().subscribe(res =>{
            this.organizationName = res.data.organizationName
            this.partyNumber = res.data.partyNumber
            this.strPartyCongressTitle = res.data.strPartyCongressTitle
            this.mainPositionName = res.data.mainPositionName
        })
        this.name = this.userInfo ? `${this.userInfo.employeeCode} - ${this.userInfo.fullName}` : '';
        this.email = userToken.email;
    }

    logout() {
        CommonUtils.logoutAction();
    }

    fSelectedBackground(value) {
        HrStorage.setBackground(value);
        this.selectedBackground = value;
        switch (value) {
            case 0:
                this.backgroundService.toggleDefaultBackground();
                break;
            case 1:
                this.backgroundService.toggleFirstBackground();
                break;
            case 2:
                this.backgroundService.toggleSecondBackground();
                break;
            case 3:
                this.backgroundService.toggleThirdBackground();
                break;
            case 4:
                this.backgroundService.toggleFourthBackground();
                break;
            case 5:
                this.backgroundService.toggleFifthBackground();
                break;
            case 6:
                this.backgroundService.toggleSixthBackground();
                break;
            case 7:
                this.backgroundService.toggleSeventhBackground();
                break;
            case 8:
                this.backgroundService.toggleEighthBackground();
                break;
            case 9:
                this.backgroundService.toggleNinethBackground();
                break;
            case 10:
                this.backgroundService.toggleTenthBackground();
                break;
            default:
                this.backgroundService.toggleDefaultBackground();
                break;
        }
    }

    processSearch() {
        this.notificationService.getHomeNotification().subscribe(
            res => {
                this.resultList = res.data;
                this.totalNotification = this.resultList.length;
            }
        );
    }

    navigate(code: string, path: string) {
        const userToken = HrStorage.getUserToken();
        const parentId = userToken.userMenuList.find((i: UserMenu) => !i.parentId && i.code === code);
        if(!parentId){
            this.app.warningMessage('', 'Bạn không có quyền với chức năng này!');
        }
        else {
            this.employee.MENU_ID.next(parentId.sysMenuId);
            this.router.navigate([path]);
        }

    }

    openNewTab() {
        window.open('https://ctdctct.sangnn.vn/', '_blank');
    }

    openAssessment() {
        this.router.navigate(["assessment"]);
    }

    openTabWebAi() {
        const user = HrStorage.getUserToken();
        window.open(`https://sohoa.sangnnai.vn/cas?redirect=true&ticket=${user.access_token}`, '_blank');
    }

}

export interface RouteConfig {
    path: string,
    children: [],
}