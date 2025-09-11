import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'key-project-index',
  templateUrl: './key-project-index.component.html',
})
export class KeyProjectIndexComponent extends BaseComponent implements OnInit {
  warningType;
  constructor(
    public actr: ActivatedRoute
  ) {
    super(null, CommonUtils.getPermissionCode("resource.projectsForm"));
    const params = this.actr.snapshot.params;
    if (params) {
      this.warningType = params.warningType;
    }
  }

  ngOnInit() {
  }

}
