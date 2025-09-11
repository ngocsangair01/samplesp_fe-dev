import { HomeEmployeeService } from '@app/core/services/home/home-employee.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HrStorage } from '@app/core/services/HrStorage';
import { AuthService } from '@app/core/services/auth.service';
import { Constants } from '@env/environment';
import { HelperService } from '@app/shared/services/helper.service';
import { LocaleService } from 'angular-l10n';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'auth-sso-login',
  templateUrl: './auth-sso-login.component.html',
  styles: []
})

export class AuthSsoLoginComponent implements OnInit {
  navigationSubscription;
  error: string;
  urlBack = '';
  url='';
  whiteListUrl = ['10.60.133.38', '10.60.7.238', 'congtacdang-congtacchinhtri.sangnn.vn'];
  constructor(public router: Router,
    public authService: AuthService,
    public activatedRoute: ActivatedRoute,
    public helperService: HelperService,
    public homeEmployeeService: HomeEmployeeService,
    public locale: LocaleService) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['ticket']) {
        this.helperService.isProcessing(true);
        const user: any = {};
        user.access_token = params['ticket'];
        user.redirect = params['redirect'];
        this.url = params['url'];
        HrStorage.setUserToken(user);
        this.authService.tokenInfos().subscribe(res => {
          if (res && res.data) {
            user.userId = res.data.userId;
            user.employeeCode = res.data.staffCode;
            user.tokenExpiresIn = res.data.exp;
            user.userName = res.data.user_name;
            user.email = res.data.email;
          }
          let urlBack = this.activatedRoute.snapshot.paramMap.get("url");
          this.authService.actionRequestAuthorities(Constants.applicationCode)
            .subscribe(data => {
              const authorities = data.data;
              const hostName = window.location.hostname;
              if (authorities && authorities.length > 0) {
                user.userPermissionList = authorities[0].permissions;
                user.userMenuList = authorities[0].grantedMenus;
                HrStorage.setUserToken(user);
                this.homeEmployeeService.getEmployeeInfo(user.employeeCode)
                  .subscribe(userInfo => {
                    user.userInfo = userInfo.data;
                    HrStorage.setUserToken(user);
                    if(this.url) {
                        if (this.url.indexOf('assessment/detail/') >= 0) {
                            window.location.href = this.url;
                        }
                        else{
                            this.router.navigate([this.url]);
                        }
                    }
                    else {
                        this.redirectAddress();
                    }
                  });
              } else if (urlBack == "assessment") { //Không check quyền đối với trang đánh giá
                this.homeEmployeeService.getEmployeeInfo(user.employeeCode)
                  .subscribe(userInfo => {
                    user.userInfo = userInfo.data;
                    HrStorage.setUserToken(user);
                    if(this.url) {
                      this.router.navigate([this.url]);
                    } else {
                      this.router.navigate(['/' + this.urlBack]);
                    }
                  });
              } else if (this.whiteListUrl.indexOf(hostName) !== -1 || hostName == "localhost" ){
                this.homeEmployeeService.getEmployeeInfo(user.employeeCode)
                  .subscribe(userInfo => {
                    user.userInfo = userInfo.data;
                    HrStorage.setUserToken(user);
                    this.urlBack = 'assessment';
                    if(this.url) {
                      this.router.navigate([this.url]);
                    } else {
                      this.router.navigate(['/' + this.urlBack]);
                    }
                  });
              }
            });
        });
      } else {
        this.error = 'Invalid username or password';
      }
    });
  }
  private redirectAddress() {
    this.urlBack = this.activatedRoute.snapshot.paramMap.get("url");
    if (CommonUtils.isNullOrEmpty(this.urlBack)) {
      const url = '/home';
      this.router.navigate([url]);
    }
    else {
      this.router.navigate(['/' + this.urlBack]);
    }
  }
  ngOnInit() {
  }

}
