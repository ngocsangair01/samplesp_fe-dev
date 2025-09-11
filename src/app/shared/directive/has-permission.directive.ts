import { Directive, OnInit, ElementRef, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { CommonUtils } from '@app/shared/services/common-utils.service';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit {
  private _value: any;
  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {

  }

  @Input()
  set hasPermission(value) {
    this._value = value;
    this.updateView(this._value);
  }

  ngOnInit() {
  }

  private updateView(value) {
    let rsSearch = -1;
    let arrActionOr = [];
    let arrActionAnd = [];

    if (value[1]) {
      if (value[1].includes("||")) {
        arrActionOr = value[1].split("||");
      } else if (value[1].includes("&&")) {
        arrActionAnd = value[1].split("&&");
      }
    }

    if (value[2]) {//resource key
      if (arrActionOr.length > 0) {
        for (let i = 0; i < arrActionOr.length; i++) {
          if (CommonUtils.havePermission(arrActionOr[i].trim(), value[2])) {
            rsSearch = 0;
            break;
          }
        }
      } else if (arrActionAnd.length > 0) {
        for (let i = 0; i < arrActionAnd.length; i++) {
          if (!CommonUtils.havePermission(arrActionAnd[i].trim(), value[2])) {
            rsSearch = -1;
            break;
          }
        }
      } else {
        if (CommonUtils.havePermission(value[1], value[2])) {
          rsSearch = 0;
        }
      }
    } else {
      if (!value[0].permissions || value[0].permissions.length <= 0) {
        this.viewContainer.clear();
        return;
      }

      if (arrActionOr.length > 0) {
        for (let i = 0; i < arrActionOr.length; i++) {
          rsSearch = value[0].permissions.findIndex(x => x.operationCode === CommonUtils.getPermissionCode(arrActionOr[0].trim()));
          if (rsSearch >= 0) break;
        }
      } else if (arrActionAnd.length > 0) {
        for (let i = 0; i < arrActionAnd.length; i++) {
          rsSearch = value[0].permissions.findIndex(x => x.operationCode === CommonUtils.getPermissionCode(arrActionAnd[0].trim()));
          if (rsSearch < 0) break;
        }
      } else {
        rsSearch = value[0].permissions.findIndex(x => x.operationCode === CommonUtils.getPermissionCode(value[1]));
      }
    }

    if (rsSearch < 0) {
      this.viewContainer.clear();
    } else {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

}
