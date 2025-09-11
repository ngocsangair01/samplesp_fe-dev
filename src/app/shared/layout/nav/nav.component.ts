import {ICON_MENU} from './../../../core/app-config';
import {
    AfterViewChecked,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {environment} from '@env/environment';
import {FormGroup} from '@angular/forms';
import {HrStorage} from '@app/core/services/HrStorage';
import {TranslationService} from 'angular-l10n';
import {EmployeeResolver} from "@app/shared/services/employee.resolver";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {UserMenu} from "@app/core";
import {take} from "rxjs/operators";

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, AfterViewChecked {
    version = environment.version;
    isBack = false;
    isShowSearch = false;
    isSearching = false;
    items: MenuItem[];
    vpsItems: MenuItem[];
    formSearch: FormGroup;
    isExtendMenu: boolean = false;
    isHiddenMenu: boolean = false;
    isActiveDashboard: boolean = false;
    isHoverHome: boolean = false;
    isMenuMobile: boolean = false;
    menuActive: any;
    @ViewChild('menu', {read: ElementRef}) menu: ElementRef
    @Output() headerViewChange = new EventEmitter();
    @Output() emitSysId = new EventEmitter<MenuItem>();

    constructor(public translation: TranslationService,
                private router: Router,
                private employee: EmployeeResolver,
    ) {
    }

    ngOnInit(): void {
        this.isMenuMobile = window.innerWidth >= 375 && window.innerWidth < 540;
        if (this.isMenuMobile) {
            this.isHiddenMenu = true;
            this.headerViewChange.emit({
                isExtendMenu: this.isExtendMenu,
                isHiddenMenu: this.isHiddenMenu,
                isMenuMobile: this.isMenuMobile
            });
        }
        this.buildVpsMenus();
    }

    ngAfterViewChecked() {
        this.isMenuMobile = window.innerWidth >= 375 && window.innerWidth < 540;
    }


    /**
     * build vps menu
     */
    buildVpsMenus() {
        const userToken = HrStorage.getUserToken();
        if (userToken == null) {
            this.vpsItems = this.convertVpsMenus(null);
            return null;
        }
        this.convertVpsMenus(userToken.userMenuList);
    }

    /**
     * convert vpsMenu => menuItem
     */
    convertVpsMenus(userMenuList): MenuItem[] {
        if (!userMenuList || userMenuList.length === 0) {
            return null;
        }
       
        for (const item of userMenuList) {
            item.label = item.name;
            item.routerLink = item.url;
            item.icon = 'icon-menu' + '-' + item.code;
            item.command = (event) => {
                this.onClick(event);
            };
            item.isActive = false;
            item.title = item.name;
            item.backgroundImage = `./assets/img/icon/${ICON_MENU[item.code]}`;
            item.backgroundImageBold = `./assets/img/icon/${ICON_MENU[item.code + '_BOLD']}`;
            this.setIconMenu(item, this.isExtendMenu);
            
        }
        this.employee.MENU_ID.subscribe(val => {
                this.vpsItems = userMenuList.filter((item: any) => item.parentId === val);
                let selectedIntoHome = this.vpsItems.find((i: UserMenu) => {
                    if (i.url) return i.url.includes('home')
                });
                let selectedIntoDashboard = this.vpsItems.find((i: UserMenu) => {
                    if (i.url) return i.url.includes('dashboard')
                });
                // set menu active đối với menu được chọn
                this.menuActive = selectedIntoHome ? selectedIntoHome: selectedIntoDashboard;
                (selectedIntoHome) ? this.setActiveItemMenu(selectedIntoHome as UserMenu) : this.setActiveItemMenu(selectedIntoDashboard as UserMenu);
                let url = this.router.url;
                this.employee.SYS_MENU_ID.next(null);

                let findParent: UserMenu;
                let findSecondParent: UserMenu;
                let findThirdParent: UserMenu;
                if (!val) {
                    let findItemByURL = userMenuList.find((item: UserMenu) => {
                        if (item.routerLink === url) item.isActive = true;
                        return item.routerLink === url;
                    })

                    if (!findItemByURL) findItemByURL = userMenuList.find((item: UserMenu) => {
                        const arrayStringURL = this.router.url.split('/');
                        // url = arrayStringURL.filter((element: string, i) => i !== arrayStringURL.length - 1).join('/');
                        url = arrayStringURL.splice(0,3).join('/');
                        if (item.routerLink === url){
                            item.routerLink = this.router.url
                            item.url = this.router.url
                            item.isActive = true;
                        }

                        return item.routerLink === this.router.url;
                    })

                    this.employee.SYS_MENU_ID.next(findItemByURL);

                    if (findItemByURL) findParent = userMenuList.find((item: UserMenu) => item.sysMenuId === findItemByURL.parentId);
                    if (findParent) findSecondParent = userMenuList.find((item: UserMenu) => item.sysMenuId === findParent.parentId);
                    if (findSecondParent) findThirdParent = userMenuList.find((item: UserMenu) => item.sysMenuId === findSecondParent.parentId);

                    if (findThirdParent && findThirdParent.parentId) {
                        this.renderNavMenu(userMenuList, findThirdParent);
                    } else if (findSecondParent && findSecondParent.parentId) {
                        this.renderNavMenu(userMenuList, findSecondParent);
                    } else if (findParent && findParent.parentId) {
                        this.renderNavMenu(userMenuList, findParent);
                    } else {
                        this.renderNavMenu(userMenuList, findItemByURL);
                    }
                    this.vpsItems.forEach((item: UserMenu) => {
                        this.setIconMenu(item, this.isExtendMenu);
                    });
                }
            }
        )
        this.setStyleMenu(this.isExtendMenu, this.isMenuMobile);

    }

    renderNavMenu(userMenuList, menuParent) {
        this.vpsItems = userMenuList.filter((item: UserMenu) => item.parentId === menuParent.parentId);
        this.findingNemo(userMenuList, menuParent.sysMenuId);
        // gán menu được chọn
        this.menuActive = menuParent;
        this.setActiveItemMenu(menuParent as UserMenu);
    }

    findingNemo(menuList: UserMenu[], sysMenuId: number) {
        const menuHeader = menuList.filter((i: UserMenu) => i.parentId === sysMenuId);
        this.employee.HEADER_MENU.next(menuHeader);
    }


    /**
     * set icon menu
     * đối với menu active thì thay ảnh icon bold và tăng font-weight
     */
    async setIconMenu(userMenu: any, isExtend: boolean) {
        await this.convertToDiv(isExtend);
        const nav = document.getElementById('nav-container');
        const icons = await nav.getElementsByClassName(userMenu.icon);
        // kiểm tra phải menu active không
        let imageBoldActive = this.menuActive ? this.menuActive.backgroundImageBold: ''
        let iconActive = this.menuActive ? this.menuActive.icon: ''
        Array.prototype.forEach.call(icons, function (el) {
            const dElement = el.className;
            const classIcon = dElement.split(' ')[2];
            const divElement = document.createElement('div');
            const className = el.getAttribute('class');

            if (className) divElement.setAttribute('class', className);
            el.replaceWith(divElement);

            if (classIcon === userMenu.icon) {
                // kiểm tra để lấy ảnh icon đậm hay thường lúc mới vào từ màn home
                divElement.style.backgroundImage = (iconActive !== '' && classIcon === iconActive)? `url(${imageBoldActive})` :`url(${userMenu.backgroundImage})`;
                divElement.style.backgroundRepeat = 'no-repeat';
                divElement.style.backgroundSize = 'contain';
                divElement.style.padding = '12px';
                divElement.style.position = 'relative';
                divElement.style.left = '0px';
                divElement.style.top = '15px';
                if (isExtend) {
                    divElement.style.removeProperty('position');
                    divElement.style.removeProperty('left');
                    divElement.style.removeProperty('top');
                }
            }
        });
    }

    async convertToDiv(isExtend: boolean) {
        const menuItems = await document.getElementsByClassName('ui-menuitem-text');
        Array.prototype.forEach.call(menuItems, function (el) {

            const divElement = document.createElement('div');
            const className = el.getAttribute('class');
            divElement.innerHTML = el.innerHTML;
            if (className) divElement.setAttribute('class', className);
            divElement.style.marginTop = '20px';

            el.replaceWith(divElement);
            if (isExtend) {
                divElement.style.removeProperty('margin-top');
                divElement.style.marginLeft = '35px';
                divElement.style.textAlign = 'left'
            }

        });
    }

    /**
     * set thuộc tính height khi thay đổi dạng menu muốn xem
     * bold cho menu khi chọn và load lại trang
     */
    async setStyleMenu(isExtend: boolean, isMobileMenu: boolean) {
        const panelMenu = await document.getElementsByClassName('ui-panelmenu-panel');
        Array.prototype.forEach.call(panelMenu, function (el) {
            if (isExtend) {
                el.style.removeProperty('height');
                el.style.height = 'auto';
            }
            if (isMobileMenu) {
                el.style.removeProperty('height');
            }
        });
        // bold cho menu active
        const active = await document.getElementsByClassName('ui-panelmenu-header-link');
        if(this.menuActive){
            let imageBold = this.menuActive.backgroundImageBold
            Array.prototype.forEach.call(active, function (es) {
                if (es.style.borderLeft === '5px solid rgb(255, 182, 0)' && es.style.backgroundColor === 'rgba(198, 31, 27, 1)') {
                    const text = es.getElementsByClassName('ui-menuitem-text');
                    Array.prototype.forEach.call(text, function (i) {
                        i.style.color = '#FFFFFF'
                        i.style.fontWeight = 500
                    })
                    const icons = es.getElementsByClassName('ui-menuitem-icon');
                    Array.prototype.forEach.call(icons, function (i) {
                        i.style.removeProperty('background-image');
                        i.style.backgroundImage = `url(${imageBold})`;
                    })
                }
            })
        }
    }

    /**
     * thay đổi css cho menu khi thay đổi menu lựa chọn
     */
    async setActiveItemMenu(item: UserMenu) {
        const panelMenu = await document.getElementsByClassName('ui-panelmenu-header-link');
        Array.prototype.forEach.call(panelMenu, function (el) {
            if (item.name != null && el.title === item.name) {
                // thêm thuộc tính bao ngoài cho menu được chọn
                el.style.backgroundColor = 'rgba(198, 31, 27, 1)'
                el.style.borderLeft = '5px solid rgb(255, 182, 0)'
                el.style.color = '#fff';
            } else {
                // xóa icon khi đổi menu
                const icons = el.getElementsByClassName('ui-menuitem-icon');
                Array.prototype.forEach.call(icons, function (i) {
                    const dElement = i.className;
                    const classIcon = dElement.split(' ')[2].split('icon-menu-')[1];
                    let backgroundImage = `./assets/img/icon/${ICON_MENU[classIcon]}`;
                    i.style.removeProperty('background-image');
                    i.style.backgroundImage = `url(${backgroundImage})`;
                })
                // xóa text khi đổi menu
                const text = el.getElementsByClassName('ui-menuitem-text');
                Array.prototype.forEach.call(text, function (i) {
                    const dElement = i.textContent;
                    if (dElement === item.name) {
                        i.style.color = '#b3b3c1'
                        i.style.fontWeight = 400
                    }
                })
                //xóa các thuộc tính bao ngoài menu
                el.style.removeProperty('background-color');
                el.style.removeProperty('border');
                el.style.removeProperty('color');
            }
        });
    }

    onMinium() {
        this.isExtendMenu = !this.isExtendMenu;
        for (const item of this.vpsItems) {
            this.setIconMenu(item, this.isExtendMenu);
        }
        if (!this.isExtendMenu) {
            this.isHiddenMenu = true;
        }

        this.headerViewChange.emit({
            isExtendMenu: this.isExtendMenu,
            isHiddenMenu: this.isHiddenMenu,
            isMenuMobile: this.isMenuMobile
        });
    }

    onClick(event) {
        if (event.originalEvent) {
        }

        if (event.item) {
            // lấy menu active khi click chuột vào menu trong nav
            this.menuActive = event.item
            this.isActiveDashboard = false;
            this.setActiveItemMenu(event.item);
            this.setStyleMenu(this.isExtendMenu, this.isMenuMobile);
            const userToken = HrStorage.getUserToken();
            const headerMenu = userToken.userMenuList.filter((i: any) => event.item.sysMenuId === i.parentId);
            if (headerMenu && headerMenu.length) headerMenu[0].isActive = true;
            this.employee.HEADER_MENU.next(headerMenu);
            this.employee.SYS_MENU_ID.next(null);
        }
    }

    displayReturnMenu() {
        this.isHiddenMenu = !this.isHiddenMenu;
        this.isExtendMenu = false;
        this.headerViewChange.emit({
            isExtendMenu: this.isExtendMenu,
            isHiddenMenu: this.isHiddenMenu,
            isMenuMobile: this.isMenuMobile
        });
    }

    displayMobileMenu() {
        this.isMenuMobile = !this.isMenuMobile;
        this.isExtendMenu = true;
        for (const item of this.vpsItems) {
            this.setIconMenu(item, this.isExtendMenu);
        }
    }

    navigate(link: string) {
        this.employee.HEADER_MENU.next(null);

        const panelMenu = document.getElementsByClassName('ui-panelmenu-header-link');
        Array.prototype.forEach.call(panelMenu, function (el) {
            el.style.removeProperty('background-color');
            el.style.removeProperty('border');
            el.style.removeProperty('color');
        });
        this.router.navigate([link]);
    }

    async setIconHover(userMenu: any) {
        const nav = await document.getElementsByClassName('ui-panelmenu-panel');
        Array.prototype.forEach.call(nav, function (el) {
            const icons = el.getElementsByClassName('ui-menuitem-icon');
            el.addEventListener('mouseenter', function (item) {
                Array.prototype.forEach.call(icons, function (i) {
                    const dElement = i.className;
                    const classIcon = dElement.split(' ')[2];
                    if (classIcon === userMenu.icon ) {
                        i.style.removeProperty('background-image');
                        i.style.backgroundImage = `url(${userMenu.backgroundImageBold})`;
                    }
                })
            })
        });
        const textNav = await document.getElementsByClassName('ui-panelmenu-panel');
        Array.prototype.forEach.call(textNav, function (el) {
            const text = el.getElementsByClassName('ui-menuitem-text');
            el.addEventListener('mouseenter', function (item) {
                Array.prototype.forEach.call(text, function (i) {
                    const dElement = i.textContent;
                    if (dElement === userMenu.name) {
                        i.style.color = '#FFFFFF'
                        i.style.fontWeight = 500
                    }
                })
            })
        });
    }

    async setIconOutHover(userMenu: any) {
        let iconActive = this.menuActive ? this.menuActive.icon : ''
        let nameActive = this.menuActive ? this.menuActive.name : ''
        const nav = await document.getElementsByClassName('ui-panelmenu-panel');
        Array.prototype.forEach.call(nav, function (el) {
            const icons = el.getElementsByClassName('ui-menuitem-icon');
            Array.prototype.forEach.call(icons, function (i) {
                const dElement = i.className;
                const classIcon = dElement.split(' ')[2];
                if (classIcon === userMenu.icon && iconActive !== classIcon) {
                    i.style.removeProperty('background-image');
                    i.style.backgroundImage = `url(${userMenu.backgroundImage})`;
                }
            })
        });
        const textNav = await document.getElementsByClassName('ui-panelmenu-panel');
        Array.prototype.forEach.call(textNav, function (el) {
            const text = el.getElementsByClassName('ui-menuitem-text');
            Array.prototype.forEach.call(text, function (i) {
                const dElement = i.textContent;
                if (dElement === userMenu.name && nameActive !== dElement) {
                    i.style.color = '#b3b3c1'
                    i.style.fontWeight = 400
                }
            })
        });
    }

    @HostListener('mouseleave', ['$event'])
    onItemHover(event: any) {
        this.vpsItems.forEach((item: any) => {
            this.setIconOutHover(item);
        })
    }

    @HostListener('mouseenter', ['$event'])
    outItemHover(event: any) {
        this.vpsItems.forEach((item: any) => {
            this.setIconHover(item);
        })
    }


    onHoverHome(event, boolean) {
        this.isHoverHome = boolean;
    }

    /****************** CAC HAM COMMON DUNG CHUNG ****/
    /**
     * f
     */
    get f() {
        return this.formSearch.controls;
    }
}
