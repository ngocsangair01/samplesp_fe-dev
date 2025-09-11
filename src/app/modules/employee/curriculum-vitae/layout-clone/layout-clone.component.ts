import { CommonUtils } from '../../../../shared/services/common-utils.service';
import { TranslationService } from 'angular-l10n';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';

@Component({
  selector: 'layout',
  providers: [EmployeeResolver],
  templateUrl: './layout-clone.component.html'
})
export class LayoutCloneComponent implements OnInit, OnDestroy {
  @Input()
  formSearch: FormGroup;
  hardItems = [];
  items;
  isView: boolean = false;
  navigationSubscription;
  private _employeeId;
  employeeBean;
  constructor(
    private translation: TranslationService,
    private employeeResolver: EmployeeResolver,
    private curriculumVitaeService: CurriculumVitaeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private partyMemebersService: PartyMemebersService,
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
                this.employeeResolver.resolve(res.data.employeeId);
                this.employeeBean = res.data;
                // this.partyMemebersService.findProcessByEmployeeId(this._employeeId).subscribe(
                //   res2 => {
                //     if(res2.data.length > 0) {
                //       this.hardItems.push({
                //         label: this.translation.translate('app.emp.tabMenu.partyMemberProcess'),
                //         routerLink: ['/employee/curriculum-vitae', this._employeeId, 'party-member-process'],
                //         resource: 'partyMemberProcess'
                //       });
                //       this.buildDefaultMenu();
                //     }
                //   }
                // );
                if (this.activatedRoute.children.length === 0) {
                  this.router.navigate(['/employee/curriculum-vitae-clone', this._employeeId]);
                }
              } else {
                if (this._employeeId) {
                  this.router.navigate(['/employee/curriculum-vitae-clone', this._employeeId]);
                } else {
                  this.router.navigate(['/employee/curriculum-vitae-clone']);
                }
              }
            }
          );
        } else {
          if (this.activatedRoute.children.length === 0) {
            this.router.navigate(['/employee/curriculum-vitae-clone']);
          }
        }
      }
    });

    const subPaths = this.router.url.split('/');
    if (subPaths.length > 4) {
      this.isView = subPaths[4] === 'view';
    }
  }

  ngOnInit() {

  }

  createTabRouterLink() {
    this.hardItems  = [
      {
        label: this.translation.translate('app.organization.commonInformation'),
        routerLink: this.isView ? ['/employee/curriculum-vitae', this._employeeId, 'view'] : ['/employee/curriculum-vitae', this._employeeId, 'edit'],
        resource: 'employeeManager'
      }
      // , {
      //   label: this.translation.translate('partymanager.label.employeeT63Information'),
      //   routerLink: ['/employee/curriculum-vitae', this._employeeId, 'employee-T63-infomation'],
      //   resource: 'employeeT63Information'
      // }, {
      //   label: 'Hồ sơ cán bộ',
      //    routerLink: ['/employee/curriculum-vitae', this._employeeId, 'emp-profile'], 
      //   resource: 'empFile'
      // }, {
      //   label: this.translation.translate('app.emp.tabMenu.empTypeProcess'),
      //   routerLink: ['/employee/curriculum-vitae', this._employeeId, 'emp-type-process'],
      //   resource: 'empTypeProcess'
      // },
      // {
      //   label: this.translation.translate('employee.assessment.tabMenu'),
      //   routerLink: ['/employee/curriculum-vitae', this._employeeId, 'assessment'], 
      //   resource: 'employeeManager'
      // },
      // {
      //   label: this.translation.translate('app.emp.tabMenu.qualityRating'),
      //   routerLink: ['/employee/curriculum-vitae', this._employeeId, 'quality-rating'],
      //   resource: 'employeeManager'
      // },
      // {
      //   label: this.translation.translate('app.emp.tabMenu.joinCongress'),
      //   routerLink: ['/employee/curriculum-vitae', this._employeeId, 'join-congress'],
      //   resource: 'employeeManager'
      // },
      // {
      //   label: this.translation.translate('app.emp.tabMenu.reward'),
      //   routerLink: ['/employee/curriculum-vitae', this._employeeId, 'reward'],
      //   resource: 'employeeManager'
      // },
      // {
      //   label: this.translation.translate('app.emp.tabMenu.workProcess'),
      //   routerLink: ['/employee/curriculum-vitae', this._employeeId, 'work-process'],
      //   resource: 'employeeManager'
      // },
      // {
      //   label: this.translation.translate('app.emp.tabMenu.keyProject'),
      //   routerLink: ['/employee/curriculum-vitae', this._employeeId, 'key-project'],
      //   resource: 'employeeManager'
      // },
      // {
      //   label: this.translation.translate('partymanager.label.punishment'),
      //   routerLink: ['/employee/curriculum-vitae', this._employeeId, 'punishment'],
      //   resource: 'punishment'
      // }
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
      if (this.hasPermission('action.view', resourceCode, listPermission)) {
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
}
