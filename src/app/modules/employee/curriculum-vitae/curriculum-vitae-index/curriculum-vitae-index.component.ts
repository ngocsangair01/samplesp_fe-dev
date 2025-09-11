import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { CommonUtils } from '@app/shared/services';


@Component({
  selector: 'curriculum-vitae-index',
  templateUrl: './curriculum-vitae-index.component.html'
})
export class CurriculumVitaeIndexComponent extends BaseComponent implements OnInit {
  warningType;
  constructor(
    private router: Router,
    public actr: ActivatedRoute
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.router.events.subscribe((e: any) => {
      // console.log('route', 1);
      // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          const params = this.actr.snapshot.params;
          if (params) {
            this.warningType = params.warningType;
          }
        }
      });
  }

  ngOnInit() {
  }
}
