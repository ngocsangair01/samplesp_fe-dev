import { CommonUtils } from './../../../../shared/services/common-utils.service';
import { TranslationService } from 'angular-l10n';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { HelperService } from '@app/shared/services/helper.service';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';

@Component({
  selector: 'layout',
  providers: [EmployeeResolver],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  @Input()
  formSearch: FormGroup;
  hardItems = [];
  items;
  isView: boolean = false;
  navigationSubscription;
  private _employeeId;
  employeeBean;
  isCollapse: boolean = true;
  menuItem: any;
  constructor(
    private translation: TranslationService,
    private employeeResolver: EmployeeResolver,
    private curriculumVitaeService: CurriculumVitaeService,
    private helperService: HelperService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private partyMemebersService: PartyMemebersService
    
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.activatedRoute.snapshot.params;
        if (this._employeeId !== params.id) {
          this.curriculumVitaeService.getEmployeeInfo(params.id).subscribe(
            res => {
              if (res.type === 'SUCCESS') {
                this._employeeId = params.id;
                this.createTabRouterLink();
                this.helperService.resolveUrlEmployee(this.hardItems);
                this.employeeResolver.resolve(res.data.employeeId);
                this.employeeBean = res.data;

                if (this.activatedRoute.children.length === 0) {
                  this.router.navigate(['/party-organization/party-member/curriculum-vitae', this._employeeId]);
                }
              } else {
                if (this._employeeId) {
                  this.router.navigate(['/party-organization/party-member/curriculum-vitae', this._employeeId]);
                } else {
                  this.router.navigate(['/party-organization/party-member']);
                }
              }
            }
          );
        } else {
          if (this.activatedRoute.children.length === 0) {
            this.router.navigate(['/employee/curriculum-vitae']);
          }
        }
      }
    });

    const subPaths = this.router.url.split('/');
    if (subPaths.length > 5) {
      this.isView = subPaths[5] === 'view';
    }
    this.getMenuItem(subPaths[5]);
  }

  ngOnInit() {
    
  }

  createTabRouterLink() {
    this.hardItems = [
      {
        label: this.translation.translate('app.organization.commonInformation'),
        routerLink: this.isView ? ['/party-organization/party-member/curriculum-vitae', this._employeeId, 'view'] : ['/party-organization/party-member/curriculum-vitae', this._employeeId, 'edit'],
        resource: 'partyMember'
      }, {
        label: this.translation.translate('partymanager.label.employeeT63Information'),
        routerLink: ['/party-organization/party-member/curriculum-vitae', this._employeeId, 'employee-T63-infomation'],
        resource: 'partyMember'
      },
       {
        label: this.translation.translate('app.organization.partyMemberProfile'),
        routerLink: ['/party-organization/party-member/curriculum-vitae', this._employeeId, 'party-profile'],
        resource: 'partyMember'
      },
      {
        label: this.translation.translate('app.emp.tabMenu.empTypeProcess'),
        routerLink: ['/party-organization/party-member/curriculum-vitae', this._employeeId, 'emp-type-process'],
        resource: 'partyMember'
      },
      // {
      //   label: this.translation.translate('employee.assessment.tabMenu'),
      //   routerLink: ['/party-organization/party-member/curriculum-vitae', this._employeeId, 'assessment'],
      //   resource: 'assessmentEmployee'
      // },
      {
        label: this.translation.translate('app.emp.tabMenu.qualityRating'),
        routerLink: ['/party-organization/party-member/curriculum-vitae', this._employeeId, 'quality-rating'],
        resource: 'qualityAnalysisParty'
      },
      // {
      //   label: this.translation.translate('app.emp.tabMenu.joinCongress'),
      //   routerLink: ['/party-organization/party-member/curriculum-vitae', this._employeeId, 'join-congress'],
      //   resource: 'congress'
      // },
      {
        label: this.translation.translate('app.emp.tabMenu.reward'),
        routerLink: ['/party-organization/party-member/curriculum-vitae', this._employeeId, 'reward'],
        resource: 'rewardParty'
      },
      {
        label: this.translation.translate('app.emp.tabMenu.workProcess'),
        routerLink: ['/party-organization/party-member/curriculum-vitae', this._employeeId, 'work-process'],
        resource: 'partyMember'
      },
      // {
      //   label: this.translation.translate('app.emp.tabMenu.keyProject'),
      //   routerLink: ['/employee/curriculum-vitae', this._employeeId, 'key-project'],
      //   resource: 'employeeManager'
      // },
      {
        label: this.translation.translate('partymanager.label.punishment'),
        routerLink: ['/party-organization/party-member/curriculum-vitae', this._employeeId, 'punishment'],
        resource: 'punishment'
      },
      {
        label: this.translation.translate('partymanager.label.educationProcess'),
        routerLink: ['/party-organization/party-member/curriculum-vitae', this._employeeId, 'education-process'],
        resource: 'partyMemberProcess'
      },
      {
        label: this.translation.translate('app.emp.tabMenu.partyMemberProcess'),
        routerLink: ['/party-organization/party-member/curriculum-vitae', this._employeeId, 'party-member-process'],
        resource: 'partyMemberProcess'
      }
    ];
    this.buildDefaultMenu();
  }

  private buildDefaultMenu() {
    this.items = [];
    const listResource = [];
    let listPermission: any;
    for (const item of this.hardItems) {
      listResource.push(CommonUtils.getPermissionCode("resource." + item.resource));
    }
    listPermission = CommonUtils.getPermissionByListResourceCode(listResource);
    for (const item of this.hardItems) {
      const resourceCode = CommonUtils.getPermissionCode("resource." + item.resource)
      if (this.hasPermission("action.view", resourceCode, listPermission)) {
        this.items.push(item);
      }
    }
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  public redirectTo(item) {
    this.router.navigate(item.routerLink);
  }

  private hasPermission(operationKey: string, resourceCode: string, listPermissions): boolean {
    if (!listPermissions || listPermissions.length <= 0) {
      return false;
    }
    const rsSearch = listPermissions.findIndex(x => x.operationCode === CommonUtils.getPermissionCode(operationKey) && x.resourceCode === resourceCode);
    if (rsSearch < 0) {
      return false;
    }
    return true;
  }

  collapse() {
    this.isCollapse = !this.isCollapse;
  }

  activeItemChange($event) {
    let urlPath = this.router.url.split('/');
    if (urlPath.length > 5) {
      this.getMenuItem(urlPath[5]);
      this.partyMemebersService.changeTab.next(urlPath[5]);
    }
  }

  getMenuItem(url: any) {
    switch (url) {
      case 'view':
        this.menuItem = [
          { name: 'Thông tin cơ bản', id: 'employeeInformation' },
          { name: 'Thông tin cán bộ', id: 'generalInformation' },
          { name: 'Thông tin tùy thân', id: 'personalInformation' },
          { name: 'Thông tin Đảng, Đoàn', id: 'partyInformation' },
          { name: 'Thông tin tổ chức khác', id: 'otherInformation' },
          { name: 'Thông tin bảo vệ an ninh', id: 'securityInformation' }
        ];
        break;
      case 'edit':
        this.menuItem = [
          { name: 'Thông tin cơ bản', id: 'employeeInformation' },
          { name: 'Thông tin cán bộ', id: 'generalInformation' },
          { name: 'Thông tin tùy thân', id: 'personalInformation' },
          { name: 'Thông tin Đảng, Đoàn', id: 'partyInformation' },
          { name: 'Thông tin tổ chức khác', id: 'otherInformation' },
          { name: 'Thông tin bảo vệ an ninh', id: 'securityInformation' }
        ];
        break;
      case 'employee-T63-infomation':
        this.menuItem = [
          { name: 'Thông tin bổ sung T63', id: 'employeeT63Information' },
          { name: 'Tình hình KT - CT của gia đình', id: 'politicalAndEconomicSituationOfFamily' },
          { name: 'Tình hình KT - CT của gia đình vợ, vợ (chồng)', id: 'politicalAndEconomicSituationOfFamilyWife' },
          { name: 'Tóm tắt nhận xét', id: 'reviewSummary' }
        ];
        break;
      case 'party-profile':
        this.menuItem = [
          { name: 'Danh sách tên tài liệu, hồ sơ Đảng viên cần tải thêm', id: 'fileHardCopyUploadLst' },
          { name: 'Danh sách hồ sơ cứng Đảng viên', id: 'resultList' }
        ];
        break;
      case 'emp-type-process':
        this.menuItem = [
          { name: 'Danh sách quá trình diện đối tượng', id: 'listContractProcess' }
        ];
        break;
      case 'quality-rating':
        this.menuItem = [
          { name: 'Danh sách xếp loại đánh giá Đảng viên', id: 'listQualityRatingPartyMember' }
        ];
        break;
      case 'reward':
        this.menuItem = [
          { name: 'Danh sách khen thưởng Đảng viên theo tổ chức Đảng', id: 'listTitle' }
        ];
        break;
      case 'work-process':
        this.menuItem = [
          { name: 'Danh sách quá trình công tác', id: 'curriculumvitaesecurity' }
        ];
        break;
      case 'punishment':
        this.menuItem = [
          { name: 'Danh sách kỷ luật cá nhân', id: 'personalPunishment' }
        ];
        break;
      case 'education-process':
        this.menuItem = [
          { name: 'Quá trình đào tạo', id: 'educationProcess' }
        ];
        break;
      case 'party-member-process':
        this.menuItem = [
          { name: 'Danh sách quá trình sinh hoạt Đảng', id: 'partyMemberProcess' },
          { name: 'Danh sách quá trình tham gia cấp Ủy', id: 'partyConcurrentProcess' }
        ];
        break;
      default:
        this.menuItem = [
          { name: 'Thông tin cơ bản', id: 'employeeInformation' },
          { name: 'Thông tin cán bộ', id: 'generalInformation' },
          { name: 'Thông tin tùy thân', id: 'personalInformation' },
          { name: 'Thông tin Đảng, Đoàn', id: 'partyInformation' },
          { name: 'Thông tin tổ chức khác', id: 'otherInformation' },
          { name: 'Thông tin bảo vệ an ninh', id: 'securityInformation' }
        ];
        break;
    }
  }

  selectItem(id: any) {
    this.partyMemebersService.selectMenuItem.next(id);
  }
}
