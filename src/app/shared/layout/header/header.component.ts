import {
    AfterViewChecked,
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {HrStorage} from '@app/core/services/HrStorage';
import {CommonUtils} from '@app/shared/services/common-utils.service';
import {HelperService} from '@app/shared/services/helper.service';
import {ThemeService} from "@app/shared/services/theme.service";
import {environment} from '@env/environment';
import {HeaderNotificationComponent} from './header-notification/header-notification.component';
import {HelpComponent} from './help/help.component';
import {MenuItem} from "primeng/api";
import {EmployeeResolver} from "@app/shared/services/employee.resolver";
import {OrganizationService, UserMenu, UserToken} from "@app/core";
import {filter, skip, take} from "rxjs/operators";
import {Router} from "@angular/router";
import {NotificationService} from "@app/core/services/notification/notification.service";
import * as url from "url";
import {any} from "codelyzer/util/function";
import {combineLatest} from "rxjs";
import {CurriculumVitaeService} from "@app/core/services/employee/curriculum-vitae.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnChanges, AfterViewChecked {
    public selectedTheme = 0;
    public isMinium: boolean;
    public isBack: boolean;
    public userInfo: any;
    public API_URL = environment.serverUrl['political'];
    private userToken: UserToken;
    vpsItems: UserMenu[] = [];
    subVpsItems: UserMenu[] = [];
    userMenuByParent: UserMenu[];
    isShowLogoTitle: boolean = true;
    isDisplayPopup: boolean = false;
    name: string = '';
    email: string = '';
    organizationName = '';
    mainPositionName = '';
    partyNumber: string = '';
    strPartyCongressTitle: string = '';
    resultList = [];
    totalNotification = 0;
    isMenuMobile: boolean = false;
    @ViewChild('headerNotification')
    headerNotificationComponent: HeaderNotificationComponent;

    @ViewChild('helpView') helpView: HelpComponent;

    @Input() currentUrl: string = '';

    constructor(private themeService: ThemeService,
                public helperService: HelperService,
                private employee: EmployeeResolver,
                private router: Router,
                private notificationService: NotificationService,
                private organizationService : OrganizationService,
                private curriculumVitaeService: CurriculumVitaeService,
    ) {
        this.isMinium = HrStorage.getNavState();
        this.navViewChange.emit(this.isMinium);
        const userToken = HrStorage.getUserToken();
        this.name = `${userToken.userInfo.employeeCode} - ${userToken.userInfo.fullName}`;
        this.email = userToken.email;
        this.userInfo = userToken ? userToken.userInfo : {};
        this.organizationService.findOneForHomeInfo().subscribe(res =>{
            this.organizationName = res.data.organizationName
            this.partyNumber = res.data.partyNumber
            this.strPartyCongressTitle = res.data.strPartyCongressTitle
            this.mainPositionName = res.data.mainPositionName
        })
    }

    @Output()
    public navViewChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output()
    public navFlipChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    ngOnInit(): void {

        let theme = HrStorage.getTheme() || HrStorage.getTheme() == 0 ? HrStorage.getTheme() : 1;
        this.fSelectedTheme(theme);
        this.flipMenus();
        this.helperService.HEADER_NOTIFICATION.subscribe(data => {
            if (data === 'complete') {
                this.headerNotificationComponent.actionInitAjax();
            }
        });
        this.buildVpsMenus();
        this.processSearch();
        this.isMenuMobile = window.innerWidth >= 375 && window.innerWidth < 540;
    }

    ngAfterViewChecked() {
        this.isMenuMobile = window.innerWidth >= 375 && window.innerWidth < 540;
    }
    /**
     * build vps menu
     */
    buildVpsMenus() {
        this.userToken = HrStorage.getUserToken();
        if (this.userToken == null) {
            this.vpsItems = this.convertVpsMenus(null);
            return null;
        }
        this.convertVpsMenus(this.userToken.userMenuList);
    }

    /**
     * convert vpsMenu => menuItem
     */
    convertVpsMenus(userMenuList): UserMenu[] {
        if (!userMenuList || userMenuList.length === 0) {
            return null;
        }

        for (const item of userMenuList) {
            item.label = item.name;
            item.routerLink = item.url;
        }
        const headerMenu = this.employee.HEADER_MENU;
        const selectedOldItem = this.employee.SYS_MENU_ID;

        combineLatest([headerMenu, selectedOldItem]).pipe().subscribe(([val, oItem]) => {
            if (oItem && oItem.url) this.router.navigate([oItem.url]);
            if (val && val.length && !oItem) this.router.navigate([val[0].url]);
            this.vpsItems = val;
            (this.vpsItems && this.vpsItems.length) ? this.isShowLogoTitle = false : this.isShowLogoTitle = true;
            if (this.vpsItems && this.vpsItems.length > 4){
                this.subVpsItems = this.vpsItems.slice(4);
            }else{
                this.subVpsItems = []
            }
        })
    }

    onMinium() {
        this.isMinium = !this.isMinium;
        this.navViewChange.emit(this.isMinium);
        HrStorage.setNavState(this.isMinium);
    }

    flipMenus() {
        this.isBack = !this.isBack;
        this.navFlipChange.emit(this.isBack);
        HrStorage.setNavFlipState(this.isBack);
    }

    logout() {
        CommonUtils.logoutAction();
    }

    fSelectedTheme(value) {
        HrStorage.setTheme(value);
        this.selectedTheme = value;
        switch (value) {
            case 0:
                this.themeService.toggleDefaultTheme();
                break;
            case 1:
                this.themeService.toggleBlueViolet();
                break;
            case 2:
                this.themeService.toggleLightGreen();
                break;
            case 3:
                this.themeService.toggleGreen();
                break;
            case 4:
                this.themeService.toggleBlueSky();
                break;
            default:
                this.themeService.toggleBlueViolet();
                break;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.helpView.onChangeMenu(this.currentUrl);
    }

    processSearch() {
        this.notificationService.getHomeNotification().subscribe(
            res => {
                this.resultList = res.data;
                this.totalNotification = this.resultList.length;
            }
        );
    }

    navigateMenu(userMenu: UserMenu[], item: any) {

        if (userMenu && userMenu.length) userMenu.forEach((i: any) => {
            (item.sysMenuId === i.sysMenuId) ? i.isActive = true : i.isActive = false;
        })
        if (item.url) this.router.navigate([item.url]);
    }


    onHover(userMenu: any) {
        if (userMenu.sysMenuId)
            this.userMenuByParent = this.userToken.userMenuList.filter((item: UserMenu) => userMenu.sysMenuId === item.parentId);
    }

    @HostListener('mouseleave')
    onHoverLeave() {
        this.userMenuByParent = [];
    }

    navigate(event) {
        if (event.value.url) this.router.navigate([event.value.url]);
    }
}
